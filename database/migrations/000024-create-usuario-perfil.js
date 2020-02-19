module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UsuarioPerfil', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuarioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      perfilId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado;
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      version: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
    await queryInterface.addConstraint('UsuarioPerfil', ['usuarioId'], {
      type: 'foreign key',
      name: 'FK_UsuarioPerfil_Usuario_0',
      references: {
        table: 'Usuario',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('UsuarioPerfil', ['perfilId'], {
      type: 'foreign key',
      name: 'FK_UsuarioPerfil_Perfil_0',
      references: {
        table: 'Perfil',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('UsuarioPerfil');
  },
};
