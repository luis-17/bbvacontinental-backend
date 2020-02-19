const Database = use('Database');
const { Sequelize: { Op } } = Database;
const Colaborador = Database.model('Colaborador');
const Empresa = Database.model('Empresa');
const Usuario = Database.model('Usuario');
const EstadoCivil = Database.model('EstadoCivil');
const TipoDocumento = Database.model('TipoDocumento');
const UsuarioPerfil = Database.model('UsuarioPerfil');
const ColaboradorEmpresaConvenio = Database.model('ColaboradorEmpresaConvenio');
const { Sequelize } = Database.Sequelize;

const EmailEnvioPrimerCorreo = use('Email/EnvioPrimerCorreo');

Colaborador.ListarColaboradoresRRHH = async () => {
  const colaborador = await Colaborador.findAll({
    include: [{
      model: Usuario,
      as: 'Usuario',
      include: [
        {
          model: UsuarioPerfil,
          as: 'UsuarioPerfil',
          where: { perfilId: 3 }, // RRHH
        },
      ],
    }],
  });
  return colaborador;
};

Colaborador.listarColaboradoresFuvex = async (arrParams) => {
  // const colaborador = await Colaborador.findAll({
  //   include: [{
  //     model: Usuario,
  //     as: 'Usuario',
  //     include: [
  //       {
  //         model: UsuarioPerfil,
  //         as: 'UsuarioPerfil',
  //         where: { perfilId: 1 }, // FUVEX
  //       },
  //     ],
  //   }],
  // });
  // return colaborador;
  const { colaborador, numeroDocumento } = arrParams;
  let where = {};
  const whereNumDoc = {};
  const wherePerfil = { perfilId: 1 };
  // let whereCliente = {};
  // console.log(colaborador, numeroDocumento, 'colaborador, numeroDocumento');
  if (colaborador) {
    where = Sequelize.where(
      Sequelize.fn('CONCAT', Sequelize.col('nombres'), ' ', Sequelize.col('apellidoPaterno'), ' ', Sequelize.col('apellidoMaterno')),
      {
        [Op.like]: `%${colaborador}%`,
      },
    );
  }
  if (numeroDocumento) {
    whereNumDoc.numeroDocumento = {
      [Op.like]: `%${numeroDocumento}%`,
    };
  }
  // if (fechaInicio && fechaFin) {
  //   where.createdAt = {
  //     [Op.between]: [fechaInicio, fechaFin],
  //   };
  // }
  // if (fechaInicio && !fechaFin) {
  //   where.createdAt = {
  //     [Op.gte]: fechaInicio,
  //   };
  // }
  // if (!fechaInicio && fechaFin) {
  //   where.createdAt = {
  //     [Op.lte]: fechaFin,
  //   };
  // }
  return Colaborador.findAll({
    attributes: ['id', 'nombres', 'apellidoPaterno', 'apellidoMaterno', 'numeroDocumento', 'correo', 'estado'],
    order: [
      ['createdAt', 'DESC'],
    ],
    where: [whereNumDoc, where],
    include: [{
      model: Usuario,
      as: 'Usuario',
      where: [wherePerfil],
    }],
  });
};

Colaborador.listarColaboradoresAnalista = async (arrParams) => {
  const { colaborador, numeroDocumento } = arrParams;
  let where = {};
  const whereNumDoc = {};
  const wherePerfil = { perfilId: [4, 6] };
  if (colaborador) {
    where = Sequelize.where(
      Sequelize.fn('CONCAT', Sequelize.col('nombres'), ' ', Sequelize.col('apellidoPaterno'), ' ', Sequelize.col('apellidoMaterno')),
      {
        [Op.like]: `%${colaborador}%`,
      },
    );
  }
  if (numeroDocumento) {
    whereNumDoc.numeroDocumento = {
      [Op.like]: `%${numeroDocumento}%`,
    };
  }
  return Colaborador.findAll({
    attributes: ['id', 'nombres', 'apellidoPaterno', 'apellidoMaterno', 'numeroDocumento', 'correo', 'estado'],
    order: [
      ['createdAt', 'DESC'],
    ],
    include: [{
      model: Usuario,
      as: 'Usuario',
      where: [wherePerfil],
    }],
    where: [whereNumDoc, where],
  });
};
Colaborador.findByUsuarioId = async (data) => {
  const colaborador = await Colaborador.findOne({
    where: {
      usuarioId: data.usuarioId,
    },
    include: [{
      model: Empresa,
      as: 'Empresa',
    }, {
      model: Usuario,
      as: 'Usuario',
    }, {
      model: EstadoCivil,
      as: 'EstadoCivil',
    }, {
      model: TipoDocumento,
      as: 'TipoDocumento',
    }],
  });
  return colaborador;
};

Colaborador.registrarColaboradorAnalista = async (data) => {
  const t = await Database.sequelize.transaction();
  try {
    // registramos usuario
    const arrDataUs = {};
    arrDataUs.username = `${data.nombres.replace(/ /g, '')}.${data.apellidoPaterno}`;
    arrDataUs.password = '123456';
    arrDataUs.estado = 1;
    arrDataUs.perfilId = data.perfilId; // SUPERVISOR O FORMALIZADOR
    console.log(arrDataUs.username, 'arrDataUs.username');
    const rowUs = await Usuario.create(arrDataUs, {
      fields: [
        'username',
        'password',
        'estado',
        'perfilId',
      ],
      transaction: t,
    });
    // registramos colaborador
    data.usuarioId = rowUs.id;
    data.estado = 1;
    const rowCol = await Colaborador.create(data, {
      fields: [
        'usuarioId',
        'apellidoMaterno',
        'apellidoPaterno',
        'celular',
        'correo',
        'nombres',
        'numeroDocumento',
        'sexo',
        'tipoDocumentoId',
        'estado',
      ],
      transaction: t,
    });
    // asignamos perfil de usuario
    const arrDataPerfil = {};
    arrDataPerfil.usuarioId = rowUs.id;
    arrDataPerfil.perfilId = data.perfilId; // SUPERVISOR O FORMALIZADOR
    arrDataPerfil.estado = 1;
    const rowPerfil = await UsuarioPerfil.create(arrDataPerfil, {
      fields: [
        'usuarioId',
        'perfilId',
        'estado',
      ],
      transaction: t,
    });
    // asignar correo
    EmailEnvioPrimerCorreo.send({
      to: data.correo,
      dynamic_template_data: {
        fullname: `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        usuario: arrDataUs.username,
        clave: arrDataUs.password,
      },
    });

    const row = {
      colaborador: rowCol,
      usuario: rowUs,
      perfil: rowPerfil,
    };

    await t.commit();
    return row;
  } catch (err) {
    await t.rollback();
    throw new Error(err.message);
  }
};

Colaborador.registrarColaborador = async (data) => {
  const t = await Database.sequelize.transaction();
  try {
    // registramos usuario
    const arrDataUs = {};
    arrDataUs.username = `${data.nombres.replace(/ /g, '')}.${data.apellidoPaterno}`;
    arrDataUs.password = '123456';
    arrDataUs.estado = 1;
    arrDataUs.perfilId = 1; // fuvex
    // console.log(arrDataUs.username, 'arrDataUs.username');
    const rowUs = await Usuario.create(arrDataUs, {
      fields: [
        'username',
        'password',
        'estado',
        'perfilId',
      ],
      transaction: t,
    });
    // registramos colaborador
    data.usuarioId = rowUs.id;
    data.estado = 1;
    const rowCol = await Colaborador.create(data, {
      fields: [
        'usuarioId',
        'apellidoMaterno',
        'apellidoPaterno',
        'celular',
        'correo',
        'empresaId',
        'nombres',
        'numeroDocumento',
        'sexo',
        'tipoDocumentoId',
        'estado',
      ],
      transaction: t,
    });
    // asignamos empresa convenio
    const arrDataCec = {};
    arrDataCec.colaboradorId = rowCol.id;
    arrDataCec.empresaConvenioId = 1; // hardcodeo sedapal, cambiar mas adelante OJO
    const rowCec = await ColaboradorEmpresaConvenio.create(arrDataCec, {
      fields: [
        'colaboradorId',
        'empresaConvenioId',
      ],
      transaction: t,
    });
    // asignamos perfil de usuario
    const arrDataPerfil = {};
    arrDataPerfil.usuarioId = rowUs.id;
    arrDataPerfil.perfilId = 1; // FUVEX
    arrDataPerfil.estado = 1;
    const rowPerfil = await UsuarioPerfil.create(arrDataPerfil, {
      fields: [
        'usuarioId',
        'perfilId',
        'estado',
      ],
      transaction: t,
    });
    // asignar correo
    EmailEnvioPrimerCorreo.send({
      to: data.correo,
      dynamic_template_data: {
        fullname: `${data.nombres} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        usuario: arrDataUs.username,
        clave: arrDataUs.password,
      },
    });
    // do stuff
    const row = {
      colaborador: rowCol,
      usuario: rowUs,
      cec: rowCec,
      perfil: rowPerfil,
    };

    await t.commit();
    return row;
  } catch (err) {
    await t.rollback();
    throw new Error(err.message);
  }
};

module.exports = Colaborador;
