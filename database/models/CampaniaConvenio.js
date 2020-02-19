module.exports = (sequelize, DataTypes) => {
  const CampaniaConvenio = sequelize.define('CampaniaConvenio', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    codigo: {
      allowNull: false,
      type: DataTypes.STRING(5),
    },
    empresaConvenioId: {
      allowNull: false,
      type: DataTypes.INTEGER(11),
    },
    descripcionCorta: {
      allowNull: false,
      type: DataTypes.STRING(200),
    },
    descripcionLarga: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    tipoCampania: {
      allowNull: false,
      type: DataTypes.STRING(1),
    },
    tasa: {
      allowNull: false,
      type: DataTypes.FLOAT,
    },
    fechaFinVigencia: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    diaPago: {
      allowNull: false,
      type: DataTypes.INTEGER(2),
    },
    diaCorte: {
      allowNull: false,
      type: DataTypes.INTEGER(2),
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT(1),
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  CampaniaConvenio.associate = function (models) {
    CampaniaConvenio.belongsTo(models.EmpresaConvenio, {
      as: 'EmpresaConvenio',
      foreignKey: 'empresaConvenioId',
      targetKey: 'id',
    });
  };
  return CampaniaConvenio;
};
