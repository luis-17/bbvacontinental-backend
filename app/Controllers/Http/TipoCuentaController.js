const httpStatus = require('http-status-codes');
const filter = require('filter-object');
// const log4js = require('log4js');

const TipoCuenta = use('App/Models/TipoCuenta');

// const log = log4js.getLogger('app');

class TipoCuentaController {
  async listarTiposDeCuenta(request, response) {
    const arrList = await TipoCuenta.listar();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrList.map(row => filter(
        row.toJSON(),
      )),
    });
  }
}
module.exports = TipoCuentaController;
