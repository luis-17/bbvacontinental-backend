module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('FrecuenciaPago', {
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
      multiplo: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('FrecuenciaPago');
  },
};
