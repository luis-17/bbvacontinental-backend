module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Permiso', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      parentPermisoId: {
        allowNull: true,
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
      url: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Permiso');
  },
};
