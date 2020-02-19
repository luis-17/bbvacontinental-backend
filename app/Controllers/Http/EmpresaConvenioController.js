const httpStatus = require('http-status-codes');

const EmpresaConvenio = use('App/Models/EmpresaConvenio');

class EmpresaConvenioController {
  async listarEmpresasConvenioDeFuvex(request, response) {
    const arrList = await EmpresaConvenio.listarEmpresasConvenioDeFuvex(
      { colaboradorId: request.colaborador.id, perfilId: request.perfil.perfilId },
    );
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrList.map(row => row.toJSON()),
    });
  }
}
module.exports = EmpresaConvenioController;
