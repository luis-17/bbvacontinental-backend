module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Ocupacion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      codigo: {
        allowNull: false,
        type: Sequelize.STRING(4),
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado
        defaultValue: 1,
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Ocupacion');
  },
};
