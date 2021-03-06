module.exports = (sequelize, DataTypes) => {
  const EstadoCivil = sequelize.define('EstadoCivil', {
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
  return EstadoCivil;
};
