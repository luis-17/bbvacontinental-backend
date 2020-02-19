const httpStatus = require('http-status-codes');

const Colaborador = use('App/Models/Colaborador');
const Usuario = use('App/Models/Usuario');
const Database = use('Database');

class ColaboradorController {
  async listarColaboradoresAnalista(request, response) {
    const arrList = await Colaborador.listarColaboradoresAnalista(request.query);
    const arrListAux = arrList.map((row) => {
      let strEstado = null;
      if (row.estado === 1) { // estado habilitado
        strEstado = 'HABILITADO';
      }
      if (row.estado === 2) { // estado deshabilitado
        strEstado = 'DESHABILITADO';
      }
      return {
        id: row.id,
        nombres: row.nombres,
        apellidoPaterno: row.apellidoPaterno,
        apellidoMaterno: row.apellidoMaterno,
        numeroDocumento: row.numeroDocumento,
        correo: row.correo,
        estado: strEstado,
        estadoValor: row.estado,
      };
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrListAux,
    });
  }

  async listarColaboradoresFuvex(request, response) {
    const arrList = await Colaborador.listarColaboradoresFuvex(request.query);
    const arrListAux = arrList.map((row) => {
      let strEstado = null;
      if (row.estado === 1) { // estado habilitado
        strEstado = 'HABILITADO';
      }
      if (row.estado === 2) { // estado deshabilitado
        strEstado = 'DESHABILITADO';
      }
      return {
        id: row.id,
        nombres: row.nombres,
        apellidoPaterno: row.apellidoPaterno,
        apellidoMaterno: row.apellidoMaterno,
        numeroDocumento: row.numeroDocumento,
        correo: row.correo,
        estado: strEstado,
        estadoValor: row.estado,
      };
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrListAux,
    });
  }

  async registrarColaborador(request, response) {
    // validar que no permita registrar mismo usuario
    const { nombres, apellidoPaterno } = request.body;
    const username = `${nombres.replace(/ /g, '')}.${apellidoPaterno}`;
    console.log(username, 'username');
    const fUsuario = await Usuario.findOne({ where: { username } });
    console.log(fUsuario, 'fUsuario');
    // `${data.nombres.replace(/ /g, '')}.${data.apellidoPaterno}`
    if (fUsuario) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'Ya existe un usuario con el mismo nombre.',
        data: null,
      });
    }
    const rpta = await Colaborador.registrarColaborador(request.body);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: rpta,
    });
  }

  async registrarColaboradorAnalista(request, response) {
    // validar que no permita registrar mismo usuario
    const { nombres, apellidoPaterno } = request.body;
    const username = `${nombres.replace(/ /g, '')}.${apellidoPaterno}`;
    const fUsuario = await Usuario.findOne({ where: { username } });
    // `${data.nombres.replace(/ /g, '')}.${data.apellidoPaterno}`
    if (fUsuario) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'Ya existe un usuario con el mismo nombre.',
        data: null,
      });
    }
    const rpta = await Colaborador.registrarColaboradorAnalista(request.body);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: rpta,
    });
  }

  async deleteEmployee(request, response) {
    const t = await Database.sequelize.transaction();
    const { id } = request.params;
    // const fColaborador = await Colaborador.findOne({ where: { id } });
    try {
      await Colaborador.update({
        estado: 2,
      }, {
        where: {
          id,
        },
        transaction: t,
      });
      // await Usuario.destroy({
      //   where: {
      //     id: fColaborador.usuarioId,
      //   },
      //   transaction: t,
      // });
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }
}
module.exports = ColaboradorController;
