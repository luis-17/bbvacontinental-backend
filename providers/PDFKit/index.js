const PDFMakePrinter = require('pdfmake/src/printer');
const PDFDocument = require('pdfkit');
const moment = require('moment-timezone');

const Utils = use('App/Helpers/Utils');

class PDFKit {
  constructor(config) {
    this._config = config;
  }

  async generarCronogramaPDFMake(dataCronograma, fSolicitud) {
    return new Promise((resolve) => {
      const { rates, installmentPlan } = dataCronograma.data[0];
      console.log(installmentPlan, 'installmentPlannn');
      const { scheduledPayments } = dataCronograma.data[0].installmentPlan;
      const { insurance } = scheduledPayments[1];
      const arrDataCronograma = [];
      scheduledPayments.forEach((element) => {
        if (element.installmentNumber) {
          const auxElement = [
            element.installmentNumber,
            moment(element.dueDate).format('DD-MM-YYYY'),
            Utils.currencyFormat(element.principal.amount),
            Utils.currencyFormat(element.interest.amount),
            Utils.currencyFormat(element.insurance.amount),
            Utils.currencyFormat(element.subvention.amount),
            Utils.currencyFormat(element.total.amount),
            Utils.currencyFormat(element.remaining.amount),
          ];
          arrDataCronograma.push(auxElement);
        }
      });
      const auxElementFinal = [
        '',
        '',
        Utils.currencyFormat(installmentPlan.principal.amount),
        Utils.currencyFormat(installmentPlan.interest.amount),
        '-',
        Utils.currencyFormat(installmentPlan.subvention.amount),
        Utils.currencyFormat(installmentPlan.totalAmount.amount),
        '',
      ];
      arrDataCronograma.push(auxElementFinal);
      fSolicitud.tcea = rates[1].unit.percentage;
      const docDefinition = {
        pageMargins: [30, 290, 30, 60],
        header: {
          margin: 30,
          style: 'detailHeader',
          stack: [
            {
              // text: 'Préstamo Libre Disponibilidad\n',
              text: fSolicitud.SubProducto.nombre,
              style: 'header',
              lineHeight: 1.5,
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Importe a Solicitar:\n',
                }, {
                  text: Utils.currencyFormat(fSolicitud.montoPrestamo),
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Días de pago:\n',
                }, {
                  text: fSolicitud.CampaniaConvenio.diaPago,
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Duración total (meses):\n',
                }, {
                  text: fSolicitud.plazo,
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Periodo de gracia (meses):\n',
                }, {
                  text: fSolicitud.periodoGracia,
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Fecha de Solicitud:\n',
                }, {
                  text: moment(fSolicitud.createdAt).format('DD-MM-YYYY'),
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Valor del bien:\n',
                }, {
                  text: '-',
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Sub-Producto:\n',
                }, {
                  text: fSolicitud.SubProducto.nombre,
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Cuota:\n',
                }, {
                  text: Utils.currencyFormat(fSolicitud.cuota),
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Tipo Seguro de Desgravamen:\n',
                }, {
                  text: 'SIN SEGURO',
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Importe Seguro Desgravamen:\n',
                }, {
                  text: Utils.currencyFormat(insurance.amount),
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Importe Seguro del Bien:\n',
                }, {
                  text: '-',
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Tasa Efectiva Anual:\n',
                }, {
                  text: `${fSolicitud.tasa}%`,
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'TCEA Referencial de Operación:\n',
                }, {
                  text: `${fSolicitud.tcea}%`,
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Comisión envío información periódica:\n',
                }, {
                  text: '-',
                },
              ],
            },
            {
              alignment: 'justify',
              columns: [
                {
                  text: 'Cuotas Adicionales:\n',
                }, {
                  text: '-',
                },
              ],
            },
          ],
        },
        content: [
          {
            style: 'tableCronograma',
            table: {
              body: [
                ['N° de Cuota', 'Fecha de Vencimiento', 'Amortización', 'Intereses', 'Comisiones + Seguros', 'Subvención', 'Cuota', 'Saldo'],
                ...arrDataCronograma,
              ],
            },
          },
          {
            text: '\n\nESTE DOCUMENTO ES UNA SIMULACIÓN PRELIMINAR.\n\n',
            style: 'detailFooter',
          },
          {
            text: 'NO SE INCLUYEN LOS GASTOS PAGADOS POR EL CLIENTE.\n\n',
            style: 'detailFooter',
          },
          {
            text: 'EL MONTO DE AMORTIZACIÓN CON ESTE VALOR SE ORIGINA POR LA APLICACIÓN DEL CÁLCULO PARA LA OBTENCIÓN DE CUOTA CONSTANTE. NO AFECTA EL COSTO EFECTIVO ANUAL DEL CRÉDITO.\n\n',
            style: 'detailFooter',
          },
          {
            text: 'LAS OPERACIONES REALIZADAS EN LA CUENTA SE ENCUENTRAN AFECTAS AL PAGO DEL IMPUESTO POR TRANSACCIONES FINANCIERAS (ITF): 0.005%\n\n',
            style: 'detailFooter',
          },
          {
            text: 'USTED TIENE DERECHO A ELEGIR SU PROPIO SEGURO EN EL MOMENTO DE LA CONTRATACIÓN.\n',
            style: 'detailFooter',
          },
        ],
        styles: {
          header: {
            fontSize: 22,
            bold: true,
          },
          detailHeader: {
            fontSize: 11,
            bold: false,
          },
          detailFooter: {
            fontSize: 11,
          },
        },
      };
      const printer = new PDFMakePrinter({
        Roboto: {
          normal: Buffer.from(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
          bold: Buffer.from(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
          italics: Buffer.from(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Italic.ttf'], 'base64'),
        },
      });
      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const buffers = [];
      pdfDoc.on('data', buffers.push.bind(buffers));
      pdfDoc.on('end', () => {
        const data = Buffer.concat(buffers);
        resolve(data);
      });
      pdfDoc.end();
    });
  }

  async generarCronograma(dataCronograma, fSolicitud) {
    return new Promise((resolve) => {
      console.log(dataCronograma, fSolicitud);
      const docCronograma = new PDFDocument({
        autoFirstPage: false,
        bufferPages: true,
      });
      docCronograma.addPage();
      const buffers = [];
      docCronograma.on('data', buffers.push.bind(buffers));
      docCronograma.on('end', () => {
        const data = Buffer.concat(buffers);
        resolve(data);
      });
      // const streamCronograma = docCronograma.pipe(base64.encode());
      const textBody = 'Préstamo Libre Disponibilidad';
      docCronograma
        .text(textBody, { align: 'left' });
      docCronograma.on('pageAdded', () => {
        docCronograma
          .text(textBody, 90, { align: 'left' })
          .text('Importe a Solicitar:', { align: 'left' })
          .moveDown()
          .text('5000')
          .moveLeft()
          .text('Días de pago:', { align: 'left' })
          .moveDown()
          .text('Duración total (meses):', { align: 'left' })
          .moveDown()
          .text('Periodo de gracia (meses):', { align: 'left' })
          .moveDown()
          .text('Fecha de Solicitud:', { align: 'left' })
          .moveDown()
          .text('Valor del bien:', { align: 'left' })
          .moveDown()
          .text('Sub-Producto:', { align: 'left' })
          .moveDown()
          .text('Cuota:', { align: 'left' })
          .moveDown()
          .text('Tipo Seguro de Desgravamen:', { align: 'left' })
          .moveDown()
          .text('Importe Seguro del Bien:', { align: 'left' })
          .moveDown()
          .text('Tasa Efectiva Anual:', { align: 'left' })
          .moveDown()
          .text('TCEA Referencial de Operación:', { align: 'left' })
          .moveDown()
          .text('Comisión envío información periódica:', { align: 'left' })
          .moveDown()
          .text('Cuotas Adicionales:', { align: 'left' });
      });
      docCronograma
        .text('bla bla bla', { align: 'left' });
      docCronograma.end();
    });
  }
}

module.exports = PDFKit;
