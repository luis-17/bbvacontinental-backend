module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HistoriaSimulador', {
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
      keyHistoria: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      montoPrestamo: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      diaPago: {
        allowNull: false,
        type: Sequelize.TINYINT(2),
      },
      plazo: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      tasa: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      cuota: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      ppm: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      periodoGracia: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
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
    return queryInterface.addConstraint('HistoriaSimulador', ['solicitudId'], {
      type: 'foreign key',
      name: 'FK_HistoriaSimulador_Solicitud_0',
      references: {
        table: 'Solicitud',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('HistoriaSimulador');
  },
};
