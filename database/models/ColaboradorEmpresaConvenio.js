module.exports = (sequelize, DataTypes) => {
  const ColaboradorEmpresaConvenio = sequelize.define('ColaboradorEmpresaConvenio', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    empresaConvenioId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    colaboradorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  ColaboradorEmpresaConvenio.associate = function (models) {
    ColaboradorEmpresaConvenio.belongsTo(models.Colaborador, {
      as: 'Colaborador',
      foreignKey: 'colaboradorId',
      targetKey: 'id',
    });
    ColaboradorEmpresaConvenio.belongsTo(models.EmpresaConvenio, {
      as: 'EmpresaConvenio',
      foreignKey: 'empresaConvenioId',
      targetKey: 'id',
    });
  };
  return ColaboradorEmpresaConvenio;
};
