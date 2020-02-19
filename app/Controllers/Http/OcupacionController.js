const httpStatus = require('http-status-codes');
const filter = require('filter-object');
// const log4js = require('log4js');

const Ocupacion = use('App/Models/Ocupacion');

// const log = log4js.getLogger('app');

class OcupacionController {
  async listarOcupaciones(request, response) {
    const arrList = await Ocupacion.findAll();
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrList.map(row => filter(
        row.toJSON(),
      )),
    });
  }
}
module.exports = OcupacionController;
