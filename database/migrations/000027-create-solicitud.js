module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Solicitud', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clienteId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      colaboradorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      tipoCuotaId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      tipoCuentaId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      motivoId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      productoId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      subProductoId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      // codigoSolicitante: {
      //   allowNull: true,
      //   type: Sequelize.STRING,
      // },
      fechaSolicitud: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      tipoProducto: {
        allowNull: true,
        type: Sequelize.ENUM('N', 'S'), // nuevo o subrogado
      },
      montoPrestamo: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      montoPrestamoFinal: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      montoMaxBanco: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      plazoMontoMaxBanco: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      campaniaConvenioId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      tieneCuentaAhorros: {
        allowNull: true,
        type: Sequelize.ENUM('S', 'N'), // SI, NO
      },
      tienePagoHaberes: {
        allowNull: true,
        type: Sequelize.ENUM('S', 'N'), // SI, NO
      },
      trasladaPagoHaberes: {
        allowNull: true,
        type: Sequelize.ENUM('S', 'N'), // SI, NO
      },
      diaPago: {
        allowNull: true,
        type: Sequelize.TINYINT(2),
      },
      plazo: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      tasa: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      tasaFinal: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      cuota: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      ppm: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      periodoGracia: {
        allowNull: true,
        type: Sequelize.TINYINT(1),
      },
      vistaHTML: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      fechaEnvioLector: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      fechaReenvioLector: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      fechaOkLector: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      fechaSimulacionConfirmada: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      estadoLector: {
        allowNull: false,
        type: Sequelize.ENUM('B', 'D', 'F'),
        defaultValue: 'D',
      },
      errorLector: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      rechazoLector: {
        allowNull: true,
        type: Sequelize.TINYINT(1), // 1: rechazo activo null: rechazo inactivo
      },
      fechaExpiracion: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      estadoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        // 1: REGISTRADO;
        // 2: EVALUADO;
        // 3: SIMULADO;
        // 4: SOLICITADO;
        // 5: APROBADO POR EMPRESA;
        // 6: OBSERVADO POR EMPRESA;
        // 7: FINALIZADO;
        // 8: CANCELADO;
      },
      /* FECHA DE CREACION DE LA SOLICITUD */
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      version: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
    await queryInterface.addConstraint('Solicitud', ['clienteId'], {
      type: 'foreign key',
      name: 'FK_Solicitud_Cliente_0',
      references: {
        table: 'Cliente',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Solicitud', ['colaboradorId'], {
      type: 'foreign key',
      name: 'FK_Solicitud_Colaborador_0',
      references: {
        table: 'Colaborador',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Solicitud', ['tipoCuotaId'], {
      type: 'foreign key',
      name: 'FK_Solicitud_TipoCuota_0',
      references: {
        table: 'TipoCuota',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Solicitud', ['tipoCuentaId'], {
      type: 'foreign key',
      name: 'FK_Solicitud_TipoCuenta_0',
      references: {
        table: 'TipoCuenta',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Solicitud', ['motivoId'], {
      type: 'foreign key',
      name: 'FK_Solicitud_Motivo_0',
      references: {
        table: 'Motivo',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Solicitud', ['campaniaConvenioId'], {
      type: 'foreign key',
      name: 'FK_Solicitud_CampaniaConvenio_0',
      references: {
        table: 'CampaniaConvenio',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Solicitud', ['estadoId'], {
      type: 'foreign key',
      name: 'FK_Solicitud_Estado_0',
      references: {
        table: 'Estado',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Solicitud', ['productoId'], {
      type: 'foreign key',
      name: 'FK_Solicitud_Producto_0',
      references: {
        table: 'Producto',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('Solicitud', ['subProductoId'], {
      type: 'foreign key',
      name: 'FK_Solicitud_SubProducto_0',
      references: {
        table: 'SubProducto',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Solicitud');
  },
};
