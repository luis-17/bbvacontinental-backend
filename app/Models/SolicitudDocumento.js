const Database = use('Database');
const { Sequelize: { Op } } = Database;
const SolicitudDocumento = Database.model('SolicitudDocumento');
const DocumentoEmpresa = Database.model('DocumentoEmpresa');
const Documento = Database.model('Documento');
const Solicitud = Database.model('Solicitud');
const InstitucionFinanciera = Database.model('InstitucionFinanciera');
const PerfilDocumentoEmpresa = Database.model('PerfilDocumentoEmpresa');

const Const = use('App/Helpers/Const');
const Utils = use('App/Helpers/Utils');

SolicitudDocumento.isValidSolDoc = function (filtro, solicitudId = null, label = null, documentoEmpresaId = null, id = null) {
  let _optionsWhere;
  if (filtro === 'byId') {
    _optionsWhere = {
      where: { id },
    };
  }
  if (filtro === 'byFK') {
    _optionsWhere = {
      where: { solicitudId, documentoEmpresaId, label },
    };
  }
  return SolicitudDocumento.findOne(_optionsWhere);
};
SolicitudDocumento.listarDocumentosDeSolicitud = async function (solicitudId, perfilId) {
  // restricciones por perfil
  const perfilDocumentoEmpresa = await PerfilDocumentoEmpresa.findAll({
    where: {
      perfilId,
    },
  });
  if (perfilDocumentoEmpresa.length) {
    // pluck documento empresaId
    const documentoEmpresaId = Utils.pluck(perfilDocumentoEmpresa, 'documentoEmpresaId');
    return SolicitudDocumento.findAll({
      where: {
        solicitudId,
        documentoEmpresaId,
        filename: {
          [Op.ne]: null,
        },
      },
      include: [{
        model: DocumentoEmpresa,
        as: 'DocumentoEmpresa',
        include: [{
          model: Documento,
          as: 'Documento',
        }],
      }],
    });
  }
  return SolicitudDocumento.findAll({
    where: {
      solicitudId,
      // documentoEmpresaId: [],
      filename: {
        [Op.ne]: null,
      },
    },
    include: [{
      model: DocumentoEmpresa,
      as: 'DocumentoEmpresa',
      include: [{
        model: Documento,
        as: 'Documento',
      }],
    }],
  });
};
SolicitudDocumento.listarDocumentosBoleta = function (solicitudId) {
  return SolicitudDocumento.findAll({
    where: { solicitudId },
    include: [{
      model: DocumentoEmpresa,
      as: 'DocumentoEmpresa',
      required: true,
      include: [{
        model: Documento,
        as: 'Documento',
        where: { alias: 'boleta_pago' }, // solo boletas
        required: true,
      }],
    }],
  });
};
SolicitudDocumento.listarDocumentosSubrogado = function (solicitudId) {
  return SolicitudDocumento.findAll({
    where: { solicitudId },
    include: [{
      model: DocumentoEmpresa,
      as: 'DocumentoEmpresa',
      required: true,
      include: [{
        model: Documento,
        as: 'Documento',
        where: { alias: 'cronograma_cd' }, // solo subrogados
        required: true,
      }],
    }, {
      model: InstitucionFinanciera,
      as: 'InstitucionFinanciera',
      required: true,
    }],
  });
};
SolicitudDocumento.netoSolicitudDocumento = async (data) => {
  try {
    const solicitudDocumento = await SolicitudDocumento.findOne({
      where: { id: data.solicitudDocumentoId },
      include: [{
        model: Solicitud,
        as: 'Solicitud',
        attributes: ['id', 'estadoId'],
      }],
    });
    const statesInvalidates = [Const.states.FINALIZADO, Const.states.CANCELADO];
    if (!solicitudDocumento) {
      throw new Error('No existe el documento.');
    }
    if (statesInvalidates.includes(solicitudDocumento.Solicitud.estadoId)) {
      throw new Error('Estado inválido');
    }
    solicitudDocumento.ingresoNeto = data.ingresoNeto;
    await solicitudDocumento.save();
    return solicitudDocumento;
  } catch (e) {
    throw new Error(e.message);
  }
};
// SolicitudDocumento.regresarDocumentosFisicos = async (solicitudId) => {
//   const arrDocumentos = await SolicitudDocumento.listarDocumentosDeSolicitud(solicitudId);
//   return arrDocumentos.filter(row => !row.label.startsWith('boleta')).map(row => row.toJSON());
// };
module.exports = SolicitudDocumento;
