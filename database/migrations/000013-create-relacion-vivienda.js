module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('RelacionVivienda', {
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
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('RelacionVivienda');
  },
};
