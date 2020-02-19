// const log4js = require('log4js');
const httpStatus = require('http-status-codes');
const filter = require('filter-object');
// const copyProps = require('copy-props');
// const moment = require('moment-timezone');
// const generate = require('nanoid/generate');
const Solicitud = use('App/Models/Solicitud');
const Colaborador = use('App/Models/Colaborador');
const ExcelJS = use('ExcelJS');
// const log = log4js.getLogger('app');

class HistorialCreditosController {
  async listarSolicitudes(request, response) {
    const arrListFilter = [];
    const arrList = await Solicitud.Listar(request.query, request.user.id);
    arrList.forEach((row) => {
      let estadoStr = row.Estado.nombre;
      if (row.rechazoLector === 1 /* && row.Estado.id === 3 */) { // simulado
        estadoStr = 'OBSERVADO POR LECTOR';
      }
      arrListFilter.push({
        id: row.id,
        clienteId: row.clienteId,
        vistaHTML: row.vistaHTML,
        codigoSolicitante: row.codigoSolicitante,
        numeroDocumento: row.Cliente.numDocumento,
        nombres: row.Cliente.nombres,
        apellidoPaterno: row.Cliente.apellidoPaterno,
        apellidoMaterno: row.Cliente.apellidoMaterno,
        fechaCreacion: row.createdAt,
        estado: estadoStr,
        estadoId: row.Estado.id,
        MotivoRechazo: row.MotivoRechazo,
      });
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrListFilter.map(row => filter(
        row,
      )),
    });
  }

  async listarSolicitudesParaRRHH(request, response) {
    const arrList = await Solicitud.ListarParaRRHH(request.query);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrList.map(row => filter(
        row.toJSON(),
      )),
    });
  }

  async listarSolicitudesParaRRHHExcel(request, response) {
    const arrList = await Solicitud.ListarParaRRHH(request.query);
    const arrListRRHH = await Colaborador.ListarColaboradoresRRHH();
    const fileExcel = await ExcelJS.generarReporteRRHHExcel(arrList, arrListRRHH);
    // console.log(fileExcel, 'fileExcel');
    response.attachment('reporte-rrhh.xlsx');
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename=reporte-rrhh.xlsx');
    response.send(fileExcel);
    response.end();
  }

  async listarSolicitudesParaAnalista(request, response) {
    const arrList = await Solicitud.ListarParaAnalista(request.query);
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrList.map(row => filter(
        row.toJSON(),
      )),
    });
  }

  async listarSolicitudesParaFuvexAdmin(request, response) {
    const arrList = await Solicitud.ListarParaFuvexAdmin(request.query);
    const arrListFilter = [];
    arrList.forEach((row) => {
      let estadoStr = row.Estado.nombre;
      if (row.rechazoLector === 1 && row.Estado.id === 3) { // simulado
        estadoStr = 'OBSERVADO POR LECTOR';
      }
      arrListFilter.push({
        id: row.id,
        clienteId: row.clienteId,
        vistaHTML: row.vistaHTML,
        codigoSolicitante: row.codigoSolicitante,
        numeroDocumento: row.Cliente.numDocumento,
        nombres: row.Cliente.nombres,
        apellidoPaterno: row.Cliente.apellidoPaterno,
        apellidoMaterno: row.Cliente.apellidoMaterno,
        fechaCreacion: row.createdAt,
        estado: estadoStr,
        estadoId: row.Estado.id,
        MotivoRechazo: row.MotivoRechazo,
      });
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrListFilter.map(row => filter(
        row,
      )),
    });
  }

  async listarSolicitudesParaFuvexAdminExcel(request, response) {
    const arrList = await Solicitud.ListarParaFuvexAdmin(request.query);
    // const arrListRRHH = await Colaborador.ListarColaboradoresRRHH();
    const fileExcel = await ExcelJS.generarReporteFuvexAdminExcel(arrList);
    // console.log(fileExcel, 'fileExcel');
    response.attachment('reporte-rrhh.xlsx');
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename=reporte-admin-fuvex.xlsx');
    response.send(fileExcel);
    response.end();
  }

  async listarSolicitudesParaAnalistaAdmin(request, response) {
    const arrList = await Solicitud.ListarParaAnalistaAdmin(request.query);
    const arrListFilter = [];
    arrList.forEach((row) => {
      arrListFilter.push({
        id: row.id,
        clienteId: row.clienteId,
        vistaHTML: row.vistaHTML,
        codigoSolicitante: row.codigoSolicitante,
        numeroDocumento: row.Cliente.numDocumento,
        nombres: row.Cliente.nombres,
        apellidoPaterno: row.Cliente.apellidoPaterno,
        apellidoMaterno: row.Cliente.apellidoMaterno,
        fechaCreacion: row.createdAt,
        estado: row.Estado.nombre,
        estadoId: row.Estado.id,
        MotivoRechazo: row.MotivoRechazo,
      });
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrListFilter.map(row => filter(
        row,
      )),
    });
  }

  async listarSolicitudesParaAnalistaAdminExcel(request, response) {
    const arrList = await Solicitud.ListarParaAnalistaAdmin(request.query);
    // const arrListRRHH = await Colaborador.ListarColaboradoresRRHH();
    const fileExcel = await ExcelJS.generarReporteAnalistaAdminExcel(arrList);
    // console.log(fileExcel, 'fileExcel');
    response.attachment('reporte-rrhh.xlsx');
    response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.setHeader('Content-Disposition', 'attachment; filename=reporte-admin-analista.xlsx');
    response.send(fileExcel);
    response.end();
  }
}

module.exports = HistorialCreditosController;
