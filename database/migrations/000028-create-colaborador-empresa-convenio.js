module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ColaboradorEmpresaConvenio', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      empresaConvenioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      colaboradorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
    await queryInterface.addConstraint('ColaboradorEmpresaConvenio', ['empresaConvenioId'], {
      type: 'foreign key',
      name: 'FK_ColaboradorEmpresaConvenio_EmpresaConvenio_0',
      references: {
        table: 'EmpresaConvenio',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('ColaboradorEmpresaConvenio', ['colaboradorId'], {
      type: 'foreign key',
      name: 'FK_ColaboradorEmpresaConvenio_Colaborador_0',
      references: {
        table: 'Colaborador',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('ColaboradorEmpresaConvenio');
  },
};
