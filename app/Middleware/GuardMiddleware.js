const User = use('App/Models/Usuario');
const Colaborador = use('App/Models/Colaborador');
const UsuarioPerfil = use('App/Models/UsuarioPerfil');
const EmpresaUsuario = use('App/Models/EmpresaUsuario');
const httpStatus = require('http-status-codes');

const JWT = use('JWT');

class GuardMiddleware {
  async check(request, response, next) {
    let token = null;
    let tokenPayload = null;
    if (request.method === 'GET' && request.query.code) {
      token = request.query.code;
      console.log(token, 'tokennn');
      tokenPayload = await JWT.verify(token);
    } else {
      ({ tokenPayload } = request);
      token = request.headers.authorization.substring(7);
    }
    const auxUser = await User.findByUsername(tokenPayload.username);
    const user = auxUser.fUsuario;
    if (user && user.estado === 1) {
      if (user.ultToken === token) {
        request.user = user;
        const colaborador = await Colaborador.findOne({ where: { usuarioId: user.id } });
        const perfil = await UsuarioPerfil.findOne({
          where: { usuarioId: user.id },
        });
        const listaEmpresaUsuario = await EmpresaUsuario.findAll({
          where: { usuarioId: user.id },
        });
        if (colaborador) {
          request.colaborador = colaborador;
        }
        if (perfil) {
          request.perfil = perfil;
          if (perfil.perfilId === 8 && listaEmpresaUsuario) { // supervisor admin
            request.empresa = listaEmpresaUsuario;
          }
        }
        return next();
      }
      return response.status(httpStatus.UNAUTHORIZED).json({
        message: 'Se ha iniciado sesi\u00F3n en otro dispositivo',
        data: null,
      });
    }
    return response.status(httpStatus.UNAUTHORIZED).json({
      message: 'No autorizado',
      data: null,
    });
  }
}

module.exports = GuardMiddleware;
