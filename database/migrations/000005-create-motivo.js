module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Motivo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tipoMotivo: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: motivo de cambio; 2:motivo de rechazo
      },
      descripcion: {
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
    return queryInterface.dropTable('Motivo');
  },
};
