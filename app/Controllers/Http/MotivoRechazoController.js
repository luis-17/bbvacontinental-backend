const log4js = require('log4js');
const httpStatus = require('http-status-codes');

const MotivoRechazo = use('App/Models/MotivoRechazo');

const log = log4js.getLogger('app');

class MotivoRechazoController {
  async listarMotivosRechazo(request, response) {
    log.debug('listarMotivosRechazo');
    try {
      const motivosRechazo = await MotivoRechazo.listarPorConvenio(request.query);
      return response.status(httpStatus.OK).json({
        message: 'OK',
        data: motivosRechazo,
      });
    } catch (e) {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'OK',
        data: e.message,
      });
    }
  }
}

module.exports = MotivoRechazoController;
