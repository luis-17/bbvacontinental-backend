module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('SubProducto', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      codigoExterno: {
        allowNull: false,
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('SubProducto');
  },
};
