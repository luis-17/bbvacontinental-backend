const httpStatus = require('http-status-codes');
const filter = require('filter-object');
// const log4js = require('log4js');

const CondicionLaboral = use('App/Models/CondicionLaboral');

// const log = log4js.getLogger('app');

class CondicionLaboralController {
  async listarCondicionesLaborales(request, response) {
    const arrList = await CondicionLaboral.listar();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrList.map(row => filter(
        row.toJSON(),
      )),
    });
  }
}
module.exports = CondicionLaboralController;
