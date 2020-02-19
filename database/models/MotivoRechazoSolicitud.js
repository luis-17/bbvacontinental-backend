module.exports = (sequelize, DataTypes) => {
  const MotivoRechazoSolicitud = sequelize.define('MotivoRechazoSolicitud', {
    solicitudId: DataTypes.INTEGER,
    motivoRechazoId: DataTypes.INTEGER,
    descripcion: DataTypes.STRING,
  }, {
    timestamps: true,
    paranoid: false, // cambiar a true luego
    version: false,
    freezeTableName: true,
    tableName: 'MotivoRechazoSolicitud',
  });
  MotivoRechazoSolicitud.associate = function (models) {
    // associations can be defined here
    MotivoRechazoSolicitud.belongsTo(models.Solicitud, {
      as: 'Solicitud',
      foreignKey: 'solicitudId',
      targetKey: 'id',
    });
    MotivoRechazoSolicitud.belongsTo(models.MotivoRechazo, {
      as: 'MotivoRechazo',
      foreignKey: 'motivoRechazoId',
      targetKey: 'id',
    });
  };
  return MotivoRechazoSolicitud;
};
