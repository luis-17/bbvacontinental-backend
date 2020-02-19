module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MotivoRechazo', {
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
      tipoMotivoRechazo: {
        allowNull: false,
        type: Sequelize.ENUM('fv', 'rh', 'ev', 'pd'), // fuvex, rrhhh, por defecto
      },
      descripcion: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
    return queryInterface.addConstraint('MotivoRechazo', ['empresaConvenioId'], {
      type: 'foreign key',
      name: 'FK_MotivoRechazo_EmpresaConvenio_0',
      references: {
        table: 'EmpresaConvenio',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('MotivoRechazo');
  }
};
