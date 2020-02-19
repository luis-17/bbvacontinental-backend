onst log4js = require('log4js');
const httpStatus = require('http-status-codes');
const Excel = require('exceljs');
const fs = require('fs');
const util = require('util');
const temp = require('temp');
const path = require('path');
const moment = require('moment-timezone');

const log = log4js.getLogger('app');
const EmailCronograma = use('Email/Cronograma');

const Solicitud = use('App/Models/Solicitud');

class CronogramaController {
  async send(request, response) {
    log.debug('CronogramaController->send');
    const { solicitudId } = request.params;
    const { tea, tcea, items } = request.body;
    const solicitud = await Solicitud.findByIdWithCliente({ solicitudId });
    // inicio: datos solicitante
    const {
      Cliente,
      Cliente: { ClienteVivienda },
      Producto,
      SubProducto,
    } = solicitud;
    // fin: datos solicitante
    const filename = `${moment().format('YYYY-MM-DD.hh.mm.ss-A')}.xlsx`;
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(filename, {
      properties: { showGridLines: false },
    });
    // inicio: logo
    const logo = workbook.addImage({
      filename: path.join(__basedir, '/public/images/logo_bbvacontinental.png'),
      extension: 'png',
    });
    worksheet.mergeCells('A1:C2');
    worksheet.getCell('C2').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF073370' },
      bgColor: { argb: 'FF073370' },
    };
    worksheet.addImage(logo, 'A1:C2');
    // fin: logo
    // inicio: titulo
    worksheet.mergeCells('A4:G4');
    worksheet.getCell('G4').value = 'CRONOGRAMA DE PAGO PRELIMINAR "PR\u00C9STAMO POR CONVENIO"';
    // fin: titulo
    // inicio: datos
    worksheet.getCell('A6').value = 'NOMBRE DEL CLIENTE';
    worksheet.getCell('B6').value = Cliente.nombreApellidoCompleto;
    worksheet.getCell('A7').value = 'PRODUCTO';
    worksheet.getCell('B7').value = Producto.nombre;
    worksheet.getCell('A8').value = 'PRINCIPAL SOLICITADO';
    worksheet.getCell('B8').value = solicitud.montoPrestamo;
    worksheet.getCell('A9').value = 'CUOTAS';
    worksheet.getCell('B9').value = solicitud.plazo;
    worksheet.getCell('A10').value = 'FECHA DE SOLICITUD';
    worksheet.getCell('B10').value = solicitud.fechaSolicitud;
    // --
    worksheet.getCell('F6').value = 'DNI';
    worksheet.getCell('G6').value = Cliente.numDocumento;
    worksheet.getCell('F7').value = 'SUB PRODUCTO';
    worksheet.getCell('G7').value = SubProducto.nombre;
    worksheet.getCell('F8').value = 'TEA';
    worksheet.getCell('G8').value = tea;
    worksheet.getCell('F9').value = 'TCEA';
    worksheet.getCell('G9').value = tcea;
    // fin: datos
    // inicio: table header

    worksheet.getCell('A12').value = 'N°CUOTA';
    worksheet.getCell('B12').value = 'DEUDA';
    worksheet.getCell('C12').value = 'VENCIMIENTO';
    worksheet.getCell('D12').value = 'AMORTIZACI\u00D3N';
    worksheet.getCell('E12').value = 'INTER\u00C9S';
    worksheet.getCell('F12').value = 'COM.(S)+SEG';
    worksheet.getCell('G12').value = 'CUOTA';

    // fin: table header
    // inicio: table body
    items.forEach((item) => {
      worksheet.addRow([
        item.col0,
        item.col1,
        item.col2,
        item.col3,
        item.col4,
        item.col5,
        item.col6,
      ]);
    });
    // fin: table body
    temp.track();
    const stream = temp.createWriteStream();
    await workbook.xlsx.write(stream);
    stream.end();

    const readFile = util.promisify(fs.readFile);
    const content = await readFile(stream.path);

    await EmailCronograma.send({
      to: ClienteVivienda.correoElectronico,
      attachments: [{
        content: content.toString('Base64'),
        filename,
        type: 'application/vnd.openxmlformats',
        disposition: 'attachment',
        content_id: 'myreport',
      }],
    });

    temp.cleanup();

    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: null,
    });
  }
}

module.exports = CronogramaController;
