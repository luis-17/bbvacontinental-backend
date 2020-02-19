const httpStatus = require('http-status-codes');
// const filter = require('filter-object');
// const log4js = require('log4js');

const ClienteLaboral = use('App/Models/ClienteLaboral');
const DocumentoEmpresa = use('App/Models/DocumentoEmpresa');

// const log = log4js.getLogger('app');

class DocumentoEmpresaController {
  async listarDocumentosDeEmpresa(request, response) {
    const { clienteId } = request.query;
    const { empresaConvenioId } = await ClienteLaboral.findOne({ where: { clienteId } });
    const arrListFilter = [];
    const arrList = await DocumentoEmpresa.listar({ empresaConvenioId });
    arrList.forEach((row) => {
      // console.log(row.Documento, 'row.Documento');
      arrListFilter.push({
        documentoEmpresaId: row.id,
        documentoId: row.Documento.id,
        nombre: row.Documento.nombre,
        alias: row.Documento.alias,
        seccion: row.seccion,
        labelHTML: row.Documento.labelHTML,
        descripcionHTML: row.Documento.descripcionHTML,
      });
    });
    return response.status(httpStatus.OK).json({
      message: 'OK',
      data: arrListFilter,
    });
  }
}
module.exports = DocumentoEmpresaController;
