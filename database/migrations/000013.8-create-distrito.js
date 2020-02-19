module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Distrito', {
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
      departamentoCod: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      provinciaCod: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Distrito');
  },
};
