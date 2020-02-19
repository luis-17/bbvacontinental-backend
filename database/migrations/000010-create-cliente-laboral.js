module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClienteLaboral', {
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
      empresaConvenioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      registroEmpresa: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      ocupacionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      inicioLaboral: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      ingresoFijo: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      ingresoVariable: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      cuotaPr: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      cuotaMaxima: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      tipoIngreso: {
        allowNull: false,
        type: Sequelize.ENUM('F', 'V'), // fijo / variable
      },
      frecuenciaPagoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      condicionLaboralId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
    await queryInterface.addConstraint('ClienteLaboral', ['clienteId'], {
      type: 'foreign key',
      name: 'FK_ClienteLaboral_Cliente_0',
      references: {
        table: 'Cliente',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ClienteLaboral', ['empresaConvenioId'], {
      type: 'foreign key',
      name: 'FK_ClienteLaboral_EmpresaConvenio_0',
      references: {
        table: 'EmpresaConvenio',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ClienteLaboral', ['frecuenciaPagoId'], {
      type: 'foreign key',
      name: 'FK_ClienteLaboral_FrecuenciaPago_0',
      references: {
        table: 'FrecuenciaPago',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ClienteLaboral', ['condicionLaboralId'], {
      type: 'foreign key',
      name: 'FK_ClienteLaboral_CondicionLaboral_0',
      references: {
        table: 'CondicionLaboral',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('ClienteLaboral', ['ocupacionId'], {
      type: 'foreign key',
      name: 'FK_ClienteLaboral_Ocupacion_0',
      references: {
        table: 'Ocupacion',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('ClienteLaboral');
  },
};
