module.exports = (sequelize, DataTypes) => {
  const UsuarioPerfil = sequelize.define('UsuarioPerfil', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    usuarioId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    perfilId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado;
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  UsuarioPerfil.associate = function (models) {
    UsuarioPerfil.belongsTo(models.Usuario, {
      as: 'Usuario',
      foreignKey: 'usuarioId',
      targetKey: 'id',
    });
    UsuarioPerfil.belongsTo(models.Perfil, {
      as: 'Perfil',
      foreignKey: 'perfilId',
      targetKey: 'id',
    });
  };
  return UsuarioPerfil;
};
