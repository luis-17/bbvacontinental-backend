const log4js = require('log4js');
const httpStatus = require('http-status-codes');
// const Excel = require('exceljs');
// const fs = require('fs');
// const util = require('util');
// const temp = require('temp');
// const path = require('path');
const moment = require('moment-timezone');
const uuidv1 = require('uuid/v1');

const log = log4js.getLogger('app');
const EmailSolicitudSimulada = use('Email/SolicitudSimulada');
const BBVAConvenios = use('BBVA/Convenios');
const PDFKit = use('PDFKit');

const Solicitud = use('App/Models/Solicitud');

class CronogramaController {
  async send(request, response) {
    log.debug('CronogramaController->send');
    const { solicitudId } = request.body;
    log.debug('CronogramaController->findByIdWithClienteWithCampania');
    const fSolicitud = await Solicitud.findByIdWithClienteWithCampania({ solicitudId });
    // log.debug('ENDDD');
    const arrParams = {};
    arrParams.periodoGracia = fSolicitud.periodoGracia;
    arrParams.tasa = fSolicitud.CampaniaConvenio.tasa;
    arrParams.diaPago = fSolicitud.CampaniaConvenio.diaPago;
    arrParams.fechaNacimiento = moment(fSolicitud.Cliente.fechaNacimiento).format('YYYY-MM-DD');
    arrParams.fechaActFormat = moment().format('YYYY-MM-DD');
    arrParams.plazo = fSolicitud.plazo;
    arrParams.montoPrestamo = fSolicitud.montoPrestamo;
    const responseBbvaCron = await BBVAConvenios.evaluarCredito(arrParams);
    // inicio: datos solicitante pipe EmailCronograma
    const {
      Cliente,
      Cliente: { ClienteVivienda },
      // Producto,
      // SubProducto,
    } = fSolicitud;

    // fin: datos solicitante
    const filename = `${uuidv1().replace(/-/g, '')}.pdf`;
    const cronogramaPDF = await PDFKit.generarCronogramaPDFMake(responseBbvaCron, fSolicitud);
    await EmailSolicitudSimulada.send({
      to: ClienteVivienda.correoElectronico,
      dynamic_template_data: {
        fullname: Cliente.nombres,
      },
      attachments: [{
        content: cronogramaPDF.toString('Base64'),
        filename,
        type: 'application/pdf',
        disposition: 'attachment',
        content_id: 'myReportCronog',
      }],
    });

    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }
}

module.exports = CronogramaController;
