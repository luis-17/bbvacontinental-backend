const httpStatus = require('http-status-codes');

const CampaniaConvenio = use('App/Models/CampaniaConvenio');

class CampaniaConvenioController {
  async listarCampaniasDeEmpresa(request, response) {
    const arrListFilter = [];
    const arrList = await CampaniaConvenio.listar(request.query);
    arrList.forEach((row) => {
      arrListFilter.push({
        campaniaConvenioId: row.id,
        nombre: row.descripcionCorta,
        tasa: row.tasa,
        diaPago: row.diaPago,
      });
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrListFilter,
    });
  }
}
module.exports = CampaniaConvenioController;
