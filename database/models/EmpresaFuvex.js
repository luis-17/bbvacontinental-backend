module.exports = (sequelize, DataTypes) => {
  const EmpresaFuvex = sequelize.define('EmpresaFuvex', {
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
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  EmpresaFuvex.associate = function (models) {
    EmpresaFuvex.belongsTo(models.Empresa, {
      as: 'Empresa',
      foreignKey: 'empresaId',
      targetKey: 'id',
    });
  };
  return EmpresaFuvex;
};
