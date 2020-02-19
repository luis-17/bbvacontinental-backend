module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Usuario', 'passwordAttemptCount', {
      allowNull: true,
      type: Sequelize.TINYINT,
    });
  },
  down(queryInterface) {
    return queryInterface.removeColumn('Usuario', 'passwordAttemptCount');
  },
};
