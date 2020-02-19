module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Documento', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      alias: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      nombre: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      descripcion: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      labelHTML: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      descripcionHTML: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Documento');
  },
};
