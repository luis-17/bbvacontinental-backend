module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Usuario', 'forceUserChangePassword', {
      allowNull: true,
      type: Sequelize.BOOLEAN,
    });
  },
  down(queryInterface) {
    return queryInterface.removeColumn('Usuario', 'forceUserChangePassword');
  },
};
