const httpStatus = require('http-status-codes');
const filter = require('filter-object');
// const log4js = require('log4js');

const InstitucionFinanciera = use('App/Models/InstitucionFinanciera');

// const log = log4js.getLogger('app');

class InstitucionFinancieraController {
  async listarInstituciones(request, response) {
    const arrList = await InstitucionFinanciera.listar();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrList.map(row => filter(
        row.toJSON(),
      )),
    });
  }
}
module.exports = InstitucionFinancieraController;
