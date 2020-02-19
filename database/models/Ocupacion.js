module.exports = (sequelize, DataTypes) => {
  const Ocupacion = sequelize.define('Ocupacion', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    codigo: {
      allowNull: false,
      type: DataTypes.STRING(4),
    },
    nombre: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado
      defaultValue: 1,
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  return Ocupacion;
};
