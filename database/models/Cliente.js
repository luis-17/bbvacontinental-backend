// const fieldEncryption = require('./../plugins/sequelieze-field-encrypt.js');

module.exports = (sequelize, DataTypes) => {
  const Cliente = sequelize.define('Cliente', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    estadoCivilId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    tipoDocumentoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    numDocumento: {
      allowNull: false,
      type: DataTypes.STRING,
      get() {
        const numeroDocumento = this.getDataValue('numDocumento');
        if (numeroDocumento === undefined || numeroDocumento === null) {
          return null;
        }
        return Buffer.from(numeroDocumento, 'base64').toString('ascii');
      },
    },
    nombres: {
      allowNull: false,
      type: DataTypes.STRING,
      get() {
        const nombres = this.getDataValue('nombres');
        if (nombres === undefined || nombres === null) {
          return null;
        }
        return Buffer.from(nombres, 'base64').toString('ascii');
      },
    },
    apellidoPaterno: {
      allowNull: false,
      type: DataTypes.STRING,
      get() {
        const apellidoPaterno = this.getDataValue('apellidoPaterno');
        if (apellidoPaterno === undefined || apellidoPaterno === null) {
          return null;
        }
        return Buffer.from(apellidoPaterno, 'base64').toString('ascii');
      },
    },
    apellidoMaterno: {
      allowNull: false,
      type: DataTypes.STRING,
      get() {
        const apellidoMaterno = this.getDataValue('apellidoMaterno');
        if (apellidoMaterno === undefined || apellidoMaterno === null) {
          return null;
        }
        return Buffer.from(apellidoMaterno, 'base64').toString('ascii');
      },
    },
    nombreApellidoCompleto: {
      allowNull: true,
      type: DataTypes.VIRTUAL,
      get() {
        if (this.get('id')) {
          const nombres64 = this.getDataValue('nombres');
          const apellidoPaterno64 = this.getDataValue('apellidoPaterno');
          const apellidoMaterno64 = this.getDataValue('apellidoMaterno');
          const nombres = Buffer.from(nombres64, 'base64').toString('ascii');
          const apellidoPaterno = Buffer.from(apellidoPaterno64, 'base64').toString('ascii');
          const apellidoMaterno = Buffer.from(apellidoMaterno64, 'base64').toString('ascii');
          return `${nombres} ${apellidoPaterno} ${apellidoMaterno}`;
        }
        return undefined;
      },
    },
    fechaNacimiento: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    fechaVencimientoDoi: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    sexo: {
      allowNull: false,
      type: DataTypes.ENUM('M', 'F'),
    },
    confDatosCorrectos: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: datos confirmados; 0: datos por confirmar;
      defaultValue: 0,
    },
    fechaConfirmacionDatos: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado
      defaultValue: 1,
    },
    tipoDoiConyugue: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    numDoiConyugue: {
      allowNull: true,
      type: DataTypes.STRING,
      get() {
        const numDoiConyugue = this.getDataValue('numDoiConyugue');
        if (numDoiConyugue === undefined || numDoiConyugue === null) {
          return null;
        }
        return Buffer.from(numDoiConyugue, 'base64').toString('ascii');
      },
    },
    nombreConyugue: {
      allowNull: true,
      type: DataTypes.STRING,
      get() {
        const nombreConyugue = this.getDataValue('nombreConyugue');
        if (nombreConyugue === undefined || nombreConyugue === null) {
          return null;
        }
        return Buffer.from(nombreConyugue, 'base64').toString('ascii');
      },
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  Cliente.associate = function (models) {
    Cliente.belongsTo(models.EstadoCivil, {
      as: 'EstadoCivil',
      foreignKey: 'estadoCivilId',
      targetKey: 'id',
    });
    Cliente.belongsTo(models.TipoDocumento, {
      as: 'TipoDocumento',
      foreignKey: 'tipoDocumentoId',
      targetKey: 'id',
    });
    Cliente.belongsTo(models.TipoDocumento, {
      as: 'TipoDocumentoConyugue',
      foreignKey: 'tipoDoiConyugue',
      targetKey: 'id',
    });
    Cliente.hasOne(models.ClienteLaboral, {
      as: 'ClienteLaboral',
      foreignKey: 'clienteId',
      sourceKey: 'id',
    });
    Cliente.hasOne(models.ClienteVivienda, {
      as: 'ClienteVivienda',
      foreignKey: 'clienteId',
      sourceKey: 'id',
    });
  };
  return Cliente;
};
