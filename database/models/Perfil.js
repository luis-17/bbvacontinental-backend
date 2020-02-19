module.exports = (sequelize, DataTypes) => {
  const Perfil = sequelize.define('Perfil', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nombre: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    descripcion: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado
    },
    prioridad: {
      allowNull: false,
      type: DataTypes.INTEGER, // 1 es mas importante que 2, 2 mas importante que 3, asi sucesivamente
      unique: true,
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  Perfil.associate = function (models) {
    Perfil.hasMany(models.UsuarioPerfil, {
      as: 'UsuarioPerfil',
      foreignKey: 'perfilId',
      sourceKey: 'id',
    });
  };
  return Perfil;
};
