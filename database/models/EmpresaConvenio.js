module.exports = (sequelize, DataTypes) => {
  const EmpresaConvenio = sequelize.define('EmpresaConvenio', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    empresaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    cantMesesVariable: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    montoMinimoPrestamo: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    montoMaximoPrestamo: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    logicaEstadoRRHH: {
      allowNull: false,
      type: DataTypes.ENUM('OB', 'CA'), // OBSERVADO // CANCELADO
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  EmpresaConvenio.associate = function (models) {
    EmpresaConvenio.belongsTo(models.Empresa, {
      as: 'Empresa',
      foreignKey: 'empresaId',
      targetKey: 'id',
    });
    EmpresaConvenio.hasOne(models.ColaboradorEmpresaConvenio, {
      as: 'ColaboradorEmpresaConvenio',
      foreignKey: 'empresaConvenioId',
      sourceKey: 'id',
    });
  };
  return EmpresaConvenio;
};
