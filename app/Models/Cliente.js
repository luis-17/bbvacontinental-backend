const Database = use('Database');
const Cliente = Database.model('Cliente');
const Solicitud = Database.model('Solicitud');
const EstadoSolicitud = Database.model('EstadoSolicitud');
const MotivoRechazoSolicitud = Database.model('MotivoRechazoSolicitud');
// const UsuarioPerfil = Database.model('UsuarioPerfil');
// const Perfil = Database.model('Perfil');

// const { Op } = Database.Sequelize;

Cliente.prototype.registrarClientePersonal = async function ({ colaboradorId, vistaHTML, estadoId = 1 }) {
  const t = await Database.sequelize.transaction();
  try {
    await this.save({ transaction: t });
    const [solicitud, created] = await Solicitud.findOrCreate({
      where: { clienteId: this.id },
      defaults: {
        colaboradorId, vistaHTML, estadoId, clienteId: this.id,
      },
      transaction: t,
    });
    if (!created) {
      solicitud.colaboradorId = colaboradorId;
      solicitud.vistaHTML = vistaHTML;
      solicitud.estadoId = estadoId;
      await solicitud.save({ transaction: t });

      await MotivoRechazoSolicitud.destroy({
        where: {
          solicitudId: solicitud.id,
        },
        transaction: t,
      });
    }
    await EstadoSolicitud.build({
      estadoId,
      solicitudId: solicitud.id,
      colaboradorId,
    }).save({
      transaction: t,
    });
    await t.commit();
    return [this, solicitud];
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

Cliente.saveWithSolicitud = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    const rowCliente = await Cliente.create(data, {
      fields: [
        'estadoCivilId',
        'tipoDocumentoId',
        'numDocumento',
        'nombres',
        'apellidoPaterno',
        'apellidoMaterno',
        'fechaNacimiento',
        'sexo',
        'fechaVencimientoDoi',
        'tipoDoiConyugue',
        'numDoiConyugue',
        'nombreConyugue',
      ],
      transaction: t,
    });
    const arrParams = {
      colaboradorId: data.colaboradorId,
      vistaHTML: data.vistaHTML,
      estadoId: 1, // registrado
      clienteId: rowCliente.id,
    };
    const rowSol = await Solicitud.create(arrParams, {
      fields: [
        'colaboradorId',
        'vistaHTML',
        'estadoId',
        'clienteId',
      ],
      transaction: t,
    });
    const arrParamsEstado = {
      solicitudId: rowSol.id,
      estadoId: 1, // registrado
      colaboradorId: data.colaboradorId,
    };
    const rowEstado = await EstadoSolicitud.create(arrParamsEstado, {
      fields: [
        'estadoId',
        'solicitudId',
        'colaboradorId',
      ],
      transaction: t,
    });
    const row = {
      cliente: rowCliente,
      solicitud: rowSol,
      estado: rowEstado,
    };

    await t.commit();
    return row;
  } catch (err) {
    await t.rollback();
    throw new Error(err.message);
  }
};
Cliente.saveClientePersonal = async function (data) {
  // console.log(data, 'datatata');
  const t = await Database.sequelize.transaction();
  try {
    const rowCliente = await Cliente.update({
      estadoCivilId: data.estadoCivilId,
      tipoDocumentoId: data.tipoDocumentoId,
      numDocumento: data.numDocumento,
      nombres: data.nombres,
      apellidoPaterno: data.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno,
      fechaNacimiento: data.fechaNacimiento,
      sexo: data.sexo,
      fechaVencimientoDoi: data.fechaVencimientoDoi,
    }, {
      where: {
        id: data.clienteId,
      },
      transaction: t,
    });
    const rowSolicitud = await Solicitud.update({
      vistaHTML: data.vistaHTML,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    await t.commit();
    const row = {
      cliente: rowCliente,
      solicitud: rowSolicitud,
    };
    return row;
  } catch (err) {
    await t.rollback();
    throw new Error(err.message);
  }
};
module.exports = Cliente;
