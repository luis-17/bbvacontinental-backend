// const PDFMakePrinter = require('pdfmake/src/printer');
// const PDFDocument = require('pdfkit');
const moment = require('moment-timezone');
const Excel = require('exceljs');
const uuidv1 = require('uuid/v1');
const temp = require('temp');
const fs = require('fs');
const util = require('util');
// var JSZip = require("jszip");
// const S3 = use('S3');
// const Utils = use('App/Helpers/Utils');

class ExcelJS {
  constructor(config) {
    this._config = config;
  }

  async generarReporteExcel(arrData) {
    // console.log(arrData, 'arrData');
    const workbook = new Excel.Workbook();
    const filename = `${uuidv1().replace(/-/g, '')}.xlsx`;
    const worksheet = workbook.addWorksheet(filename, {
      properties: { showGridLines: false },
    });
    worksheet.getRow(1).value = ['REPORTE DE SOLICITUDES'];

    worksheet.getCell('A4').value = 'FECHA DE REGISTRO';
    worksheet.getCell('B4').value = 'N° SOLICITUD';
    worksheet.getCell('C4').value = 'CODIGO DE CAMPAÑA';
    worksheet.getCell('D4').value = 'CODIGO CLIENTE / RUC EMPRESA';
    worksheet.getCell('E4').value = 'DNI SOLICITANTE';
    worksheet.getCell('F4').value = 'TIPO';
    worksheet.getCell('G4').value = 'PRODUCTO';
    worksheet.getCell('H4').value = 'SUB PRODUCTO';

    worksheet.mergeCells('I3:K3');
    worksheet.getCell('K3').value = 'SOLICITADO POR EL CLIENTE';
    worksheet.getCell('K3').border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };
    worksheet.getCell('I4').value = 'IMPORTE SOLICITADO';
    worksheet.getCell('J4').value = 'PLAZO';
    worksheet.getCell('K4').value = 'TASA';
    worksheet.mergeCells('L3:M3');
    worksheet.getCell('M3').value = 'BANCO OFRECE';
    worksheet.getCell('M3').border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };
    worksheet.getCell('L4').value = 'IMPORTE OFERTA BANCO';
    worksheet.getCell('M4').value = 'PLAZO BANCO';

    worksheet.getCell('N4').value = 'IMPORTE';
    worksheet.mergeCells('N3:O3');
    worksheet.getCell('O3').value = 'CLIENTE CONFIRMA (LUEGO DE SIMULACION)';
    worksheet.getCell('O3').border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };
    worksheet.getCell('N3').alignment = { wrapText: true };
    worksheet.getCell('O3').alignment = { wrapText: true };
    worksheet.getCell('O4').value = 'PLAZO';
    worksheet.getCell('P4').value = 'IMPORTE OFERTA RRHH';
    worksheet.getCell('Q4').value = 'USUARIO FUVEX';
    worksheet.getCell('R4').value = 'FECHA DE REGISTRO DE SOLICITANTE';

    worksheet.getCell('S4').value = 'APROBACION BANCO';
    worksheet.getCell('T4').value = 'FECHA DE OFERTA BANCO';
    worksheet.getCell('U4').value = 'OBSERVACIONES';

    worksheet.getCell('V4').value = 'APROBADO POR EMPRESA';
    worksheet.getCell('W4').value = 'CONFIRMACION DEL PRESTAMO';
    worksheet.getCell('X4').value = 'FECHA CONFIRMACION';
    worksheet.mergeCells('W3:X3');
    worksheet.getCell('X3').value = 'CONFIRMACIÓN DEL PRESTAMO POR PARTE DEL SOLICITANTE';
    worksheet.getCell('X3').border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };

    worksheet.getCell('Y4').value = 'FECHA APROBACION/DESAPROBACION';
    worksheet.getCell('Z4').value = 'OBSERVACIONES';
    worksheet.mergeCells('Y3:Z3');
    worksheet.getCell('Z3').value = 'INFORMACION PROPORCIONADA POR RRHH DE LA EMPRESA';
    worksheet.getCell('Z3').border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };
    worksheet.getCell('AA4').value = 'USUARIO QUE REALIZA DESEMBOLSO';
    worksheet.getCell('AB4').value = 'DESEMBOLSADO';
    worksheet.getCell('AC4').value = 'OBSERVACIONES';
    worksheet.getCell('AD4').value = 'FECHA DE DESEMBOLSO';
    worksheet.getCell('AE4').value = 'FECHA INICIO LECTOR';
    worksheet.getCell('AF4').value = 'FECHA FIN LECTOR';

    worksheet.getRow(3).font = { size: 10, bold: true };
    worksheet.getRow(4).font = { size: 10, bold: true };
    // worksheet.getRow(5).font = { size: 10, bold: true };
    worksheet.getRow(3).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow(4).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.getRow(4).border = {
      top: { style: 'thin', color: { argb: '000000' } },
      left: { style: 'thin', color: { argb: '000000' } },
      bottom: { style: 'thin', color: { argb: '000000' } },
      right: { style: 'thin', color: { argb: '000000' } },
    };
    arrData.forEach((item) => {
      worksheet.addRow([
        item.fechaRegistro,
        item.codigoSolicitud,
        item.codigoCampania,
        item.rucEmpresa,
        Buffer.from(item.dniSolicitante, 'base64').toString('ascii'),
        item.tipo,
        item.producto,
        item.subProducto,
        item.montoCliente,
        item.plazoCliente,
        item.tasaCliente,
        item.montoMaxBanco, // item.montoBanco,
        item.plazoMontoMaxBanco, // item.plazoBanco,
        item.montoConfirm,
        item.plazoConfirm,
        item.importe_rrhh,
        item.usuarioFuvex,
        item.fechaRegistroSolicitante,
        item.aprobacionBanco,
        item.fechaAprobacionBanco,
        item.observacionesBanco,
        item.aprobacionRRHH,
        item.aprobacionCliente,
        item.fechaAprobacionCliente,
        item.fechaAprobacionRRHH, // Y
        item.motivoRechazoRRHH, // Z
        item.colaboradorEveris, // AA4
        item.aprobacionEveris,
        item.motivoRechazoEveris,
        item.fechaAprobacionEveris,
        moment(item.fechaInicioLector).tz('America/Lima').format('YYYY-MM-DD hh:mm:ss'), // AE4
        moment(item.fechaFinLector).tz('America/Lima').format('YYYY-MM-DD hh:mm:ss'), // AF4
      ]);
    });

    worksheet.columns = [
      { width: 17 },
      { width: 15 },
      { width: 18 },
      { width: 20 },
      { width: 26 },
      { width: 18 },
      { width: 26 },
      { width: 26 },
      { width: 26 },
      { width: 14 },
      { width: 14 },
      { width: 26 },

      { width: 16 },
      { width: 16 },
      { width: 15 },
      { width: 24 },

      { width: 18 },
      { width: 22 },
      { width: 15 },
      { width: 24 },
      { width: 24 },
      { width: 24 },

      { width: 26 },
      { width: 26 },
      { width: 25 },
      { width: 22 },
      { width: 22 }, // USUARIO QUE REALIZA DESEMBOLSO
      { width: 20 },
      { width: 22 },
      { width: 24 },
      { width: 24 },
      { width: 24 },
    ];

    temp.track();
    const stream = temp.createWriteStream();
    await workbook.xlsx.write(stream);
    stream.end();

    const readFile = util.promisify(fs.readFile);
    const content = await readFile(stream.path);
    return content;
  }

  async generarReporteRRHHExcel(arrData, arrDataCol) {
    const workbook = new Excel.Workbook();
    const filename = `${uuidv1().replace(/-/g, '')}.xlsx`;
    const worksheet = workbook.addWorksheet(filename, {
      properties: { showGridLines: false },
    });
    worksheet.getRow(1).value = ['REPORTE DE SOLICITUDES - RRHH'];

    worksheet.getCell('A4').value = 'FECHA DE REGISTRO';
    worksheet.getCell('B4').value = 'N° SOLICITUD';
    worksheet.getCell('C4').value = 'CODIGO DE EMPLEADO';
    worksheet.getCell('D4').value = 'DNI';
    worksheet.getCell('E4').value = 'NOMBRE Y APELLIDOS';
    worksheet.getCell('F4').value = 'MONTO APROBADO BBVA';
    worksheet.getCell('G4').value = 'MONTO APROBADO RRHH';
    worksheet.getCell('H4').value = 'FECHA DE APROBACION';
    worksheet.getCell('I4').value = 'USUARIO';
    worksheet.getCell('J4').value = 'ESTADO';
    worksheet.getCell('K4').value = 'DETALLE DE OBSERVACION'; // descripcion
    arrData.forEach((item) => {
      let fechaAprobRRHH = '';
      let colId = null;
      let motivoRechazo = '';
      let usuarioRRHH = '';
      item.EstadoSol.forEach((itemDet) => {
        if (itemDet.id === item.Estado.id) {
          fechaAprobRRHH = itemDet.EstadoSolicitud.createdAt;
          if (item.Estado.id === 5 || item.Estado.id === 6) {
            colId = itemDet.EstadoSolicitud.colaboradorId;
          }
        }
      });
      if (colId) {
        arrDataCol.forEach((itemCol) => {
          if (itemCol.id === colId) {
            usuarioRRHH = itemCol.Usuario.username;
          }
        });
      }
      if (item.MotivoRechazo[0]) {
        motivoRechazo = item.MotivoRechazo[0].descripcion;
      }
      worksheet.addRow([
        item.createdAt,
        item.codigoSolicitante,
        item.Cliente.ClienteLaboral.registroEmpresa,
        item.Cliente.numDocumento,
        `${item.Cliente.nombres} ${item.Cliente.apellidoPaterno} ${item.Cliente.apellidoMaterno}`,
        item.montoPrestamoFinal,
        item.montoPrestamoFinal,
        fechaAprobRRHH,
        usuarioRRHH,
        item.Estado.nombre,
        motivoRechazo,
      ]);
    });

    worksheet.columns = [
      { width: 17 },
      { width: 15 },
      { width: 18 },
      { width: 20 },
      { width: 26 },
      { width: 18 },
      { width: 26 },
      { width: 26 },
      { width: 26 },
      { width: 22 },
      { width: 25 },
    ];

    temp.track();
    const stream = temp.createWriteStream();
    await workbook.xlsx.write(stream);
    stream.end();

    const readFile = util.promisify(fs.readFile);
    const content = await readFile(stream.path);
    return content;
  }

  async generarReporteAnalistaAdminExcel(arrData) {
    const workbook = new Excel.Workbook();
    const filename = `${uuidv1().replace(/-/g, '')}.xlsx`;
    const worksheet = workbook.addWorksheet(filename, {
      properties: { showGridLines: false },
    });
    worksheet.getRow(1).value = ['REPORTE DE SOLICITUDES - ANALISTA'];

    worksheet.getCell('A4').value = 'FECHA DE REGISTRO';
    worksheet.getCell('B4').value = 'N° SOLICITUD';
    worksheet.getCell('C4').value = 'DNI';
    worksheet.getCell('D4').value = 'NOMBRE Y APELLIDOS';
    worksheet.getCell('E4').value = 'MONTO APROBADO';
    // worksheet.getCell('H4').value = 'FECHA DE APROBACION';
    // worksheet.getCell('I4').value = 'USUARIO';
    worksheet.getCell('F4').value = 'ESTADO';
    // worksheet.getCell('K4').value = 'DETALLE DE OBSERVACION'; // descripcion
    arrData.forEach((item) => {
      // let fechaAprobRRHH = '';
      // let colId = null;
      // let motivoRechazo = '';
      // let usuarioRRHH = '';
      // item.EstadoSol.forEach((itemDet) => {
      //   if (itemDet.id === item.Estado.id) {
      //     fechaAprobRRHH = itemDet.EstadoSolicitud.createdAt;
      //     if (item.Estado.id === 5 || item.Estado.id === 6) {
      //       colId = itemDet.EstadoSolicitud.colaboradorId;
      //     }
      //   }
      // });
      // if (item.MotivoRechazo[0]) {
      //   motivoRechazo = item.MotivoRechazo[0].descripcion;
      // }
      worksheet.addRow([
        item.createdAt,
        item.codigoSolicitante,
        // item.Cliente.ClienteLaboral.registroEmpresa,
        item.Cliente.numDocumento,
        `${item.Cliente.nombres} ${item.Cliente.apellidoPaterno} ${item.Cliente.apellidoMaterno}`,
        item.montoPrestamoFinal,
        // item.montoPrestamoFinal,
        // fechaAprobRRHH,
        // usuarioRRHH,
        item.Estado.nombre,
        // motivoRechazo,
      ]);
    });

    worksheet.columns = [
      { width: 17 },
      { width: 15 },
      { width: 18 },
      { width: 20 },
      { width: 26 },
      { width: 18 },
    ];

    temp.track();
    const stream = temp.createWriteStream();
    await workbook.xlsx.write(stream);
    stream.end();

    const readFile = util.promisify(fs.readFile);
    const content = await readFile(stream.path);
    return content;
  }

  async generarReporteFuvexAdminExcel(arrData) {
    const workbook = new Excel.Workbook();
    const filename = `${uuidv1().replace(/-/g, '')}.xlsx`;
    const worksheet = workbook.addWorksheet(filename, {
      properties: { showGridLines: false },
    });
    worksheet.getRow(1).value = ['REPORTE DE SOLICITUDES - FUVEX-ADMIN'];

    worksheet.getCell('A4').value = 'FECHA DE REGISTRO';
    worksheet.getCell('B4').value = 'N° SOLICITUD';
    worksheet.getCell('C4').value = 'DNI';
    worksheet.getCell('D4').value = 'NOMBRE Y APELLIDOS';
    worksheet.getCell('E4').value = 'MONTO APROBADO';
    // worksheet.getCell('H4').value = 'FECHA DE APROBACION';
    // worksheet.getCell('I4').value = 'USUARIO';
    worksheet.getCell('F4').value = 'ESTADO';
    // worksheet.getCell('K4').value = 'DETALLE DE OBSERVACION'; // descripcion
    arrData.forEach((item) => {
      // let fechaAprobRRHH = '';
      // let colId = null;
      // let motivoRechazo = '';
      // let usuarioRRHH = '';
      // item.EstadoSol.forEach((itemDet) => {
      //   if (itemDet.id === item.Estado.id) {
      //     fechaAprobRRHH = itemDet.EstadoSolicitud.createdAt;
      //     if (item.Estado.id === 5 || item.Estado.id === 6) {
      //       colId = itemDet.EstadoSolicitud.colaboradorId;
      //     }
      //   }
      // });
      // if (item.MotivoRechazo[0]) {
      //   motivoRechazo = item.MotivoRechazo[0].descripcion;
      // }
      worksheet.addRow([
        item.createdAt,
        item.codigoSolicitante,
        // item.Cliente.ClienteLaboral.registroEmpresa,
        item.Cliente.numDocumento,
        `${item.Cliente.nombres} ${item.Cliente.apellidoPaterno} ${item.Cliente.apellidoMaterno}`,
        item.montoPrestamoFinal,
        // item.montoPrestamoFinal,
        // fechaAprobRRHH,
        // usuarioRRHH,
        item.Estado.nombre,
        // motivoRechazo,
      ]);
    });

    worksheet.columns = [
      { width: 17 },
      { width: 15 },
      { width: 18 },
      { width: 20 },
      { width: 26 },
      { width: 18 },
    ];

    temp.track();
    const stream = temp.createWriteStream();
    await workbook.xlsx.write(stream);
    stream.end();

    const readFile = util.promisify(fs.readFile);
    const content = await readFile(stream.path);
    return content;
  }
}

module.exports = ExcelJS;
