module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmpresaConvenio', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      empresaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      cantMesesVariable: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      montoMinimoPrestamo: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      montoMaximoPrestamo: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      logicaEstadoRRHH: {
        allowNull: false,
        type: Sequelize.ENUM('OB', 'CA'), // OBSERVADO // CANCELADO
      },
    });
    return queryInterface.addConstraint('EmpresaConvenio', ['empresaId'], {
      type: 'foreign key',
      name: 'FK_EmpresaConvenio_Empresa_0',
      references: {
        table: 'Empresa',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('EmpresaConvenio');
  },
};
