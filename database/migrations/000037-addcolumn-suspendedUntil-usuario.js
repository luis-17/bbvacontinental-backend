module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Usuario', 'suspendedUntil', {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },
  down(queryInterface) {
    return queryInterface.removeColumn('Usuario', 'suspendedUntil');
  },
};
