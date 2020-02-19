const httpStatus = require('http-status-codes');
const filter = require('filter-object');
// const log4js = require('log4js');

const FrecuenciaPago = use('App/Models/FrecuenciaPago');

// const log = log4js.getLogger('app');

class FrecuenciaPagoController {
  async listarFrecuenciasPago(request, response) {
    const arrList = await FrecuenciaPago.listar();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrList.map(row => filter(
        row.toJSON(),
      )),
    });
  }
}
module.exports = FrecuenciaPagoController;
