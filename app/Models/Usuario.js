const Database = use('Database');
const Usuario = Database.model('Usuario');
const UsuarioPerfil = Database.model('UsuarioPerfil');
const EmpresaUsuario = Database.model('EmpresaUsuario');
const Empresa = Database.model('Empresa');
const Colaborador = Database.model('Colaborador');
const Perfil = Database.model('Perfil');

const { Op } = Database.Sequelize;

Usuario.findByUsername = async function (username) {
  const user = await Usuario.findOne({
    where: { username },
    include: [{
      model: UsuarioPerfil,
      as: 'UsuarioPerfil',
      include: [{
        model: Perfil,
        as: 'Perfil',
      }],
    }, {
      model: Colaborador,
      as: 'Colaborador',
      where: { estado: 1 },
    }],
  });
  if (user) {
    const usuarioPerfiles = user.UsuarioPerfil;
    const profiles = usuarioPerfiles.map(up => up.Perfil);
    profiles.sort((current, next) => {
      if (current.prioridad < next.prioridad) return -1;
      if (current.prioridad > next.prioridad) return 1;
      return 0;
    });
    let rol = null;
    if (profiles.length) {
      rol = profiles[0].id;
    }
    return { fUsuario: user, rol };
  }
  return null;
};

Usuario.findByResetPass = function ({ resetPassToken, resetPassExpires = new Date() }) {
  return Usuario.findOne({
    where: {
      resetPassToken,
      resetPassExpires: {
        [Op.gt]: resetPassExpires,
      },
    },
  });
};
Usuario.listaFuvexSupervisor = function (arrEmpresas, perfil) {
  const objIncludes = [];
  let whereUsuario = {};
  console.log('fuera', perfil.perfilId);
  if (perfil.perfilId === 8) { // FUVEXSUPERVISOR
    console.log('dentro');
    whereUsuario = {
      perfilId: {
        [Op.in]: [1], // solo fuvex
      },
    };
    objIncludes.push({
      attributes: ['id'],
      model: EmpresaUsuario,
      as: 'EmpresaUsuario',
      required: true,
      where: {
        empresaId: {
          [Op.in]: arrEmpresas,
        },
      },
      include: [{
        attributes: ['id'],
        model: Empresa,
        as: 'Empresa',
        required: true,
        include: [{
          attributes: ['id'],
          model: Colaborador,
          as: 'Colaborador',
          required: true,
          include: [{
            attributes: ['id', 'username'],
            model: Usuario,
            as: 'Usuario',
            required: true,
            include: [{
              attributes: ['id'],
              model: UsuarioPerfil,
              as: 'UsuarioPerfil',
              required: true,
              where: {
                perfilId: {
                  [Op.in]: [1], // solo fuvex
                },
              },
            }],
          }],
        }],
      }],
    });
  }
  objIncludes.push({
    attributes: ['id'],
    model: UsuarioPerfil,
    as: 'UsuarioPerfil',
    whereUsuario,
    required: true,
  });
  return Usuario.findAll({
    attributes: ['id'],
    where: {
      estado: 1,
    },
    include: objIncludes,
  });
};
Usuario.listaFuvexAdmin = function () {
  // objIncludes.push();
  return Usuario.findAll({
    attributes: ['id', 'username'],
    where: {
      estado: 1,
    },
    include: {
      attributes: ['id'],
      model: UsuarioPerfil,
      as: 'UsuarioPerfil',
      where: {
        perfilId: {
          [Op.in]: [1], // solo fuvex
        },
      },
      // required: true,
    },
  });
};
module.exports = Usuario;
