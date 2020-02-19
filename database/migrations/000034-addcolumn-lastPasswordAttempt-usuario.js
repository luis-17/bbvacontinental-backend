module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Usuario', 'lastPasswordAttempt', {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },
  down(queryInterface) {
    return queryInterface.removeColumn('Usuario', 'lastPasswordAttempt');
  },
};
