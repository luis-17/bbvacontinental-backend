module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Departamento', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      codigo: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Departamento');
  },
};
