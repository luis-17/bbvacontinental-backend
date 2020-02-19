const log4js = require('log4js');
const httpStatus = require('http-status-codes');
const Excel = require('exceljs');
const fs = require('fs');
const util = require('util');
const temp = require('temp');
const path = require('path');
const moment = require('moment-timezone');

const log = log4js.getLogger('app');
const EmailSolicitudAprobadaFuvex = use('Email/SolicitudAprobadaFuvex');
const SolicitudAprobadaRrhh = use('Email/SolicitudAprobadaRrhh');
const EmailSolicitudDesembolsadaNuevo = use('Email/SolicitudDesembolsadaNuevo');
const EmailSolicitudRechazadaVarios = use('Email/SolicitudRechazadaVarios');
const BBVAConvenios = use('BBVA/Convenios');

const EmailCronograma = use('Email/Cronograma');

class TestController {
  async email(request, response) {
    const { type } = request.query;
    log.debug('email request type', type);
    console.log('email request type => ', type);
    let responseEmail;
    if (type === 'aprobada') {
      responseEmail = await EmailSolicitudAprobadaFuvex.send({
        to: 'francisco@kontigo.pe',
        dynamic_template_data: {
          fullname: 'Manuel Temple',
          subject: 'Solicitud Aprobada',
        },
      });
    } else if (type === 'aprobadaRrhh') {
      responseEmail = await SolicitudAprobadaRrhh.send({
        to: 'francisco@kontigo.pe',
        dynamic_template_data: {
          fullname: 'Manuel Temple',
          subject: 'Solicitud Aprobada por RRHH',
        },
      });
    } else if (type === 'desembolsada') {
      responseEmail = await EmailSolicitudDesembolsadaNuevo.send({
        to: 'francisco@kontigo.pe',
        dynamic_template_data: {
          fullname: 'Manuel Temple',
          subject: 'Solicitud Desembolsada',
        },
      });
    } else if (type === 'rechazada') {
      responseEmail = await EmailSolicitudRechazadaVarios.send({
        to: 'francisco@kontigo.pe',
        dynamic_template_data: {
          fullname: 'Manuel Temple',
          subject: 'Solicitud Rechazada',
        },
      });
    }
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: responseEmail,
    });
  }

  async cronograma(request, response) {
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
    worksheet.getCell('B6').value = ':NOMBRE DEL CLIENTE';
    worksheet.getCell('A7').value = 'PRODUCTO';
    worksheet.getCell('B7').value = ':PRODUCTO';
    worksheet.getCell('A8').value = 'PRINCIPAL SOLICITADO';
    worksheet.getCell('B8').value = ':PRINCIPAL SOLICITADO';
    worksheet.getCell('A9').value = 'CUOTAS';
    worksheet.getCell('B9').value = ':CUOTAS';
    worksheet.getCell('A10').value = 'FECHA DE SOLICITUD';
    worksheet.getCell('B10').value = ':FECHA DE SOLICITUD';
    // --
    worksheet.getCell('F6').value = 'DNI';
    worksheet.getCell('G6').value = ':DNI';
    worksheet.getCell('F7').value = 'SUB PRODUCTO';
    worksheet.getCell('G7').value = ':SUB PRODUCTO';
    worksheet.getCell('F8').value = 'TEA';
    worksheet.getCell('G8').value = ':TEA';
    worksheet.getCell('F9').value = 'TCEA';
    worksheet.getCell('G9').value = ':TCEA';
    // fin: datos
    // inicio: table header
    worksheet.getCell('A12').value = 'N°CUOTA';
    worksheet.getCell('B12').value = 'VCTO.';
    worksheet.getCell('C12').value = 'SALDO';
    worksheet.getCell('D12').value = 'AMORTIZACI\u00D3N';
    worksheet.getCell('E12').value = 'INTER\u00C9S';
    worksheet.getCell('F12').value = 'COM.(S)+SEG';
    worksheet.getCell('G12').value = 'TOTAL A PAGAR';
    // fin: table header
    // inicio: table body
    worksheet.addRow([
      'A1',
      'A2',
      'A3',
      'A4',
      'A5',
      'A6',
      'A7',
    ]);
    // fin: table body
    temp.track();
    const stream = temp.createWriteStream();
    await workbook.xlsx.write(stream);
    stream.end();

    const readFile = util.promisify(fs.readFile);
    const content = await readFile(stream.path);

    await EmailCronograma.send({
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

  async tsec(request, response) {
    try {
      const tsec = await BBVAConvenios.tsec();
      return response.status(httpStatus.OK).json({
        message: 'OK',
        data: tsec,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = TestController;
