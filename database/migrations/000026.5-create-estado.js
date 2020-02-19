module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Estado', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      descripcion: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Estado');
  },
};
