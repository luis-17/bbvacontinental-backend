module.exports = (sequelize, DataTypes) => {
  const Solicitud = sequelize.define('Solicitud', {
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
    colaboradorId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    tipoCuotaId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    tipoCuentaId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    motivoId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    productoId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    subProductoId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    codigoSolicitante: {
      allowNull: true,
      type: DataTypes.VIRTUAL,
      get() {
        if (this.get('id')) {
          return `FVX${this.get('id').toString().padStart(10, 0)}`;
        }
        return undefined;
      },
    },
    fechaSolicitud: {
      allowNull: false,
      type: DataTypes.DATEONLY,
      defaultValue: new Date(),
    },
    tipoProducto: {
      allowNull: true,
      type: DataTypes.ENUM('N', 'S'), // nuevo o subrogado
    },
    tipoProductoStr: {
      allowNull: true,
      type: DataTypes.VIRTUAL, // nuevo o subrogado
      get() {
        if (this.get('tipoProducto') === 'N') {
          return 'NUEVO';
        }
        return 'SUBROGADO';
      },
    },
    montoPrestamo: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    montoPrestamoFinal: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    montoMaxBanco: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    plazoMontoMaxBanco: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    tieneCuentaAhorros: {
      allowNull: true,
      type: DataTypes.ENUM('S', 'N'), // SI, NO
    },
    tienePagoHaberes: {
      allowNull: true,
      type: DataTypes.ENUM('S', 'N'), // SI, NO
    },
    trasladaPagoHaberes: {
      allowNull: true,
      type: DataTypes.ENUM('S', 'N'), // SI, NO
    },
    campaniaConvenioId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    diaPago: {
      allowNull: true,
      type: DataTypes.TINYINT(2),
    },
    plazo: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    tasa: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    tasaFinal: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    cuota: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    ppm: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    periodoGracia: {
      allowNull: true,
      type: DataTypes.TINYINT(1),
    },
    vistaHTML: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    fechaEnvioLector: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    fechaReenvioLector: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    fechaOkLector: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    fechaSimulacionConfirmada: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    estadoLector: {
      allowNull: false,
      type: DataTypes.ENUM('B', 'D', 'F'),
      defaultValue: 'D',
    },
    errorLector: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    rechazoLector: {
      allowNull: true,
      type: DataTypes.TINYINT(1), // 1: rechazo activo null: rechazo inactivo
    },
    fechaExpiracion: {
      allowNull: true,
      type: DataTypes.DATEONLY,
    },
    estadoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // 1: REGISTRADO;
      // 2: EVALUADO;
      // 3: SIMULADO;
      // 4: SOLICITADO;
      // 5: APROBADO POR EMPRESA;
      // 6: OBSERVADO POR EMPRESA;
      // 7: FINALIZADO;
      // 8: CANCELADO;
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  Solicitud.associate = function (models) {
    Solicitud.belongsTo(models.Cliente, {
      as: 'Cliente',
      foreignKey: 'clienteId',
      targetKey: 'id',
    });
    Solicitud.belongsTo(models.Colaborador, {
      as: 'Colaborador',
      foreignKey: 'colaboradorId',
      targetKey: 'id',
    });
    Solicitud.belongsTo(models.TipoCuota, {
      as: 'TipoCuota',
      foreignKey: 'tipoCuotaId',
      targetKey: 'id',
    });
    Solicitud.belongsTo(models.TipoCuenta, {
      as: 'TipoCuenta',
      foreignKey: 'tipoCuentaId',
      targetKey: 'id',
    });
    Solicitud.belongsTo(models.Motivo, {
      as: 'Motivo',
      foreignKey: 'motivoId',
      targetKey: 'id',
    });
    Solicitud.belongsTo(models.Estado, {
      as: 'Estado',
      foreignKey: 'estadoId',
      targetKey: 'id',
    });
    Solicitud.belongsTo(models.Producto, {
      as: 'Producto',
      foreignKey: 'productoId',
      targetKey: 'id',
    });
    Solicitud.belongsTo(models.SubProducto, {
      as: 'SubProducto',
      foreignKey: 'subProductoId',
      targetKey: 'id',
    });
    Solicitud.belongsTo(models.CampaniaConvenio, {
      as: 'CampaniaConvenio',
      foreignKey: 'campaniaConvenioId',
      targetKey: 'id',
    });
    Solicitud.belongsToMany(models.MotivoRechazo, {
      as: 'MotivoRechazo',
      through: 'MotivoRechazoSolicitud',
      foreignKey: 'solicitudId',
    });
    Solicitud.belongsToMany(models.Estado, {
      as: 'EstadoSol',
      through: 'EstadoSolicitud',
      foreignKey: 'solicitudId',
    });
  };
  return Solicitud;
};
