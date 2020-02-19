// const log4js = require('log4js');
const httpStatus = require('http-status-codes');

// const log = log4js.getLogger('app');
const Solicitud = use('App/Models/Solicitud');
const ClienteLaboral = use('App/Models/ClienteLaboral');

class LectorController {
  async actualizarDesdeLectorOk(request, response) {
    // validar que no actualice en estado DESBLOQUEADO
    const { solicitudId } = request.body;
    const fSolicitud = await Solicitud.verSolicitud(solicitudId);
    // console.log(fSolicitud, 'fSolicituddd');
    if (fSolicitud.estadoLector !== 'B') {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'Solicitud ya ha sido enviada o finalizada.',
        data: null,
      });
    }
    await ClienteLaboral.actualizarDesdeLectorOk(request.body);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }

  async actualizarDesdeLectorRechazo(request, response) {
    const { solicitudId } = request.body;
    const fSolicitud = await Solicitud.verSolicitud(solicitudId);
    if (fSolicitud.estadoLector !== 'B') {
      return response.status(httpStatus.BAD_REQUEST).json({
        message: 'Solicitud ya ha sido enviada o finalizada.',
        data: null,
      });
    }
    await ClienteLaboral.actualizarDesdeLectorRechazo(request.body);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }
}

module.exports = LectorController;
