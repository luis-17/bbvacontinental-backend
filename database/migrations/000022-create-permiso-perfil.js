module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PermisoPerfil', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      permisoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      perfilId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
    await queryInterface.addConstraint('PermisoPerfil', ['permisoId'], {
      type: 'foreign key',
      name: 'FK_PermisoPerfil_Permiso_0',
      references: {
        table: 'Permiso',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('PermisoPerfil', ['perfilId'], {
      type: 'foreign key',
      name: 'FK_PermisoPerfil_Perfil_0',
      references: {
        table: 'Perfil',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('PermisoPerfil');
  },
};
