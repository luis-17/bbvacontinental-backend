const { serial } = require('items-promise');

const Database = use('Database');
const { Sequelize: { Op }, sequelize } = Database;
const Solicitud = Database.model('Solicitud');
const SolicitudDocumento = Database.model('SolicitudDocumento');
const ActividadEconomica = Database.model('ActividadEconomica');
const DocumentoEmpresa = Database.model('DocumentoEmpresa');
const EstadoSolicitud = Database.model('EstadoSolicitud');
const Estado = Database.model('Estado');
const Cliente = Database.model('Cliente');
const TipoDocumento = Database.model('TipoDocumento');
const ClienteVivienda = Database.model('ClienteVivienda');
const ClienteLaboral = Database.model('ClienteLaboral');
const CondicionLaboral = Database.model('CondicionLaboral');
const FrecuenciaPago = Database.model('FrecuenciaPago');
const Ocupacion = Database.model('Ocupacion');
const Pais = Database.model('Pais');
const Distrito = Database.model('Distrito');
const Departamento = Database.model('Departamento');
const Provincia = Database.model('Provincia');
const TipoVia = Database.model('TipoVia');
const TipoUbicacion = Database.model('TipoUbicacion');
const EmpresaConvenio = Database.model('EmpresaConvenio');
const Empresa = Database.model('Empresa');
const Producto = Database.model('Producto');
const SubProducto = Database.model('SubProducto');
const CampaniaConvenio = use('App/Models/CampaniaConvenio');
const MotivoRechazo = Database.model('MotivoRechazo');
const MotivoRechazoSolicitud = Database.model('MotivoRechazoSolicitud');
const Colaborador = Database.model('Colaborador');
const Usuario = Database.model('Usuario');
const UsuarioPerfil = Database.model('UsuarioPerfil');
const ColaboradorEmpresaConvenio = Database.model('ColaboradorEmpresaConvenio');
const HistoriaSimulador = use('App/Models/HistoriaSimulador');
const TipoCuenta = use('App/Models/TipoCuenta');
const Operador = use('App/Models/Operador');
const EstadoCivil = use('App/Models/EstadoCivil');

const Const = use('App/Helpers/Const');

const moment = require('moment-timezone');

const BBVAConvenios = use('BBVA/Convenios');
const EmailSolicitudObservadaRrhh = use('Email/SolicitudObservadaRrhh');
const EmailSolicitudRechazadaRrhh = use('Email/SolicitudRechazadaRrhh');
const S3 = use('S3');
const PDFKit = use('PDFKit');

// const EmailSolicitudRechazadaVarios = use('Email/SolicitudRechazadaVarios');

const { Sequelize } = Database.Sequelize;
Solicitud.findByIdWithCliente = async (data) => {
  const solicitud = await Solicitud.findOne({
    where: { id: data.solicitudId },
    include: [
      {
        model: Cliente,
        as: 'Cliente',
        include: [
          {
            model: ClienteLaboral,
            as: 'ClienteLaboral',
            include: [
              {
                model: Ocupacion,
                as: 'Ocupacion',
              },
              {
                model: FrecuenciaPago,
                as: 'FrecuenciaPago',
              },
              {
                model: EmpresaConvenio,
                as: 'EmpresaConvenio',
              },
            ],
          },
          {
            model: ClienteVivienda,
            as: 'ClienteVivienda',
          },
        ],
      },
      {
        model: Colaborador,
        as: 'Colaborador',
      },
      {
        model: Producto,
        as: 'Producto',
      },
      {
        model: SubProducto,
        as: 'SubProducto',
      },
    ],
  });
  return solicitud;
};
Solicitud.findByIdWithClienteWithCampania = async (data) => {
  const solicitud = await Solicitud.findOne({
    where: { id: data.solicitudId },
    include: [
      {
        model: Cliente,
        as: 'Cliente',
        include: [
          {
            model: ClienteLaboral,
            as: 'ClienteLaboral',
            include: [
              {
                model: Ocupacion,
                as: 'Ocupacion',
              },
              {
                model: FrecuenciaPago,
                as: 'FrecuenciaPago',
              },
              {
                model: EmpresaConvenio,
                as: 'EmpresaConvenio',
              },
            ],
          },
          {
            model: ClienteVivienda,
            as: 'ClienteVivienda',
          },
        ],
      },
      {
        model: Colaborador,
        as: 'Colaborador',
      },
      {
        model: Producto,
        as: 'Producto',
      },
      {
        model: SubProducto,
        as: 'SubProducto',
      },
      {
        model: CampaniaConvenio,
        as: 'CampaniaConvenio',
      },
    ],
  });
  return solicitud;
};
Solicitud.Listar = async function (arrParams, userId, paramRequired = true) {
  const {
    empresaConvenioId, cliente, numDocumento, estadoId, codigoSolicitante, fechaInicio, fechaFin,
  } = arrParams;
  const where = {};
  let whereCliente = {};
  if (cliente) {
    whereCliente = Sequelize.where(
      Sequelize.fn('CONCAT', Sequelize.fn('FROM_BASE64', Sequelize.col('nombres')), ' ', Sequelize.fn('FROM_BASE64', Sequelize.col('apellidoPaterno')), ' ', Sequelize.fn('FROM_BASE64', Sequelize.col('apellidoMaterno'))),
      {
        [Op.like]: `%${cliente}%`,
      },
    );
  }
  if (fechaInicio && fechaFin) {
    where.createdAt = {
      [Op.between]: [fechaInicio, fechaFin],
    };
  }
  if (fechaInicio && !fechaFin) {
    where.createdAt = {
      [Op.gte]: fechaInicio,
    };
  }
  if (!fechaInicio && fechaFin) {
    where.createdAt = {
      [Op.lte]: fechaFin,
    };
  }
  if (estadoId) {
    where.estadoId = {
      [Op.in]: estadoId.split(',').map(e => Number(e)),
    };
  }
  if (numDocumento) {
    const numDocumento64 = Buffer.from(numDocumento).toString('base64');
    whereCliente.numDocumento = {
      [Op.like]: `%${numDocumento64}%`,
    };
  }
  if (codigoSolicitante) {
    where.id = {
      [Op.like]: `%${codigoSolicitante}%`,
    };
  }
  const colaborador = await Colaborador.findOne({ where: { usuarioId: userId } });
  if (colaborador.id) {
    where.colaboradorId = colaborador.id;
  }
  const arrEmpresaConvenioId = empresaConvenioId.split(',');
  if (arrEmpresaConvenioId.length > 1) {
    paramRequired = false;
  }
  return Solicitud.findAll({
    order: [
      ['createdAt', 'DESC'],
    ],
    where,
    include: [{
      model: Cliente,
      as: 'Cliente',
      where: whereCliente,
      required: paramRequired,
      include: [{
        model: ClienteLaboral,
        as: 'ClienteLaboral',
        required: paramRequired,
        include: [{
          model: EmpresaConvenio,
          as: 'EmpresaConvenio',
          required: paramRequired,
          where: { id: arrEmpresaConvenioId },
        }],
      }],
    }, {
      model: Estado,
      as: 'Estado',
    }, {
      model: MotivoRechazo,
      as: 'MotivoRechazo',
      attributes: ['descripcion'],
      through: {
        attributes: ['descripcion'],
      },
    }],
  });
};
Solicitud.ListarRRHHEmpresaConvenio = async (data) => {
  const fColaborador = await Colaborador.findAll({
    include: [
      {
        model: ColaboradorEmpresaConvenio,
        as: 'ColaboradorEmpresaConvenio',
        where: { empresaConvenioId: data.empresaConvenioId },
      },
      {
        model: Usuario,
        as: 'Usuario',
        include: [
          {
            model: UsuarioPerfil,
            as: 'UsuarioPerfil',
            where: { perfilId: 3 }, // RRHH
          },
        ],
      },
    ],
  });
  return fColaborador[0];
};
Solicitud.ListarParaRRHH = async function (arrParams, paramRequired = true) {
  const {
    empresaConvenioId, cliente, numDocumento, estadoId, codigoSolicitante, fechaInicio, fechaFin,
  } = arrParams;
  const where = {};
  let whereCliente = {};
  if (cliente) {
    whereCliente = Sequelize.where(
      Sequelize.fn('CONCAT', Sequelize.fn('FROM_BASE64', Sequelize.col('nombres')), ' ', Sequelize.fn('FROM_BASE64', Sequelize.col('apellidoPaterno')), ' ', Sequelize.fn('FROM_BASE64', Sequelize.col('apellidoMaterno'))),
      {
        [Op.like]: `%${cliente}%`,
      },
    );
  }
  if (fechaInicio && fechaFin) {
    where.createdAt = {
      [Op.between]: [fechaInicio, fechaFin],
    };
  }
  if (fechaInicio && !fechaFin) {
    where.createdAt = {
      [Op.gte]: fechaInicio,
    };
  }
  if (!fechaInicio && fechaFin) {
    where.createdAt = {
      [Op.lte]: fechaFin,
    };
  }
  if (estadoId) {
    where.estadoId = estadoId.split(',');
  }
  if (numDocumento) {
    const numDocumento64 = Buffer.from(numDocumento.toString()).toString('base64');
    whereCliente.numDocumento = {
      [Op.like]: `%${numDocumento64}%`,
    };
  }
  if (codigoSolicitante) {
    where.id = {
      [Op.like]: `%${codigoSolicitante}%`,
    };
  }
  const arrEmpresaConvenioId = empresaConvenioId.split(',');
  return Solicitud.findAll({
    order: [
      ['createdAt', 'DESC'],
    ],
    where,
    include: [{
      model: Cliente,
      as: 'Cliente',
      where: whereCliente,
      required: paramRequired,
      include: [{
        model: ClienteLaboral,
        as: 'ClienteLaboral',
        required: paramRequired,
        include: [{
          model: EmpresaConvenio,
          as: 'EmpresaConvenio',
          required: paramRequired,
          where: { id: arrEmpresaConvenioId },
        }],
      }],
    }, {
      model: Estado,
      as: 'Estado',
    }, /**/
    {
      model: MotivoRechazo,
      as: 'MotivoRechazo',
      attributes: ['descripcion'],
      through: {
        attributes: ['descripcion'],
      },
    }, {
      model: Estado,
      as: 'EstadoSol',
      // attributes: ['descripcion'],
      required: true,
      through: {
        attributes: ['colaboradorId', 'createdAt'],
      },
      /*
      include: [{
        model: Colaborador,
        as: 'ColaboradorCol',
        // required: true,
        through: {
          attributes: ['id', 'colaboradorId'],
          where: {},
        },
      }], */
    }, {
      model: Colaborador,
      as: 'Colaborador',
      include: [
        {
          model: Usuario,
          as: 'Usuario',
        },
      ],
    }],
  });
};
Solicitud.ListarParaAnalista = async function (arrParams, paramRequired = true) {
  const {
    empresaConvenioId, cliente, numDocumento, estadoId, codigoSolicitante, fechaInicio, fechaFin,
  } = arrParams;
  const where = {};
  let whereCliente = {};
  if (cliente) {
    whereCliente = Sequelize.where(
      Sequelize.fn('CONCAT', Sequelize.fn('FROM_BASE64', Sequelize.col('nombres')), ' ', Sequelize.fn('FROM_BASE64', Sequelize.col('apellidoPaterno')), ' ', Sequelize.fn('FROM_BASE64', Sequelize.col('apellidoMaterno'))),
      {
        [Op.like]: `%${cliente}%`,
      },
    );
  }
  if (fechaInicio && fechaFin) {
    where.createdAt = {
      [Op.between]: [fechaInicio, fechaFin],
    };
  }
  if (fechaInicio && !fechaFin) {
    where.createdAt = {
      [Op.gte]: fechaInicio,
    };
  }
  if (!fechaInicio && fechaFin) {
    where.createdAt = {
      [Op.lte]: fechaFin,
    };
  }
  if (estadoId) {
    where.estadoId = estadoId.split(',');
  }
  if (numDocumento) {
    const numDocumento64 = Buffer.from(numDocumento.toString()).toString('base64');
    whereCliente.numDocumento = {
      [Op.like]: `%${numDocumento64}%`,
    };
  }
  if (codigoSolicitante) {
    where.id = {
      [Op.like]: `%${codigoSolicitante}%`,
    };
  }
  const arrEmpresaConvenioId = empresaConvenioId.split(',');
  return Solicitud.findAll({
    order: [
      ['createdAt', 'DESC'],
    ],
    where,
    include: [{
      model: Cliente,
      as: 'Cliente',
      where: whereCliente,
      required: paramRequired,
      include: [{
        model: ClienteLaboral,
        as: 'ClienteLaboral',
        required: paramRequired,
        include: [{
          model: EmpresaConvenio,
          as: 'EmpresaConvenio',
          required: paramRequired,
          where: { id: arrEmpresaConvenioId },
        }],
      }],
    }, {
      model: Estado,
      as: 'Estado',
    }, {
      model: MotivoRechazo,
      as: 'MotivoRechazo',
      attributes: ['descripcion'],
      through: {
        attributes: ['descripcion'],
      },
    }],
  });
};
Solicitud.ListarParaFuvexAdmin = async function (arrParams, paramRequired = true) {
  const {
    empresaConvenioId, cliente, numDocumento, estadoId, codigoSolicitante, fechaInicio, fechaFin, usuarioId,
  } = arrParams;
  const where = {};
  let whereCliente = {};
  if (cliente) {
    whereCliente = Sequelize.where(
      Sequelize.fn('CONCAT', Sequelize.fn('FROM_BASE64', Sequelize.col('nombres')), ' ', Sequelize.fn('FROM_BASE64', Sequelize.col('apellidoPaterno')), ' ', Sequelize.fn('FROM_BASE64', Sequelize.col('apellidoMaterno'))),
      {
        [Op.like]: `%${cliente}%`,
      },
    );
  }
  if (fechaInicio && fechaFin) {
    where.createdAt = {
      [Op.between]: [fechaInicio, fechaFin],
    };
  }
  if (fechaInicio && !fechaFin) {
    where.createdAt = {
      [Op.gte]: fechaInicio,
    };
  }
  if (!fechaInicio && fechaFin) {
    where.createdAt = {
      [Op.lte]: fechaFin,
    };
  }
  if (estadoId) {
    where.estadoId = {
      [Op.in]: estadoId.split(',').map(e => Number(e)),
    };
  }
  // console.log(numDocumento, 'numDocumentofff');
  if (numDocumento) {
    const numDocumento64 = Buffer.from(numDocumento.toString()).toString('base64');
    whereCliente.numDocumento = {
      [Op.like]: `%${numDocumento64}%`,
    };
  }
  if (codigoSolicitante) {
    where.id = {
      [Op.like]: `%${codigoSolicitante}%`,
    };
  }
  if (usuarioId) {
    const colaborador = await Colaborador.findOne({ where: { usuarioId } });
    if (colaborador.id) {
      where.colaboradorId = colaborador.id;
    }
  }
  const arrEmpresaConvenioId = empresaConvenioId.split(',');
  if (arrEmpresaConvenioId.length > 1) {
    paramRequired = false;
  }
  return Solicitud.findAll({
    order: [
      ['createdAt', 'DESC'],
    ],
    where,
    include: [{
      model: Cliente,
      as: 'Cliente',
      where: whereCliente,
      // required: paramRequired,
      include: [{
        model: ClienteLaboral,
        as: 'ClienteLaboral',
        required: paramRequired,
        include: [{
          model: EmpresaConvenio,
          as: 'EmpresaConvenio',
          required: paramRequired,
          where: { id: arrEmpresaConvenioId },
        }],
      }],
    }, {
      model: Estado,
      as: 'Estado',
    }, {
      model: MotivoRechazo,
      as: 'MotivoRechazo',
      attributes: ['descripcion'],
      through: {
        attributes: ['descripcion'],
      },
    }],
  });
};
Solicitud.ListarParaAnalistaAdmin = async function (arrParams, paramRequired = true) {
  const {
    empresaConvenioId, cliente, numDocumento, estadoId, codigoSolicitante, fechaInicio, fechaFin,
  } = arrParams;
  const where = {};
  let whereCliente = {};
  if (cliente) {
    whereCliente = Sequelize.where(
      Sequelize.fn('CONCAT', Sequelize.fn('FROM_BASE64', Sequelize.col('nombres')), ' ', Sequelize.fn('FROM_BASE64', Sequelize.col('apellidoPaterno')), ' ', Sequelize.fn('FROM_BASE64', Sequelize.col('apellidoMaterno'))),
      {
        [Op.like]: `%${cliente}%`,
      },
    );
  }
  if (fechaInicio && fechaFin) {
    where.createdAt = {
      [Op.between]: [fechaInicio, fechaFin],
    };
  }
  if (fechaInicio && !fechaFin) {
    where.createdAt = {
      [Op.gte]: fechaInicio,
    };
  }
  if (!fechaInicio && fechaFin) {
    where.createdAt = {
      [Op.lte]: fechaFin,
    };
  }
  if (estadoId) {
    where.estadoId = {
      [Op.in]: estadoId.split(',').map(e => Number(e)),
    };
  }
  if (numDocumento) {
    const numDocumento64 = Buffer.from(numDocumento.toString()).toString('base64');
    whereCliente.numDocumento = {
      [Op.like]: `%${numDocumento64}%`,
    };
  }
  if (codigoSolicitante) {
    where.id = {
      [Op.like]: `%${codigoSolicitante}%`,
    };
  }
  // if (usuarioId) {
  //   const colaborador = await Colaborador.findOne({ where: { usuarioId } });
  //   if (colaborador.id) {
  //     where.colaboradorId = colaborador.id;
  //   }
  // }
  const arrEmpresaConvenioId = empresaConvenioId.split(',');
  if (arrEmpresaConvenioId.length > 1) {
    paramRequired = false;
  }
  return Solicitud.findAll({
    order: [
      ['createdAt', 'DESC'],
    ],
    where,
    include: [{
      model: Cliente,
      as: 'Cliente',
      where: whereCliente,
      required: paramRequired,
      include: [{
        model: ClienteLaboral,
        as: 'ClienteLaboral',
        required: paramRequired,
        include: [{
          model: EmpresaConvenio,
          as: 'EmpresaConvenio',
          required: paramRequired,
          where: { id: arrEmpresaConvenioId },
        }],
      }],
    }, {
      model: Estado,
      as: 'Estado',
    }, {
      model: MotivoRechazo,
      as: 'MotivoRechazo',
      attributes: ['descripcion'],
      through: {
        attributes: ['descripcion'],
      },
    }],
  });
};
Solicitud.registrarClienteVivienda = async function (data) {
  const t = await Database.sequelize.transaction();
  data.nombreVia = data.nombreVia ? Buffer.from(encodeURI(data.nombreVia)).toString('base64') : null;
  data.manzana = data.manzana ? Buffer.from(data.manzana).toString('base64') : null;
  data.lote = data.lote ? Buffer.from(data.lote).toString('base64') : null;
  data.numExterior = data.numExterior ? Buffer.from(data.numExterior).toString('base64') : null;
  data.numInterior = data.numInterior ? Buffer.from(data.numInterior).toString('base64') : null;
  data.nombreUbicacion = data.nombreUbicacion ? Buffer.from(encodeURI(data.nombreUbicacion)).toString('base64') : null;
  data.referencia = data.referencia ? Buffer.from(encodeURI(data.referencia)).toString('base64') : null;
  data.numCelular = data.numCelular ? Buffer.from(data.numCelular).toString('base64') : null;
  data.correoElectronico = data.correoElectronico ? Buffer.from(data.correoElectronico).toString('base64') : null;
  try {
    const rowClienteVivienda = await ClienteVivienda.create(data, {
      fields: [
        'clienteId',
        'tipoUbicacionId',
        'relacionViviendaId',
        'paisId',
        'departamentoId',
        'provinciaId',
        'distritoId',
        'tipoViaId',
        'nombreVia',
        'manzana',
        'lote',
        'numExterior',
        'numInterior',
        'nombreUbicacion',
        'referencia',
        'resideDesde',
        'gastosAlquiler',
        'numUnidadFam',
        'numCelular',
        'correoElectronico',
        'operadorId',
      ],
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
    return rowClienteVivienda;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
Solicitud.registrarClienteLaboral = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    const rowClienteLaboral = await ClienteLaboral.create(data, {
      fields: [
        'clienteId',
        'empresaConvenioId',
        'ocupacionId',
        'inicioLaboral',
        'registroEmpresa',
        'frecuenciaPagoId',
        'condicionLaboralId',
        'tipoIngreso',
      ],
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
    throw err;
  }
};
Solicitud.verResumenDeCliente = async function (id, paramRequired) {
  return Cliente.findOne({
    where: { id },
    include: [{
      model: ClienteLaboral,
      as: 'ClienteLaboral',
      required: paramRequired,
      include: [{
        model: EmpresaConvenio,
        as: 'EmpresaConvenio',
        required: paramRequired,
        include: [{
          model: Empresa,
          as: 'Empresa',
          required: paramRequired,
          include: [{
            model: ActividadEconomica,
            as: 'ActividadEconomica',
            required: paramRequired,
          }]
        }],
      }, {
        model: FrecuenciaPago,
        as: 'FrecuenciaPago',
        required: paramRequired,
      }, {
        model: CondicionLaboral,
        as: 'CondicionLaboral',
        required: paramRequired,
      }],
    }, {
      model: ClienteVivienda,
      as: 'ClienteVivienda',
      include: [{
        model: Pais,
        as: 'Pais',
        required: paramRequired,
      }, {
        model: Departamento,
        as: 'Departamento',
        required: paramRequired,
      }, {
        model: Provincia,
        as: 'Provincia',
        required: paramRequired,
      }, {
        model: Distrito,
        as: 'Distrito',
        required: paramRequired,
      }, {
        model: TipoVia,
        as: 'TipoVia',
        required: paramRequired,
      }, {
        model: TipoUbicacion,
        as: 'TipoUbicacion',
        required: paramRequired,
      }, {
        model: Operador,
        as: 'Operador',
        required: paramRequired,
      }],
    }, {
      model: EstadoCivil,
      as: 'EstadoCivil',
      required: paramRequired,
    }],
  });
};
Solicitud.verResumenDeSolicitud = async function (arrParams) {
  const solicitud = Solicitud.findOne({
    where: { id: arrParams.solicitudId },
    attributes: ['id', 'codigoSolicitante', 'estadoLector', 'ppm', 'createdAt', 'estadoId', 'montoPrestamo', 'diaPago', 'plazo', 'tasa', 'tasaFinal', 'cuota', 'tipoProducto', 'tipoProductoStr', 'campaniaConvenioId', 'montoPrestamo', 'tieneCuentaAhorros'],
    include: [{
      model: Cliente,
      as: 'Cliente',
      attributes: ['id', 'nombres', 'apellidoPaterno', 'apellidoMaterno', 'nombreApellidoCompleto', 'numDocumento', 'fechaNacimiento'],
      include: [{
        model: ClienteLaboral,
        as: 'ClienteLaboral',
        attributes: ['id', 'registroEmpresa', 'tipoIngreso', 'cuotaMaxima', 'empresaConvenioId', 'inicioLaboral', 'tipoIngreso', 'ingresoFijo'],
        include: [{
          model: EmpresaConvenio,
          as: 'EmpresaConvenio',
          attributes: ['id', 'cantMesesVariable', 'montoMinimoPrestamo', 'montoMaximoPrestamo'],
          include: [{
            model: Empresa,
            as: 'Empresa',
            attributes: ['id', 'nombreComercial', 'ruc'],
          }],
        }, {
          model: FrecuenciaPago,
          as: 'FrecuenciaPago',
        }, {
          model: CondicionLaboral,
          as: 'CondicionLaboral',
        }, {
          model: Ocupacion,
          as: 'Ocupacion',
        }],
      }, {
        model: ClienteVivienda,
        as: 'ClienteVivienda',
        attributes: ['id', 'correoElectronico'],
      }, {
        model: TipoDocumento,
        as: 'TipoDocumento',
      }],
    }, {
      model: Producto,
      as: 'Producto',
      attributes: ['id', 'nombre'],
    }, {
      model: SubProducto,
      as: 'SubProducto',
      attributes: ['id', 'nombre', 'codigoExterno'],
    }, {
      model: CampaniaConvenio,
      as: 'CampaniaConvenio',
      attributes: ['id', 'codigo', 'descripcionCorta', 'diaPago', 'diaCorte', 'tasa'],
    }, {
      model: Estado,
      as: 'Estado',
      attributes: ['id', 'nombre'],
    }, {
      model: TipoCuenta,
      as: 'TipoCuenta',
      attributes: ['id', 'nombre'],
    }, {
      model: Colaborador,
      as: 'Colaborador',
      attributes: ['id', 'numeroDocumento', 'fullname', 'nombres', 'apellidoPaterno', 'apellidoMaterno'],
    }],
  });
  if (!solicitud) {
    throw new Error('No existe la solicitud');
  }
  return solicitud;
};
Solicitud.confirmarDatosCliente = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    const row = await Cliente.update({
      confDatosCorrectos: data.confDatosCorrectos,
      fechaConfirmacionDatos: new Date(),
    }, {
      where: {
        id: data.clienteId,
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
    return row;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
Solicitud.registrarEvaluacion = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    const row = await Solicitud.update({
      confDatosCorrectos: data.confDatosCorrectos,
    }, {
      where: {
        id: data.clienteId,
      },
      transaction: t,
    });
    await t.commit();
    return row;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
Solicitud.verSolicitud = async function (id) {
  return Solicitud.findOne({
    where: { id },
    include: [{
      model: Producto,
      as: 'Producto',
    }, {
      model: Colaborador,
      as: 'Colaborador',
    }, {
      model: SubProducto,
      as: 'SubProducto',
    }, {
      model: Cliente,
      as: 'Cliente',
      include: [{
        model: ClienteLaboral,
        as: 'ClienteLaboral',
        attributes: ['id', 'empresaConvenioId'],
      }, {
        model: ClienteVivienda,
        as: 'ClienteVivienda',
      }],
    }],
  });
};
Solicitud.verSolicitudPorCliente = async function (clienteId) {
  return Solicitud.findOne({
    include: [{
      model: Cliente,
      as: 'Cliente',
      where: { id: clienteId },
    }, {
      model: Producto,
      as: 'Producto',
    }, {
      model: SubProducto,
      as: 'SubProducto',
    }],
  });
};
Solicitud.confirmarDatosEvaluacion = async function (params) {
  const {
    tipoCuotaId,
    montoPrestamoFinal,
    plazo,
    diaPago,
    tasa,
    cuota,
    solicitudId,
    estadoId,
    vistaHTML,
    colaboradorId,
    fechaSimulacionConfirmada,
    empresaConvenioId,
  } = params;
  const t = await Database.sequelize.transaction();
  try {
    const row = await Solicitud.update({
      tipoCuotaId,
      montoPrestamoFinal,
      plazo,
      diaPago,
      tasa,
      cuota,
      estadoId, // 2/3
      vistaHTML,
      fechaSimulacionConfirmada,
      // cuando se confirma una solicitud, se establecen los valores por defecto
      // del lector para que pueda volver a ser procesado por este
      estadoLector: 'D',
      errorLector: '',
    }, {
      where: {
        id: solicitudId,
      },
      transaction: t,
    });
    // INSERT SEG. ESTADO SOLO SIMULADO
    if (estadoId === 3) {
      const arrParamsEstado = {
        solicitudId,
        estadoId,
        colaboradorId,
      };
      await EstadoSolicitud.create(arrParamsEstado, {
        fields: [
          'solicitudId',
          'estadoId',
          'colaboradorId',
        ],
        transaction: t,
      });
    }
    // SUBIR CRONOGRAMA A S3
    const arrSol = {
      solicitudId,
    };
    const fSolicitud = await Solicitud.findByIdWithClienteWithCampania(arrSol);
    const arrParams = {};
    arrParams.periodoGracia = fSolicitud.periodoGracia;
    arrParams.tasa = fSolicitud.CampaniaConvenio.tasa;
    arrParams.diaPago = fSolicitud.CampaniaConvenio.diaPago;
    arrParams.fechaNacimiento = moment(fSolicitud.Cliente.fechaNacimiento).format('YYYY-MM-DD');
    arrParams.fechaActFormat = moment().format('YYYY-MM-DD');
    arrParams.plazo = fSolicitud.plazo;
    arrParams.montoPrestamo = fSolicitud.montoPrestamo;
    const responseBbvaCron = await BBVAConvenios.evaluarCredito(arrParams);
    const cronogramaPDF = await PDFKit.generarCronogramaPDFMake(responseBbvaCron, fSolicitud);
    const arrCronoS3 = await S3.upload(cronogramaPDF);
    const fDocumentoEmpresa = await DocumentoEmpresa.findByAliasAndCompany('cronograma_bbva', empresaConvenioId);

    // SUBIR CRONOGRAMA A BD
    const arrSolicitudDoc = [
      {
        documentoEmpresaId: fDocumentoEmpresa.id,
        solicitudId,
        fechaSubida: Date.now(),
        estado: 1,
        etag: arrCronoS3.ETag,
        location: arrCronoS3.Location,
        key: arrCronoS3.Key,
        bucket: arrCronoS3.Bucket,
        filename: arrCronoS3.Key,
        filetype: 'application/pdf',
        label: 'cronograma_bbva_1',
      },
    ];
    await SolicitudDocumento.bulkCreate(arrSolicitudDoc, { transaction: t });
    // registrar historico key_confirm
    console.log({ solicitudId, keyHistoria: Const.simuladorHistorico.confirm }, 'logoglgloxxx');
    await HistoriaSimulador.findOrCreate({
      where: { solicitudId, keyHistoria: Const.simuladorHistorico.confirm },
      defaults: {
        montoPrestamo: fSolicitud.montoPrestamo,
        diaPago: fSolicitud.CampaniaConvenio.diaPago,
        plazo: fSolicitud.plazo,
        tasa: fSolicitud.CampaniaConvenio.tasa,
        cuota: fSolicitud.cuota,
        ppm: fSolicitud.ppm,
        periodoGracia: fSolicitud.periodoGracia,
      },
      transaction: t,
    });
    // end registrar historico key_confirm
    await t.commit();
    return row;
  } catch (err) {
    console.log(err);
    await t.rollback();
    throw err;
  }
};
Solicitud.agregarCuentaAhorros = async function (data) {
  console.log(data, 'data');
  const t = await Database.sequelize.transaction();
  try {
    const row = await Solicitud.update({
      tipoCuentaId: data.tipoCuentaId,
      tienePagoHaberes: data.tienePagoHaberes,
      trasladaPagoHaberes: data.trasladaPagoHaberes,
      tieneCuentaAhorros: data.tieneCuentaAhorros,
      tasaFinal: data.tasaFinal,
      vistaHTML: data.vistaHTML,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    await t.commit();
    return row;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
Solicitud.agregarDocumentosFisicos = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    const arrSolicitudDoc = [];
    await serial(data.documentos, async ($row) => {
      const _existSolDoc = await SolicitudDocumento.isValidSolDoc('byFK', data.solicitudId, $row.label, $row.documentoEmpresaId);
      if (!_existSolDoc) {
        arrSolicitudDoc.push({
          documentoEmpresaId: $row.documentoEmpresaId,
          solicitudId: data.solicitudId,
          fechaSubida: Date.now(),
          estado: 1,
          etag: $row.etag,
          location: $row.location,
          key: $row.key,
          bucket: $row.bucket,
          filename: $row.filename,
          filetype: $row.filetype,
          label: $row.label,
        });
      }
    });
    const resultSolicitud = await SolicitudDocumento.bulkCreate(arrSolicitudDoc, { transaction: t });
    if (data.vistaHTML) {
      await Solicitud.update({
        vistaHTML: data.vistaHTML,
      }, {
        where: {
          id: data.solicitudId,
        },
        transaction: t,
      });
    }
    await t.commit();
    return resultSolicitud;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
Solicitud.aprobarSolicitudCredito = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    const row = await Solicitud.update({
      estadoId: data.estadoId,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    // INSERT SEG. ESTADO
    const arrParamsEstado = {
      solicitudId: data.solicitudId,
      estadoId: data.estadoId, // solicitado 4
      colaboradorId: data.colaboradorId,
    };
    await EstadoSolicitud.create(arrParamsEstado, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    await t.commit();
    return row;
  } catch (err) {
    console.log(err);
    await t.rollback();
    throw err;
  }
};
Solicitud.aprobarSolicitudRrhh = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    let solicitud = await Solicitud.findOne({ where: { id: data.solicitudId } });
    if (!solicitud) {
      throw new Error('No existe la solicitud.');
    }
    const statesValidates = [Const.states.SOLICITADO];
    if (!statesValidates.includes(solicitud.estadoId)) {
      throw new Error('Estado inválido');
    }
    const estadoId = Const.states['APROBADO - RRHH'];
    solicitud = await Solicitud.update({
      estadoId,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    const dataEstadoSolicitud = { solicitudId: data.solicitudId, estadoId, colaboradorId: data.colaboradorRRHHId };
    await EstadoSolicitud.create(dataEstadoSolicitud, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    await t.commit();
    return solicitud;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
Solicitud.rechazarSolicitudFuvex = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    let solicitud = await Solicitud.findOne({
      where: { id: data.solicitudId },
      include: {
        model: CampaniaConvenio,
        as: 'CampaniaConvenio',
        attributes: ['id', 'empresaConvenioId'],
      },
    });
    if (!solicitud) {
      throw new Error('No existe la solicitud.');
    }
    const statesValidates = [Const.states.REGISTRADO, Const.states.SOLICITADO, Const.states.EVALUADO, Const.states.SIMULADO];
    if (!statesValidates.includes(solicitud.estadoId)) {
      throw new Error('Estado inválido');
    }
    const reasonsRejectEmpresaConvenio = await MotivoRechazo.findAll({
      where: {
        [Op.or]: [
          {
            empresaConvenioId: solicitud.CampaniaConvenio.empresaConvenioId,
            tipoMotivoRechazo: data.tipoMotivoRechazo,
          },
          {
            empresaConvenioId: solicitud.CampaniaConvenio.empresaConvenioId,
            tipoMotivoRechazo: Const.typesReasonReject.DEFAULT,
            descripcion: Const.reasonsReject.OTROS,
          },
        ],
      },
      attributes: ['id', 'descripcion', 'tipoMotivoRechazo'],
    });
    const validate = data.reasonsReject.every((reasonRequest) => { // data from request
      const validateReasons = reasonsRejectEmpresaConvenio.find((reason) => {
        if (reason.descripcion === Const.reasonsReject.OTROS) {
          if (reason.id === reasonRequest.id && reason.descripcion === reasonRequest.descripcion && reason.tipoMotivoRechazo === Const.typesReasonReject.DEFAULT) {
            return reason;
          }
        }
        if (reason.id === reasonRequest.id && reason.descripcion === reasonRequest.descripcion && reason.tipoMotivoRechazo === data.tipoMotivoRechazo) {
          return reason;
        }
      });
      return validateReasons;
    });
    if (!validate) {
      throw new Error('Los motivos de rechazo no corresponden a la empresa convenio.');
    }
    const fechaExpiracion = moment().add('days', 15);
    const dateFechaExpiracion = fechaExpiracion.format('YYYY-MM-DD');
    // update solicitud
    solicitud = await Solicitud.update({
      estadoId: Const.states.CANCELADO,
      vistaHTML: 'DatosSolicitante',
      fechaExpiracion: dateFechaExpiracion,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    // create estado solicitud
    const dataEstadoSolicitud = { solicitudId: data.solicitudId, estadoId: Const.states.CANCELADO, colaboradorId: data.colaboradorId };
    await EstadoSolicitud.create(dataEstadoSolicitud, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    // data reasonsReject
    const dataReasonsReject = [];
    data.reasonsReject.map(async (reason) => {
      if (reason.descripcion === 'OTROS') {
        dataReasonsReject.push({ solicitudId: data.solicitudId, motivoRechazoId: reason.id, descripcion: reason.descripcionOther });
      } else {
        dataReasonsReject.push({ solicitudId: data.solicitudId, motivoRechazoId: reason.id });
      }
    });
    // create reasonsReject
    await MotivoRechazoSolicitud.bulkCreate(dataReasonsReject, {
      transaction: t,
    });
    await t.commit();
    return solicitud;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
Solicitud.rechazarSolicitudRrhh = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    let solicitud = await Solicitud.findOne({
      where: { id: data.solicitudId },
      include: [{
        model: CampaniaConvenio,
        as: 'CampaniaConvenio',
        attributes: ['id', 'empresaConvenioId'],
      }],
    });
    if (!solicitud) {
      throw new Error('No existe la solicitud.');
    }
    console.log(solicitud.CampaniaConvenio, 'solicitud.CampaniaConvenio');
    const fEmpresaConvenio = await EmpresaConvenio.findByPk(solicitud.CampaniaConvenio.empresaConvenioId);
    console.log(fEmpresaConvenio, 'fEmpresaConvenio');
    const statesValidates = [Const.states.SOLICITADO];
    if (!statesValidates.includes(solicitud.estadoId)) {
      throw new Error('Estado inválido');
    }
    const reasonsRejectEmpresaConvenio = await MotivoRechazo.findAll({
      where: {
        [Op.or]: [
          {
            empresaConvenioId: solicitud.CampaniaConvenio.empresaConvenioId,
            tipoMotivoRechazo: data.tipoMotivoRechazo,
          },
          {
            empresaConvenioId: solicitud.CampaniaConvenio.empresaConvenioId,
            tipoMotivoRechazo: Const.typesReasonReject.DEFAULT,
            descripcion: Const.reasonsReject.OTROS,
          },
        ],
      },
      attributes: ['id', 'descripcion', 'tipoMotivoRechazo'],
    });
    const validate = data.reasonsReject.every((reasonRequest) => { // data from request
      const validateReasons = reasonsRejectEmpresaConvenio.find((reason) => {
        if (reason.descripcion === Const.reasonsReject.OTROS) {
          if (reason.id === reasonRequest.id && reason.descripcion === reasonRequest.descripcion && reason.tipoMotivoRechazo === Const.typesReasonReject.DEFAULT) {
            return reason;
          }
        }
        if (reason.id === reasonRequest.id && reason.descripcion === reasonRequest.descripcion && reason.tipoMotivoRechazo === data.tipoMotivoRechazo) {
          return reason;
        }
      });
      return validateReasons;
    });
    if (!validate) {
      throw new Error('Los motivos de rechazo no corresponden a la empresa convenio.');
    }
    let estadoId = Const.states['OBSERVADO - RRHH'];
    let vistaHTML = 'DatosSolicitante';
    if (fEmpresaConvenio.logicaEstadoRRHH === 'CA') {
      estadoId = Const.states['CANCELADO'];
      vistaHTML = '';
    }
    // update solicitud
    solicitud = await Solicitud.update({
      estadoId,
      vistaHTML,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    // create estado solicitud
    const dataEstadoSolicitud = { solicitudId: data.solicitudId, estadoId, colaboradorId: data.colaboradorRRHHId };
    await EstadoSolicitud.create(dataEstadoSolicitud, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    // data reasonsReject
    const dataReasonsReject = [];
    data.reasonsReject.map(async (reason) => {
      if (reason.descripcion === 'OTROS') {
        dataReasonsReject.push({ solicitudId: data.solicitudId, motivoRechazoId: reason.id, descripcion: reason.descripcionOther });
      } else {
        dataReasonsReject.push({ solicitudId: data.solicitudId, motivoRechazoId: reason.id });
      }
    });
    // create reasonsReject
    await MotivoRechazoSolicitud.bulkCreate(dataReasonsReject, {
      transaction: t,
    });
    // enviar correo
    const fSolicitud = await Solicitud.findByPk(data.solicitudId);
    const { colaboradorId } = fSolicitud;
    const cliente = await Cliente.findByPk(fSolicitud.clienteId);
    const clienteVivienda = await ClienteVivienda.findOne({ where: { clienteId: fSolicitud.clienteId } });
    const fColaborador = await Colaborador.findOne({ where: { id: colaboradorId } });
    const fColaboradorRRHH = await Colaborador.findOne({ where: { id: data.colaboradorRRHHId } });
    if (fEmpresaConvenio.logicaEstadoRRHH === 'CA') {
      // CLIENTE
      EmailSolicitudRechazadaRrhh.send({
        to: clienteVivienda.correoElectronico,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
      // FUVEX
      EmailSolicitudRechazadaRrhh.send({
        to: fColaborador.correo,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
      // RRHH
      EmailSolicitudRechazadaRrhh.send({
        to: fColaboradorRRHH.correo,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
    } else {
      // CLIENTE
      EmailSolicitudObservadaRrhh.send({
        to: clienteVivienda.correoElectronico,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
      // FUVEX
      EmailSolicitudObservadaRrhh.send({
        to: fColaborador.correo,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
      // RRHH
      EmailSolicitudObservadaRrhh.send({
        to: fColaboradorRRHH.correo,
        dynamic_template_data: {
          fullname: cliente.nombres,
        },
      });
    }
    await t.commit();
    return fSolicitud;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
Solicitud.aprobarSolicitudAnalista = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    let solicitud = await Solicitud.findOne({ where: { id: data.solicitudId } });
    if (!solicitud) {
      throw new Error('No existe la solicitud.');
    }
    const statesValidates = [Const.states['APROBADO - RRHH']];
    if (!statesValidates.includes(solicitud.estadoId)) {
      throw new Error('Estado inválido');
    }
    const estadoId = Const.states['APROBADO - ANALISTA'];
    solicitud = await Solicitud.update({
      estadoId,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    const dataEstadoSolicitud = { solicitudId: data.solicitudId, estadoId, colaboradorId: data.colaboradorAnalistaId };
    await EstadoSolicitud.create(dataEstadoSolicitud, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    await t.commit();
    return solicitud;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
Solicitud.aprobarSolicitudFormalizador = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    let solicitud = await Solicitud.findOne({ where: { id: data.solicitudId } });
    if (!solicitud) {
      throw new Error('No existe la solicitud.');
    }
    const statesValidates = [Const.states['APROBADO - ANALISTA']];
    if (!statesValidates.includes(solicitud.estadoId)) {
      throw new Error('Estado inválido');
    }
    const estadoId = Const.states.FINALIZADO;
    const fechaExpiracion = moment().add('days', 15);
    const dateFechaExpiracion = fechaExpiracion.format('YYYY-MM-DD');
    solicitud = await Solicitud.update({
      estadoId,
      fechaExpiracion: dateFechaExpiracion,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    const dataEstadoSolicitud = {
      solicitudId: data.solicitudId,
      estadoId,
      colaboradorId: data.colaboradorFormalizadorId,
    };
    await EstadoSolicitud.create(dataEstadoSolicitud, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    await t.commit();
    return solicitud;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
Solicitud.rechazarSolicitudAnalista = async function (data) {
  const t = await Database.sequelize.transaction();
  try {
    let solicitud = await Solicitud.findOne({
      where: { id: data.solicitudId },
      include: {
        model: CampaniaConvenio,
        as: 'CampaniaConvenio',
        attributes: ['id', 'empresaConvenioId'],
      },
    });
    if (!solicitud) {
      throw new Error('No existe la solicitud.');
    }
    const statesValidates = [Const.states['APROBADO - RRHH']];
    if (!statesValidates.includes(solicitud.estadoId)) {
      throw new Error('Estado inválido');
    }
    const reasonsRejectEmpresaConvenio = await MotivoRechazo.findAll({
      where: {
        [Op.or]: [
          {
            empresaConvenioId: solicitud.CampaniaConvenio.empresaConvenioId,
            tipoMotivoRechazo: data.tipoMotivoRechazo,
          },
          {
            empresaConvenioId: solicitud.CampaniaConvenio.empresaConvenioId,
            tipoMotivoRechazo: Const.typesReasonReject.DEFAULT,
            descripcion: Const.reasonsReject.OTROS,
          },
        ],
      },
      attributes: ['id', 'descripcion', 'tipoMotivoRechazo'],
    });
    const validate = data.reasonsReject.every((reasonRequest) => { // data from request
      const validateReasons = reasonsRejectEmpresaConvenio.find((reason) => {
        if (reason.descripcion === Const.reasonsReject.OTROS) {
          if (reason.id === reasonRequest.id && reason.descripcion === reasonRequest.descripcion && reason.tipoMotivoRechazo === Const.typesReasonReject.DEFAULT) {
            return reason;
          }
        }
        if (reason.id === reasonRequest.id && reason.descripcion === reasonRequest.descripcion && reason.tipoMotivoRechazo === data.tipoMotivoRechazo) {
          return reason;
        }
      });
      return validateReasons;
    });
    if (!validate) {
      throw new Error('Los motivos de rechazo no corresponden a la empresa convenio.');
    }
    const estadoId = Const.states['OBSERVADO - ANALISTA'];
    // update solicitud
    solicitud = await Solicitud.update({
      estadoId,
      vistaHTML: 'DatosPersonales',
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    // create estado solicitud
    const dataEstadoSolicitud = { solicitudId: data.solicitudId, estadoId, colaboradorId: data.colaboradorAnalistaId };
    await EstadoSolicitud.create(dataEstadoSolicitud, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    // data reasonsReject
    const dataReasonsReject = [];
    data.reasonsReject.map(async (reason) => {
      if (reason.descripcion === 'OTROS') {
        dataReasonsReject.push({ solicitudId: data.solicitudId, motivoRechazoId: reason.id, descripcion: reason.descripcionOther });
      } else {
        dataReasonsReject.push({ solicitudId: data.solicitudId, motivoRechazoId: reason.id });
      }
    });
    // create reasonsReject
    await MotivoRechazoSolicitud.bulkCreate(dataReasonsReject, {
      transaction: t,
    });
    await t.commit();
    return solicitud;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
Solicitud.rechazarPorEdad = async (data) => {
  const t = await Database.sequelize.transaction();
  try {
    let solicitud = await Solicitud.findOne({
      where: { id: data.solicitudId },
      include: [{
        model: Cliente,
        as: 'Cliente',
        include: [{
          model: ClienteLaboral,
          as: 'ClienteLaboral',
          attributes: ['empresaConvenioId'],
        }],
      }],
    });
    const { empresaConvenioId } = solicitud.Cliente.ClienteLaboral;
    if (!solicitud) {
      throw new Error('No existe la solicitud.');
    }
    const statesValidates = [Const.states.REGISTRADO];
    if (!statesValidates.includes(solicitud.estadoId)) {
      throw new Error('Estado inválido');
    }
    const fechaExpiracion = moment().add('days', 15);
    const dateFechaExpiracion = fechaExpiracion.format('YYYY-MM-DD');
    solicitud = await Solicitud.update({
      estadoId: Const.states.CANCELADO,
      fechaExpiracion: dateFechaExpiracion,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    const dataEstadoSolicitud = { solicitudId: data.solicitudId, estadoId: Const.states.CANCELADO, colaboradorId: data.colaboradorId };
    await EstadoSolicitud.create(dataEstadoSolicitud, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    const reasonReject = await MotivoRechazo.findOne({
      where: {
        empresaConvenioId,
        tipoMotivoRechazo: Const.typesReasonReject.DEFAULT,
        descripcion: Const.reasonsReject['POR RANGO DE EDAD'],
      },
    });
    const dataMotivoRechazoSolicitud = { solicitudId: data.solicitudId, motivoRechazoId: reasonReject.id };
    await MotivoRechazoSolicitud.create(dataMotivoRechazoSolicitud, {
      fields: [
        'solicitudId',
        'motivoRechazoId',
      ],
      transaction: t,
    });
    await t.commit();
    return solicitud;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
Solicitud.rechazarPorListaNegra = async (data) => {
  const t = await Database.sequelize.transaction();
  try {
    const fechaExpiracion = moment().add('days', 15);
    const dateFechaExpiracion = fechaExpiracion.format('YYYY-MM-DD');
    const solicitud = await Solicitud.update({
      estadoId: Const.states.CANCELADO,
      fechaExpiracion: dateFechaExpiracion,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    const dataEstadoSolicitud = { solicitudId: data.solicitudId, estadoId: Const.states.CANCELADO, colaboradorId: data.colaboradorId };
    await EstadoSolicitud.create(dataEstadoSolicitud, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    const reasonReject = await MotivoRechazo.findOne({
      where: {
        empresaConvenioId: data.empresaConvenioId,
        tipoMotivoRechazo: Const.typesReasonReject.DEFAULT,
        descripcion: Const.reasonsReject['POR LISTA NEGRA'],
      },
    });
    const dataMotivoRechazoSolicitud = { solicitudId: data.solicitudId, motivoRechazoId: reasonReject.id };
    await MotivoRechazoSolicitud.create(dataMotivoRechazoSolicitud, {
      fields: [
        'solicitudId',
        'motivoRechazoId',
      ],
      transaction: t,
    });
    await t.commit();
    return solicitud;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
Solicitud.rechazarPorPPM = async (data) => {
  const t = await Database.sequelize.transaction();
  try {
    const fechaExpiracion = moment().add('days', 15);
    const dateFechaExpiracion = fechaExpiracion.format('YYYY-MM-DD');
    const solicitud = await Solicitud.update({
      estadoId: Const.states.CANCELADO,
      fechaExpiracion: dateFechaExpiracion,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    const dataEstadoSolicitud = { solicitudId: data.solicitudId, estadoId: Const.states.CANCELADO, colaboradorId: data.colaboradorId };
    await EstadoSolicitud.create(dataEstadoSolicitud, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    console.log(JSON.stringify({
      where: {
        empresaConvenioId: data.empresaConvenioId,
        tipoMotivoRechazo: Const.typesReasonReject.DEFAULT,
        descripcion: Const.reasonsReject['POR CALCULO DE ENDEUDAMIENTO'],
      },
    }), 'whereee');
    const reasonReject = await MotivoRechazo.findOne({
      where: {
        empresaConvenioId: data.empresaConvenioId,
        tipoMotivoRechazo: Const.typesReasonReject.DEFAULT,
        descripcion: Const.reasonsReject['POR CALCULO DE ENDEUDAMIENTO'],
      },
    });
    const dataMotivoRechazoSolicitud = { solicitudId: data.solicitudId, motivoRechazoId: reasonReject.id };
    await MotivoRechazoSolicitud.create(dataMotivoRechazoSolicitud, {
      fields: [
        'solicitudId',
        'motivoRechazoId',
      ],
      transaction: t,
    });
    await t.commit();
    return solicitud;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};
Solicitud.pendientePorClienteInstitucion = async (data) => {
  const solicitud = Solicitud.findOne({
    where: {
      estadoId: { [Op.notIn]: [Const.states.FINALIZADO, Const.states.CANCELADO] },
    },
    include: [{
      model: Cliente,
      as: 'Cliente',
      required: true,
      where: {
        numDocumento: data.numDocumento,
        id: {
          [Op.ne]: data.clienteId,
        },
      },
    }, {
      model: CampaniaConvenio,
      as: 'CampaniaConvenio',
      required: true,
      include: {
        model: EmpresaConvenio,
        as: 'EmpresaConvenio',
        required: true,
        include: {
          model: Empresa,
          as: 'Empresa',
          required: true,
          where: {
            ruc: data.ruc,
          },
        },
      },
    }],
  });
  return solicitud;
};
Solicitud.rechazarPorSolicitudEnCurso = async (data) => {
  const t = await Database.sequelize.transaction();
  try {
    const solicitud = await Solicitud.findOne({
      where: { clienteId: data.clienteId },
    });
    // const statesValidates = [Const.states.REGISTRADO];
    // if (!statesValidates.includes(solicitud.estadoId)) {
    //   throw new Error('Estado inválido');
    // }
    const fechaExpiracion = moment().add('days', 15);
    const dateFechaExpiracion = fechaExpiracion.format('YYYY-MM-DD');
    await Solicitud.update({
      estadoId: Const.states.CANCELADO,
      fechaExpiracion: dateFechaExpiracion,
    }, {
      where: {
        id: solicitud.id,
      },
      transaction: t,
    });
    const dataEstadoSolicitud = { solicitudId: solicitud.id, estadoId: Const.states.CANCELADO, colaboradorId: data.colaboradorId };
    await EstadoSolicitud.create(dataEstadoSolicitud, {
      fields: [
        'solicitudId',
        'estadoId',
        'colaboradorId',
      ],
      transaction: t,
    });
    const reasonReject = await MotivoRechazo.findOne({
      where: {
        empresaConvenioId: data.empresaConvenioId,
        tipoMotivoRechazo: Const.typesReasonReject.DEFAULT,
        descripcion: Const.reasonsReject['POR SOLICITUD EN CURSO'],
      },
    });
    const dataMotivoRechazoSolicitud = { solicitudId: solicitud.id, motivoRechazoId: reasonReject.id };
    await MotivoRechazoSolicitud.create(dataMotivoRechazoSolicitud, {
      fields: [
        'solicitudId',
        'motivoRechazoId',
      ],
      transaction: t,
    });
    await t.commit();
    return solicitud;
  } catch (e) {
    await t.rollback();
    throw e;
  }
};

Solicitud.actualizarPPMEnSolicitud = async (data) => {
  const t = await Database.sequelize.transaction();
  try {
    const row = await Solicitud.update({
      vistaHTML: 'Evaluacion',
      ppm: data.montoPPM,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    await t.commit();
    return row;
  } catch (err) {
    console.log(err);
    await t.rollback();
    throw err;
  }
};
Solicitud.actualizarDesdeEvaluador = async (data) => {
  const t = await Database.sequelize.transaction();
  try {
    const row = await Solicitud.update({
      montoPrestamo: data.montoPrestamo,
      plazo: data.plazo,
      periodoGracia: data.periodoGracia,
      cuota: data.cuota,
      montoMaxBanco: data.montoMaxBanco,
      plazoMontoMaxBanco: data.plazoMontoMaxBanco,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    await t.commit();
    return row;
  } catch (err) {
    console.log(err);
    await t.rollback();
    throw err;
  }
};

Solicitud.desbloquearLector = async (data, message = null) => {
  const t = await Database.sequelize.transaction();
  try {
    const arrUpdate = {
      estadoLector: 'D', // desbloqueado
    };
    if (message) {
      arrUpdate.errorLector = message;
    }
    const row = await Solicitud.update(arrUpdate, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    await t.commit();
    return row;
  } catch (err) {
    console.log(err);
    await t.rollback();
    throw err;
  }
};
Solicitud.bloquearLector = async (data) => {
  const t = await Database.sequelize.transaction();
  try {
    const row = await Solicitud.update({
      estadoLector: 'B', // bloqueado
      motivoRechazo: null, // seteado a null
      fechaEnvioLector: data.fechaEnvioLector,
      fechaReenvioLector: data.fechaReenvioLector,
    }, {
      where: {
        id: data.solicitudId,
      },
      transaction: t,
    });
    await t.commit();
    return row;
  } catch (err) {
    console.log(err);
    await t.rollback();
    throw err;
  }
};

/* REPORTES */
Solicitud.listarReporteSolicitudes = async (data) => {
  // const arrData = await Solicitud.query(querySelect);
  const paramDesde = data.desde || null;
  const paramHasta = data.hasta || null;
  return sequelize.query(`CALL SP_LISTA_SOLICITUDES('${paramDesde}','${paramHasta}');`, {
    bind: [],
    type: sequelize.QueryTypes.RAW,
  });
};

Solicitud.generarAnonimizacion = async () => {
  // const arrData = await Solicitud.query(querySelect);
  // const paramDesde = data.desde || null;
  // const paramHasta = data.hasta || null;
  return sequelize.query('CALL SP_ANONIMIZACION_SOLICITUDES();', {
    bind: [],
    type: sequelize.QueryTypes.RAW,
  });
};
// Solicitud.listarReporteRRHHSolicitudes = async () => {
//   // const arrData = await Solicitud.query(querySelect);
//   return sequelize.query('CALL SP_LISTA_SOLICITUDES();', {
//     bind: [],
//     type: sequelize.QueryTypes.RAW,
//   });
// };
module.exports = Solicitud;
