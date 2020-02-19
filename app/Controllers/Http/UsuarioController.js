const httpStatus = require('http-status-codes');
const filter = require('filter-object');
// const log4js = require('log4js');
const nanoid = require('nanoid/async');
const moment = require('moment-timezone');
const { encode, decode } = require('url-encode-decode');

const Usuario = use('App/Models/Usuario');
const Colaborador = use('App/Models/Colaborador');
const Password = use('Password');
const EmailLostpass = use('Email/Lostpass');
const JWT = use('JWT');

// const log = log4js.getLogger('app');

const KEEP_ALIVE = parseInt(process.env.KEEP_ALIVE, 10);

class UserController {
  async store(request, response) {
    const fUsuario = await Usuario.createDefault(request.body);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: filter(fUsuario.toJSON(), this.fields),
    });
  }

  async login(request, response) {
    const { username, password } = request.body;
    const auxUsuario = await Usuario.findByUsername(username);
    if (auxUsuario) {
      const { fUsuario, rol } = auxUsuario;
      if (fUsuario.estado === 2) {
        const minutes = moment().diff(fUsuario.suspendedUntil, 'minutes');
        if (minutes < 0) {
          return response.status(httpStatus.BAD_REQUEST).json({
            message: `Usuario bloqueado, podr\u00E1 volver a intentarlo en ${-minutes} minuto${-minutes === 1 ? '' : 's'}`,
            data: null,
          });
        }
        fUsuario.estado = 1;
        fUsuario.suspendedUntil = null;
        fUsuario.passwordAttemptCount = 0;
      }
      fUsuario.lastPasswordAttempt = new Date();
      const ipAddress = request.ip;
      const match = await Password.compare(password, fUsuario.password);
      if (match) {
        // si se fuerza al usuario cambiar su contraseña
        if (fUsuario.forceUserChangePassword) {
          const resetPassToken = await nanoid();
          fUsuario.resetPassToken = resetPassToken;
          fUsuario.resetPassExpires = moment().add(24, 'hours').toDate();
          await fUsuario.save();
          return response.status(httpStatus.IM_A_TEAPOT).json({
            message: 'Requiere cambiar la contrase\u00F1a',
            data: encode(resetPassToken),
          });
        }

        if (fUsuario.ultToken !== null && moment().diff(fUsuario.lastConnection, 'seconds') < KEEP_ALIVE) {
          return response.status(httpStatus.UNAUTHORIZED).json({
            message: 'Se ha iniciado sesi\u00F3n en otro dispositivo',
            data: null,
          });
        }

        const token = await JWT.sign({
          username,
          rol,
        });
        fUsuario.ultToken = token;
        fUsuario.fechaUltInicioSesion = new Date();
        fUsuario.ultDireccionIp = ipAddress;
        fUsuario.passwordAttemptCount = 0;
        fUsuario.lastConnection = new Date();
        await fUsuario.save();
        return response.status(httpStatus.OK).json({
          message: 'OK',
          data: token,
        });
      }
      fUsuario.passwordAttemptCount = (fUsuario.passwordAttemptCount || 0) + 1;
      if (fUsuario.passwordAttemptCount >= 4) {
        fUsuario.suspendedUntil = moment().add(15, 'minutes').toDate();
        fUsuario.estado = 2;
      }
      await fUsuario.save();
      if (fUsuario.passwordAttemptCount >= 4) {
        return response.status(httpStatus.BAD_REQUEST).json({
          message: 'Usuario bloqueado, podr\u00E1 volver a intentarlo en 15 minutos',
          data: null,
        });
      }
    }
    return response.status(httpStatus.BAD_REQUEST).json({
      message: 'Usuario y/o contrase\u00F1a incorrecta',
      data: null,
    });
  }

  async listarFuvexForAdmin(request, response) {
    const { empresa, perfil } = request;
    let arrEmpresa = [];
    if (empresa) {
      arrEmpresa = empresa.map(row => row.empresaId); // empresa.filter(row => row.id);
    }
    console.log(arrEmpresa, 'arrEmpresaf');
    let listaFuvexAdmin = await Usuario.listaFuvexAdmin();
    if (!(perfil.perfilId === 7 || perfil.perfilId === 8)) {
      listaFuvexAdmin = [];
    }
    // console.log(listaFuvexAdmin, 'asdx');
    // const arrFuvex = [];
    // listaFuvexAdmin.forEach((rowMaster) => {
    //   console.log(JSON.stringify(rowMaster), 'stringifyyy');
    //   rowMaster.EmpresaUsuario.Empresa.forEach((row) => {
    //     arrFuvex.push({
    //       id: row.Colaborador.Usuario.id,
    //       username: row.Colaborador.Usuario.username,
    //     });
    //   });
    // });
    // const arrFuvex = listaFuvexAdmin.map(row => ({
    //   id: row.EmpresaUsuario.Empresa.Colaborador.map(row),
    //   username: row.EmpresaUsuario.Empresa.Colaborador.Usuario.username,
    //   // id: row.EmpresaUsuario.Empresa.Colaborador.Usuario.id,
    //   // username: row.EmpresaUsuario.Empresa.Colaborador.Usuario.username,
    // }));
    // console.log(arrFuvex, 'arrFuvexfdf');
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: listaFuvexAdmin.map(row => filter(
        row.toJSON(),
      )),
    });
  }

  async lostpass(request, response) {
    const { email: correo } = request.body;
    const fColaborador = await Colaborador.findOne({
      where: { correo },
      include: [{
        model: Usuario,
        as: 'Usuario',
      }],
    });

    if (fColaborador) {
      const { Usuario: fUsuario } = fColaborador;
      const resetPassToken = await nanoid();
      fUsuario.resetPassToken = resetPassToken;
      fUsuario.resetPassExpires = moment().add(24, 'hours').toDate();
      const url = `${process.env.WEB_URL}/resetpass/${encode(resetPassToken)}`;
      await EmailLostpass.send({
        to: correo,
        substitutions: {
          fullname: fColaborador.fullname,
          product_name: 'Kontigo',
          operating_system: request.useragent.os,
          browser_name: request.useragent.browser,
          action_url: url,
        },
      });
      await fUsuario.save();
      return response.status(httpStatus.OK).json({
        message: 'Ok',
        data: null,
      });
    }
    return response.status(httpStatus.BAD_REQUEST).json({
      message: 'Correo electr\u00F3nico no registrado',
      data: null,
    });
  }

  async resetpass(request, response) {
    const { password, code } = request.body;
    const resetPassToken = decode(code);
    const fUsuario = await Usuario.findByResetPass({ resetPassToken });
    if (fUsuario) {
      fUsuario.password = await Password.hash(password);
      fUsuario.resetPassToken = null;
      fUsuario.resetPassExpires = null;
      fUsuario.estado = 1;
      fUsuario.suspendedUntil = null;
      fUsuario.passwordAttemptCount = 0;
      fUsuario.forceUserChangePassword = false;
      await fUsuario.save();
      return response.status(httpStatus.OK).json({
        message: 'Ok',
        data: null,
      });
    }
    return response.status(httpStatus.BAD_REQUEST).json({
      message: 'C\u00F3digo inv\u00E1lido',
      data: null,
    });
  }

  async logout(request, response) {
    const { tokenPayload } = request;
    const { fUsuario } = await Usuario.findByUsername(tokenPayload.username);
    fUsuario.ultToken = null;
    await fUsuario.save();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }

  async keepAlive(request, response) {
    const { user: fUsuario } = request;
    fUsuario.lastConnection = new Date();
    await fUsuario.save();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }
}

module.exports = UserController;
