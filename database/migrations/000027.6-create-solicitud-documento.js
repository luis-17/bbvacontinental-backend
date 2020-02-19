module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SolicitudDocumento', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      solicitudId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      documentoEmpresaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      fechaSubida: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      bucket: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      etag: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      filename: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      filetype: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      key: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      location: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      label: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      ingresoNeto: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      /* para cronograma */
      institucionFinancieraId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      cuotaMensual: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      deudaSubro: {
        allowNull: true,
        type: Sequelize.DECIMAL(10, 2),
      },
      compraDeuda: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      motivoRechazo: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado
      },
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
    await queryInterface.addConstraint('SolicitudDocumento', ['institucionFinancieraId'], {
      type: 'foreign key',
      name: 'FK_SolicitudDocumento_InstitucionFinanciera_0',
      references: {
        table: 'InstitucionFinanciera',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('SolicitudDocumento', ['solicitudId'], {
      type: 'foreign key',
      name: 'FK_SolicitudDocumento_Solicitud_0',
      references: {
        table: 'Solicitud',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('SolicitudDocumento', ['documentoEmpresaId'], {
      type: 'foreign key',
      name: 'FK_SolicitudDocumento_DocumentoEmpresa_0',
      references: {
        table: 'DocumentoEmpresa',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('SolicitudDocumento');
  },
};
