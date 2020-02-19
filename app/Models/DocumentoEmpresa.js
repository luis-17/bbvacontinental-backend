const Database = use('Database');
const Lector = use('Lector');
const Utils = use('App/Helpers/Utils');

const DocumentoEmpresa = Database.model('DocumentoEmpresa');
const Solicitud = Database.model('Solicitud');
const SolicitudDocumento = Database.model('SolicitudDocumento');
const Documento = Database.model('Documento');
const EmpresaConvenio = Database.model('EmpresaConvenio');
const Empresa = Database.model('Empresa');

// const copyProps = require('copy-props');

DocumentoEmpresa.listar = async function (arrParams) {
  return DocumentoEmpresa.findAll({
    where: { empresaConvenioId: arrParams.empresaConvenioId },
    include: [{
      model: Documento,
      as: 'Documento',
    }, {
      model: EmpresaConvenio,
      as: 'EmpresaConvenio',
      include: [{
        model: Empresa,
        as: 'Empresa',
      }],
    }],
  });
};
DocumentoEmpresa.saveWithDocumentos = async function (data, arrDocumentos) {
  const t = await Database.sequelize.transaction(); // cuotaMensual
  try {
    await Solicitud.update({
      vistaHTML: data.vistaHTML,
      ppm: data.montoPPM,
      tipoProducto: data.tipoProducto,
      productoId: data.productoId,
      subProductoId: data.subProductoId,
      montoPrestamo: data.montoPrestamo,
      campaniaConvenioId: data.campaniaConvenioId,
      plazo: data.plazo,
      tasa: data.tasa,
      diaPago: data.diaPago,
      rechazoLector: null,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    const arrDocumentosReg = arrDocumentos.filter(row => row.accion === 'reg');
    const arrDocumentosEdit = arrDocumentos.filter(row => row.accion === 'edit');
    await SolicitudDocumento.update({ motivoRechazo: null }, {
      where: {
        solicitudId: data.solicitudId,
      },
      transaction: t,
    });
    await SolicitudDocumento.bulkCreate(arrDocumentosReg, { transaction: t });
    await SolicitudDocumento.bulkCreate(arrDocumentosEdit, { transaction: t, updateOnDuplicate: ['fechaSubida', 'alias', 'filename', 'filetype', 'label', 'etag', 'location', 'key', 'bucket'] });
    const _evaluacion = await Solicitud.findOne({ where: { id: data.solicitudId } });
    await t.commit();
    return _evaluacion;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
DocumentoEmpresa.saveWithDocumentosSubrogado = async function (params, arrDocumentos = [], fSolicitud) {
  const t = await Database.sequelize.transaction();
  const { id: solicitudId } = fSolicitud;
  const { nombres, apellidoPaterno, apellidoMaterno } = fSolicitud.Cliente;
  const {
    nombres: colNombres,
    celular: colCelular,
    correo: colCorreo,
    numeroDocumento: colNumeroDocumento,
  } = fSolicitud.Colaborador;
  const { tipoIngreso, empresaConvenioId } = fSolicitud.Cliente.ClienteLaboral;
  const { multiplo } = fSolicitud.Cliente.ClienteLaboral.FrecuenciaPago;

  const montoPrestamoSubrogado = arrDocumentos.filter(doc => doc.compraDeuda).reduce((acc, cur) => acc + (parseFloat(cur.deudaSubro) || 0), 0);
  // const totalDeuda = arrDocumentos.filter(doc => doc.compraDeuda).reduce((acc, cur) => acc + cur.deudaSubro, 0);
  console.log(montoPrestamoSubrogado, 'montoPrestamoSubrogadoooo');
  try {
    await Solicitud.update({
      vistaHTML: params.vistaHTML,
      montoPrestamo: montoPrestamoSubrogado,
    }, {
      where: {
        id: solicitudId,
      },
      transaction: t,
    });
    let documentoEmpresaId = null;
    if (arrDocumentos.length > 0) {
      ([{ documentoEmpresaId }] = arrDocumentos);
      await SolicitudDocumento.destroy({
        where: {
          solicitudId,
          documentoEmpresaId,
        },
        transaction: t,
      });
    }
    await SolicitudDocumento.bulkCreate(arrDocumentos, { transaction: t });

    await t.commit();
    //     console.log(fSolDoc, 'insertFila');
    // const _evaluacion = await Solicitud.findOne({ where: { id: solicitudId } });
    const fEmpresaConvenio = await EmpresaConvenio.findOne({
      where: { id: empresaConvenioId },
      include: [{
        model: Empresa,
        as: 'Empresa',
      }],
    });
    const listaDocumentosBoleta = await SolicitudDocumento.listarDocumentosBoleta(solicitudId);
    // console.log(solicitudId, 'solicitudIdff');
    const listaDocumentosSubro = await SolicitudDocumento.listarDocumentosSubrogado(solicitudId);
    // console.log(listaDocumentosSubro, 'qwert');
    let cantidadMeses = 1;
    if (tipoIngreso === 'V') {
      cantidadMeses = fEmpresaConvenio.cantMesesVariable;
    }
    // consultar servicio de lector
    const arrParamsLector = {
      dni: fSolicitud.Cliente.numDocumento,
      solicitudId,
      solicitante: `${nombres} ${apellidoPaterno} ${apellidoMaterno}`,
      fechaReenvioLector: new Date(),
      empresaConvenioId: fEmpresaConvenio.id,
      nombreComercial: fEmpresaConvenio.Empresa.nombreComercial,
      frecuenciaPago: multiplo, // 1 / 2 / 4
      cantidadMeses,
      tipoIngreso,
      arrDocumentos: listaDocumentosBoleta.map(row => ({
        solicitudDocumentoId: row.id,
        url: row.location,
        tipo: Utils.getTypeForMimeType(row.filetype),
      })),
      arrDocumentosSubrogado: listaDocumentosSubro.map(row => ({
        solicitudDocumentoId: row.id,
        institucionFinanciera: {
          id: row.InstitucionFinanciera.id,
          nombre: row.InstitucionFinanciera.nombreComercial,
        },
        compraDeuda: row.compraDeuda,
        cuotaMensual: row.cuotaMensual,
      })),
      contacto: {
        nombres: colNombres,
        celular: colCelular,
        correo: colCorreo,
        tipo: 'FUVEX',
        numeroDocumento: colNumeroDocumento,
      },
    };
    arrParamsLector.fechaEnvioLector = new Date();
    if (fSolicitud.fechaEnvioLector) {
      arrParamsLector.fechaEnvioLector = fSolicitud.fechaEnvioLector;
    }
    Lector.enviarSolicitudDocumentos(arrParamsLector);
    return fSolicitud;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
DocumentoEmpresa.findByAliasAndCompany = async function (alias, empresaConvenioId) {
  return DocumentoEmpresa.findOne({
    where: { empresaConvenioId },
    include: [{
      model: Documento,
      as: 'Documento',
      where: { alias },
    }],
  });
};

module.exports = DocumentoEmpresa;
