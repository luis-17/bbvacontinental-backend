module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Colaborador', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuarioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      estadoCivilId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      empresaId: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      tipoDocumentoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      numeroDocumento: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sexo: {
        allowNull: false,
        type: Sequelize.ENUM('M', 'F'),
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
        allowNull: true,
        type: Sequelize.DATE,
      },
      fechaInicioLaboral: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      celular: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      correo: {
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
    await queryInterface.addConstraint('Colaborador', ['usuarioId'], {
      type: 'foreign key',
      name: 'FK_Colaborador_Usuario_0',
      references: {
        table: 'Usuario',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Colaborador', ['estadoCivilId'], {
      type: 'foreign key',
      name: 'FK_Colaborador_EstadoCivil_0',
      references: {
        table: 'EstadoCivil',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Colaborador', ['empresaId'], {
      type: 'foreign key',
      name: 'FK_Colaborador_Empresa_0',
      references: {
        table: 'Empresa',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('Colaborador', ['tipoDocumentoId'], {
      type: 'foreign key',
      name: 'FK_Colaborador_TipoDocumento_0',
      references: {
        table: 'TipoDocumento',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Colaborador');
  },
};
