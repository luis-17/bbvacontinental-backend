module.exports = (sequelize, DataTypes) => {
  const ClienteVivienda = sequelize.define('ClienteVivienda', {
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
    tipoUbicacionId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    relacionViviendaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    paisId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    departamentoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    provinciaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    distritoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    tipoViaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    nombreVia: {
      allowNull: true,
      type: DataTypes.STRING,
      get() {
        const nombreVia = this.getDataValue('nombreVia');
        if (nombreVia === undefined || nombreVia === null) {
          return null;
        }
        return decodeURI(Buffer.from(nombreVia, 'base64').toString('ascii'));
      },
    },
    manzana: {
      allowNull: true,
      type: DataTypes.STRING,
      get() {
        const manzana = this.getDataValue('manzana');
        if (manzana === undefined || manzana === null) {
          return null;
        }
        return Buffer.from(manzana, 'base64').toString('ascii');
      },
    },
    lote: {
      allowNull: true,
      type: DataTypes.STRING,
      get() {
        const lote = this.getDataValue('lote');
        if (lote === undefined || lote === null) {
          return null;
        }
        return Buffer.from(lote, 'base64').toString('ascii');
      },
    },
    numExterior: {
      allowNull: true,
      type: DataTypes.STRING,
      get() {
        const numExterior = this.getDataValue('numExterior');
        if (numExterior === undefined || numExterior === null) {
          return null;
        }
        return Buffer.from(numExterior, 'base64').toString('ascii');
      },
    },
    numInterior: {
      allowNull: true,
      type: DataTypes.STRING,
      get() {
        const numInterior = this.getDataValue('numInterior');
        if (numInterior === undefined || numInterior === null) {
          return null;
        }
        return Buffer.from(numInterior, 'base64').toString('ascii');
      },
    },
    nombreUbicacion: {
      allowNull: true,
      type: DataTypes.STRING,
      get() {
        const nombreUbicacion = this.getDataValue('nombreUbicacion');
        if (nombreUbicacion === undefined || nombreUbicacion === null) {
          return null;
        }
        return decodeURI(Buffer.from(nombreUbicacion, 'base64').toString('ascii'));
      },
    },
    referencia: {
      allowNull: false,
      type: DataTypes.TEXT,
      get() {
        const referencia = this.getDataValue('referencia');
        if (referencia === undefined || referencia === null) {
          return null;
        }
        return decodeURI(Buffer.from(referencia, 'base64').toString('ascii'));
      },
    },
    resideDesde: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    gastosAlquiler: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    numUnidadFam: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    numCelular: {
      allowNull: false,
      type: DataTypes.STRING,
      get() {
        const numCelular = this.getDataValue('numCelular');
        if (numCelular === undefined || numCelular === null) {
          return null;
        }
        return Buffer.from(numCelular, 'base64').toString('ascii');
      },
    },
    correoElectronico: {
      allowNull: false,
      type: DataTypes.STRING,
      get() {
        const correoElectronico = this.getDataValue('correoElectronico');
        if (correoElectronico === undefined || correoElectronico === null) {
          return null;
        }
        return Buffer.from(correoElectronico, 'base64').toString('ascii');
      },
    },
    operadorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  ClienteVivienda.associate = function (models) {
    ClienteVivienda.belongsTo(models.Cliente, {
      as: 'Cliente',
      foreignKey: 'clienteId',
      targetKey: 'id',
    });
    ClienteVivienda.belongsTo(models.TipoVia, {
      as: 'TipoVia',
      foreignKey: 'tipoViaId',
      targetKey: 'id',
    });
    ClienteVivienda.belongsTo(models.TipoUbicacion, {
      as: 'TipoUbicacion',
      foreignKey: 'tipoUbicacionId',
      targetKey: 'id',
    });
    ClienteVivienda.belongsTo(models.RelacionVivienda, {
      as: 'RelacionVivienda',
      foreignKey: 'relacionViviendaId',
      targetKey: 'id',
    });
    ClienteVivienda.belongsTo(models.Pais, {
      as: 'Pais',
      foreignKey: 'paisId',
      targetKey: 'id',
    });
    ClienteVivienda.belongsTo(models.Departamento, {
      as: 'Departamento',
      foreignKey: 'departamentoId',
      targetKey: 'id',
    });
    ClienteVivienda.belongsTo(models.Provincia, {
      as: 'Provincia',
      foreignKey: 'provinciaId',
      targetKey: 'id',
    });
    ClienteVivienda.belongsTo(models.Distrito, {
      as: 'Distrito',
      foreignKey: 'distritoId',
      targetKey: 'id',
    });
    ClienteVivienda.belongsTo(models.Operador, {
      as: 'Operador',
      foreignKey: 'operadorId',
      targetKey: 'id',
    });
  };
  return ClienteVivienda;
};
