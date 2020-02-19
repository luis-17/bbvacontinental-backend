module.exports = (sequelize, DataTypes) => {
  const PermisoPerfil = sequelize.define('PermisoPerfil', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    permisoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    perfilId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  PermisoPerfil.associate = function (models) {
    PermisoPerfil.belongsTo(models.Permiso, {
      as: 'Permiso',
      foreignKey: 'permisoId',
      targetKey: 'id',
    });
    PermisoPerfil.belongsTo(models.Perfil, {
      as: 'Perfil',
      foreignKey: 'perfilId',
      targetKey: 'id',
    });
  };
  return PermisoPerfil;
};
