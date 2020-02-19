const Cliente = use('App/Models/Cliente');

class SolicitudEnCursoMiddleware {
  async check(request, response, next) {
    const { clienteId } = request.body;
    if (clienteId) {
      const cliente = await Cliente.findByPk(clienteId);
      request._cliente = cliente;
    } else {
      request._cliente = null;
    }
    return next();
  }
}

module.exports = SolicitudEnCursoMiddleware;
