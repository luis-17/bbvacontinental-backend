module.exports = (sequelize, DataTypes) => {
  const InstitucionFinanciera = sequelize.define('InstitucionFinanciera', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nombreComercial: {
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
  return InstitucionFinanciera;
};
