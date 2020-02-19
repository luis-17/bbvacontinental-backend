module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Perfil', {
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
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado
      },
      prioridad: {
        allowNull: false,
        type: Sequelize.INTEGER, // 1 es mas importante que 2, 2 mas importante que 3, asi sucesivamente
        unique: true,
      }
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Perfil');
  },
};
