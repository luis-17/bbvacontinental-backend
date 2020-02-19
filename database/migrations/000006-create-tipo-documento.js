module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('TipoDocumento', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      descripcion: {
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
    return queryInterface.dropTable('TipoDocumento');
  },
};
