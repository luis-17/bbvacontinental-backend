module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Empresa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      actividadEconomicaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      nombreComercial: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      nombreLegal: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      representanteLegal: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      ruc: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      telefono: {
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
    return queryInterface.addConstraint('Empresa', ['actividadEconomicaId'], {
      type: 'foreign key',
      name: 'FK_Empresa_ActividadEconomica_0',
      references: {
        table: 'ActividadEconomica',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Empresa');
  },
};
