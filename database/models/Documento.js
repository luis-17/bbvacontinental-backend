module.exports = (sequelize, DataTypes) => {
  const Documento = sequelize.define('Documento', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    alias: {
      allowNull: false,
      type: DataTypes.STRING(100),
    },
    nombre: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    descripcion: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    labelHTML: {
      allowNull: false,
      type: DataTypes.STRING(100),
    },
    descripcionHTML: {
      allowNull: false,
      type: DataTypes.TEXT,
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
  return Documento;
};
