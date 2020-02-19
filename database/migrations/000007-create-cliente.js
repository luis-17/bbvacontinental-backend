module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cliente', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      estadoCivilId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      tipoDocumentoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      numDocumento: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      nombres: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      apellidoPaterno: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      apellidoMaterno: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      fechaNacimiento: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      fechaVencimientoDoi: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      sexo: {
        allowNull: false,
        type: Sequelize.ENUM('M', 'F'),
      },
      confDatosCorrectos: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: datos confirmados; 0: datos por confirmar;
        defaultValue: 0,
      },
      fechaConfirmacionDatos: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT,
        defaultValue: 1, // 1: habilitado; 0: deshabilitado
      },
      tipoDoiConyugue: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      numDoiConyugue: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      nombreConyugue: {
        allowNull: true,
        type: Sequelize.STRING,
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
    await queryInterface.addConstraint('Cliente', ['tipoDocumentoId'], {
      type: 'foreign key',
      name: 'FK_Cliente_TipoDocumento_0',
      references: {
        table: 'TipoDocumento',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Cliente', ['estadoCivilId'], {
      type: 'foreign key',
      name: 'FK_Cliente_EstadoCivil_0',
      references: {
        table: 'EstadoCivil',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('Cliente', ['tipoDoiConyugue'], {
      type: 'foreign key',
      name: 'FK_Cliente_TipoDocumentoConyugue_0',
      references: {
        table: 'TipoDocumento',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Cliente');
  },
};
