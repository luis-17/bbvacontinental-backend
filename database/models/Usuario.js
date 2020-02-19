const Password = use('Password');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    perfilId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    fechaUltInicioSesion: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
    fechaUltCierreSesion: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
    ultDireccionIp: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    ultToken: {
      allowNull: true,
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    resetPassToken: {
      allowNull: true,
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    resetPassExpires: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado; 2: bloqueado login fallido
    },
    lastPasswordAttempt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
    passwordAttemptCount: {
      allowNull: true,
      type: DataTypes.TINYINT,
    },
    suspendedUntil: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
    forceUserChangePassword: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
      defaultValue: null,
    },
    lastConnection: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  Usuario.beforeCreate(async (user) => {
    const hashedPw = await Password.hash(user.password);
    user.password = hashedPw;
  });
  Usuario.associate = function (models) {
    Usuario.belongsTo(models.Perfil, {
      as: 'Perfil',
      foreignKey: 'perfilId',
      targetKey: 'id',
    });
    Usuario.hasMany(models.UsuarioPerfil, {
      as: 'UsuarioPerfil',
      foreignKey: 'usuarioId',
      sourceKey: 'id',
    });
    Usuario.hasMany(models.EmpresaUsuario, {
      as: 'EmpresaUsuario',
      foreignKey: 'usuarioId',
      sourceKey: 'id',
    });
    Usuario.hasOne(models.Colaborador, {
      as: 'Colaborador',
      foreignKey: 'usuarioId',
      sourceKey: 'id',
    });
  };
  return Usuario;
};
