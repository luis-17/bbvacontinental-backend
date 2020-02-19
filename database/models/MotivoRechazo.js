module.exports = (sequelize, DataTypes) => {
  const MotivoRechazo = sequelize.define('MotivoRechazo', {
    empresaConvenioId: DataTypes.INTEGER,
    descripcion: DataTypes.STRING,
    tipoMotivoRechazo: {
      allowNull: false,
      type: DataTypes.ENUM('fv', 'rh', 'ev', 'pd'),
    },
    estado: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado
  }, {
    timestamps: true,
    paranoid: false,
    version: false,
    freezeTableName: true,
    tableName: 'MotivoRechazo',
  });
  MotivoRechazo.associate = function (models) {
    // associations can be defined here
    MotivoRechazo.belongsTo(models.EmpresaConvenio, {
      as: 'EmpresaConvenio',
      foreignKey: 'empresaConvenioId',
      targetKey: 'id',
    });
    MotivoRechazo.belongsToMany(models.Solicitud, {
      as: 'SolicitudSol',
      through: 'MotivoRechazoSolicitud',
      foreignKey: 'motivoRechazoId',
    });
  };
  return MotivoRechazo;
};
