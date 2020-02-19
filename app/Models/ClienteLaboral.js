const Database = use('Database');
const { serial } = require('items-promise');

const ClienteLaboral = Database.model('ClienteLaboral');
const Solicitud = Database.model('Solicitud');
const SolicitudDocumento = use('App/Models/SolicitudDocumento');
const EmailSolicitudObservadaLector = use('Email/SolicitudObservadaLector');
const EmailSolicitudProcesadaLector = use('Email/SolicitudProcesadaLector');

ClienteLaboral.saveClienteLaboral = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    const rowClienteLaboral = await ClienteLaboral.update({
      empresaConvenioId: data.empresaConvenioId,
      ocupacionId: data.ocupacionId,
      inicioLaboral: data.inicioLaboral,
      registroEmpresa: data.registroEmpresa,
      tipoIngreso: data.tipoIngreso,
      frecuenciaPagoId: data.frecuenciaPagoId,
      condicionLaboralId: data.condicionLaboralId,
    }, {
      where: {
        id: data.id,
      },
      transaction: t,
    });
    await Solicitud.update({
      vistaHTML: data.vistaHTML,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    await t.commit();
    return rowClienteLaboral;
  } catch (err) {
    await t.rollback();
    throw new Error(err.message);
  }
};
ClienteLaboral.actualizarDesdeLectorOk = async (data) => {
  const fSolicitud = await Solicitud.verSolicitud(data.solicitudId);
  const { id: clienteLaboralId } = fSolicitud.Cliente.ClienteLaboral;
  const t = await Database.sequelize.transaction();
  try {
    const strIngresoFijo = data.ingresoFijo.toString();
    const ingresoFijo64 = Buffer.from(strIngresoFijo).toString('base64');
    const strIngresoVariable = data.ingresoVariable.toString();
    const ingresoVariable64 = Buffer.from(strIngresoVariable).toString('base64');
    const row = await ClienteLaboral.update({
      ingresoFijo: ingresoFijo64,
      ingresoVariable: ingresoVariable64,
      cuotaMaxima: data.cuotaMaxima,
      cuotaPr: data.cuotaPr,
    }, {
      where: {
        id: clienteLaboralId,
      },
      transaction: t,
    });
    await Solicitud.update({
      estadoLector: 'F',
      fechaOkLector: new Date(),
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    // enviar correo
    EmailSolicitudProcesadaLector.send({
      to: fSolicitud.Colaborador.correo,
      dynamic_template_data: {
        fullname: fSolicitud.Cliente.nombreApellidoCompleto,
        numerodocumento: fSolicitud.Cliente.numDocumento,
        subject: 'Solicitud Procesada por Lector',
      },
    });
    await t.commit();
    return row;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
ClienteLaboral.actualizarDesdeLectorRechazo = async (data) => {
  const arrDocumentos = data.documentos;
  const t = await Database.sequelize.transaction();
  const fSolicitud = await Solicitud.verSolicitud(data.solicitudId);
  try {
    // regresar a desbloqueado colaboradorId
    await Solicitud.update({
      estadoLector: 'D',
      rechazoLector: 1,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    await serial(arrDocumentos, async ($row) => {
      await SolicitudDocumento.update({
        motivoRechazo: $row.motivo,
      }, {
        where: {
          id: $row.solicitudDocumentoId,
        },
        transaction: t,
      });
    });
    // enviar correo
    EmailSolicitudObservadaLector.send({
      to: fSolicitud.Colaborador.correo,
      dynamic_template_data: {
        fullname: fSolicitud.Cliente.nombreApellidoCompleto,
        numerodocumento: fSolicitud.Cliente.numDocumento,
        subject: 'Solicitud Observada por Lector',
      },
    });
    await t.commit();
    return fSolicitud.toJSON();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
module.exports = ClienteLaboral;
