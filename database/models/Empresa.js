module.exports = (sequelize, DataTypes) => {
  const Empresa = sequelize.define('Empresa', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    actividadEconomicaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    nombreComercial: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    nombreLegal: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    representanteLegal: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    ruc: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    telefono: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  Empresa.associate = function (models) {
    Empresa.belongsTo(models.ActividadEconomica, {
      as: 'ActividadEconomica',
      foreignKey: 'actividadEconomicaId',
      targetKey: 'id',
    });
    Empresa.hasOne(models.EmpresaConvenio, {
      as: 'EmpresaConvenio',
      foreignKey: 'empresaId',
      sourceKey: 'id',
    });
    Empresa.hasOne(models.Colaborador, {
      as: 'Colaborador',
      foreignKey: 'empresaId',
      sourceKey: 'id',
    });
  };
  return Empresa;
};
