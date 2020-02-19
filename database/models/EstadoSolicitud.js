module.exports = (sequelize, DataTypes) => {
  const EstadoSolicitud = sequelize.define('EstadoSolicitud', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    estadoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    solicitudId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    colaboradorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  EstadoSolicitud.associate = function (models) {
    EstadoSolicitud.belongsTo(models.Estado, {
      as: 'Estado',
      foreignKey: 'estadoId',
      targetKey: 'id',
    });
    EstadoSolicitud.belongsTo(models.Solicitud, {
      as: 'Solicitud',
      foreignKey: 'solicitudId',
      targetKey: 'id',
    });
    EstadoSolicitud.belongsTo(models.Colaborador, {
      as: 'Colaborador',
      foreignKey: 'colaboradorId',
      targetKey: 'id',
    });
  };
  return EstadoSolicitud;
};
