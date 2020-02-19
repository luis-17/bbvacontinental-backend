module.exports = (sequelize, DataTypes) => {
  const Motivo = sequelize.define('Motivo', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    tipoMotivo: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: motivo de cambio; 2:motivo de rechazo
    },
    descripcion: {
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
  return Motivo;
};
