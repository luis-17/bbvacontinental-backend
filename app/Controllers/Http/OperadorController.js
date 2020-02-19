const httpStatus = require('http-status-codes');
const filter = require('filter-object');
// const log4js = require('log4js');

const Operador = use('App/Models/Operador');

// const log = log4js.getLogger('app');

class OperadorController {
  async listarOperadores(request, response) {
    const arrList = await Operador.findAll();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrList.map(row => filter(
        row.toJSON(),
      )),
    });
  }
}
module.exports = OperadorController;
