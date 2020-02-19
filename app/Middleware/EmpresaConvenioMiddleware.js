class EmpresaConvenioMiddleware {
  async setEmpresasConvenio(request, response, next) {
    console.log('username from middleware empresa', request.user.id);
    // const colaborador = await Colaborador.findByUsuarioId({ usuarioId: request.user.id });
    return next();
  }
}

module.exports = EmpresaConvenioMiddleware;
