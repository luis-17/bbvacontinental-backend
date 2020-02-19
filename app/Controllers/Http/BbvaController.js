const httpStatus = require('http-status-codes');
const fileType = require('file-type');
// const fs = require('fs');
// const JSZip = require("jszip");


const S3 = use('S3');
const S3reporte = use('S3reporte');
const Solicitud = use('App/Models/Solicitud');
const ExcelJS = use('ExcelJS');
const Utils = use('App/Helpers/Utils');

class BbvaController {
  async listReports(request, response) {
    const { ContinuationToken } = request.query;
    const data = await S3.listObjects({
      Bucket: process.env.BBVA_BUCKET_REPORT,
      ContinuationToken,
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: {
        data,
        BaseUrl: process.env.BBVA_BUCKET_BASE_URL,
      },
    });
  }

  async deleteReport(request, response) {
    const { key: Key } = request.params;
    const data = await S3.deleteObject({
      Bucket: process.env.BBVA_BUCKET_REPORT,
      Key,
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data,
    });
  }

  // decode PDF/JPG/JPEG/PNG from AWS S3
  async decodePDF(request, response) {
    const fileKey = request.body.file_key;
    const data = await S3.retrieveObject({
      Bucket: process.env.BBVA_BUCKET_DOCUMENT,
      Key: fileKey,
    });
    const content = data.Body.toString('base64');
    const download = Buffer.from(content.toString('utf-8'), 'base64');
    const ft = fileType(download);
    response.attachment(fileKey + ft.ext);
    response.setHeader('Content-Type', ft.mime);
    response.setHeader('Content-Disposition', `attachment;filename=${fileKey}`);
    response.send(download); // download
    response.end();
  }

  async decodeGetPDFBase64(request, response) {
    const { key: Key } = request.params;
    const data = await S3.retrieveObject({
      Bucket: process.env.BBVA_BUCKET_DOCUMENT,
      Key,
    });
    const ft = fileType(data.Body);
    const base64 = `data:${ft.mime};base64,${data.Body.toString('base64')}`;
    return response.status(httpStatus.OK).json({
      message: 'OK',
      rpta: base64,
    });
  }

  async decodeGetPDF(request, response) {
    const { key: Key } = request.params;
    const data = await S3.retrieveObject({
      Bucket: process.env.BBVA_BUCKET_DOCUMENT,
      Key,
    });
    const content = data.Body.toString('base64');
    const download = Buffer.from(content.toString('utf-8'), 'base64');
//     const download = Buffer.from(content.toString('utf-8'), 'base64');
    console.log(data.Body, 'data.Body');
    console.log(download, 'downloaddownload');
    const ft = fileType(data.Body);
//     console.log(ft.mime, 'ft.mimeft.mimeft.mime');
    response.attachment(Key + ft.ext);
    response.setHeader('Content-Type', ft.mime);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Pragma', 'public');
    response.setHeader('Content-Disposition', `inline;filename=${Key}`);
    response.send(data.Body); // download
    response.end();
  }

  // download ZIP from AWS S3
  async downloadZip(request, response) {
    const { key: Key } = request.params;
    const data = await S3.retrieveObject({
      Bucket: process.env.BBVA_BUCKET_REPORT,
      Key,
    });
    const content = data.Body.toString('base64');
    const download = Buffer.from(content.toString('utf-8'), 'base64');

    response.attachment(Key);
    response.setHeader('Content-Type', 'application/zip,application/octet-stream,application/x-zip-compressed,multipart/x-zip');
    response.setHeader('Content-Disposition', `attachment;filename=${  Key}`);
    response.send(download);
    response.end();
  }

  async generarReporteSolicitudes(request, response) {
    let arrRepoS3 = null;
    if (request.headers.authorization === 'Basic Q3JvbmpvYjpMWzZKQ1FafiNYKk1oOHtENyRxU1xrPVc=') {
      const arrAuxList = await Solicitud.listarReporteSolicitudes(request.query);
      const reporteExcel = await ExcelJS.generarReporteExcel(arrAuxList);
      arrRepoS3 = await S3reporte.zipAndUpload(reporteExcel);
    }
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrRepoS3,
    });
  }

  async generarAnonimizacion(request, response) {
    let arrResult = null;
    if (request.headers.authorization === 'Basic Q3JvbmpvYjpMWzZKQ1FafiNYKk1oOHtENyRxU1xrPVc=') {
      arrResult = await Solicitud.generarAnonimizacion();
      // const reporteExcel = await ExcelJS.generarReporteExcel(arrAuxList);
      // arrRepoS3 = await S3reporte.zipAndUpload(reporteExcel);
    }
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrResult,
    });
  }
}

module.exports = BbvaController;
