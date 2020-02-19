module.exports = (sequelize, DataTypes) => {
  const HistoriaSimulador = sequelize.define('HistoriaSimulador', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    solicitudId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    keyHistoria: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    montoPrestamo: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    diaPago: {
      allowNull: false,
      type: DataTypes.TINYINT(2),
    },
    plazo: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    tasa: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    cuota: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    ppm: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    periodoGracia: {
      allowNull: false,
      type: DataTypes.TINYINT(1),
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  HistoriaSimulador.associate = function (models) {
    // associations can be defined here
    HistoriaSimulador.belongsTo(models.Solicitud, {
      as: 'Solicitud',
      foreignKey: 'solicitudId',
      targetKey: 'id',
    });
  };
  return HistoriaSimulador;
};
