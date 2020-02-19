module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Usuario', 'lastConnection', {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },
  down(queryInterface) {
    return queryInterface.removeColumn('Usuario', 'lastConnection');
  },
};
