module.exports = (sequelize, DataTypes) => {
  const Permiso = sequelize.define('Permiso', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    parentPermisoId: {
      allowNull: true,
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
    url: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  return Permiso;
};
