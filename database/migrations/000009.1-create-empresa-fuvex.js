module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EmpresaFuvex', {
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
    });
    return queryInterface.addConstraint('EmpresaFuvex', ['empresaId'], {
      type: 'foreign key',
      name: 'FK_EmpresaFuvex_Empresa_0',
      references: {
        table: 'Empresa',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('EmpresaFuvex');
  },
};
