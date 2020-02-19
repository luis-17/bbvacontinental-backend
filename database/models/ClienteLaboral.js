module.exports = (sequelize, DataTypes) => {
  const ClienteLaboral = sequelize.define('ClienteLaboral', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    clienteId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    empresaConvenioId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    registroEmpresa: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    ocupacionId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    inicioLaboral: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    ingresoFijo: {
      allowNull: true,
      type: DataTypes.STRING,
      get() {
        const ingresoFijo = this.getDataValue('ingresoFijo');
        if (ingresoFijo === undefined || ingresoFijo === null) {
          return null;
        }
        return Buffer.from(ingresoFijo, 'base64').toString('ascii');
      },
    },
    ingresoVariable: {
      allowNull: true,
      type: DataTypes.STRING,
      get() {
        const ingresoVariable = this.getDataValue('ingresoVariable');
        if (ingresoVariable === undefined || ingresoVariable === null) {
          return null;
        }
        return Buffer.from(ingresoVariable, 'base64').toString('ascii');
      },
    },
    cuotaPr: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    cuotaMaxima: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    tipoIngreso: {
      allowNull: false,
      type: DataTypes.ENUM('F', 'V'),
    },
    frecuenciaPagoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    condicionLaboralId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  ClienteLaboral.associate = function (models) {
    ClienteLaboral.belongsTo(models.Cliente, {
      as: 'Cliente',
      foreignKey: 'clienteId',
      targetKey: 'id',
    });
    ClienteLaboral.belongsTo(models.EmpresaConvenio, {
      as: 'EmpresaConvenio',
      foreignKey: 'empresaConvenioId',
      targetKey: 'id',
    });
    ClienteLaboral.belongsTo(models.FrecuenciaPago, {
      as: 'FrecuenciaPago',
      foreignKey: 'frecuenciaPagoId',
      targetKey: 'id',
    });
    ClienteLaboral.belongsTo(models.CondicionLaboral, {
      as: 'CondicionLaboral',
      foreignKey: 'condicionLaboralId',
      targetKey: 'id',
    });
    ClienteLaboral.belongsTo(models.Ocupacion, {
      as: 'Ocupacion',
      foreignKey: 'ocupacionId',
      targetKey: 'id',
    });
  };
  return ClienteLaboral;
};
