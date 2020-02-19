module.exports = (sequelize, DataTypes) => {
  const Producto = sequelize.define('Producto', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    codigoExterno: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    nombre: {
      allowNull: false,
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
  return Producto;
};
