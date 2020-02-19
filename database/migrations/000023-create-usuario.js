module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuario', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      perfilId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      fechaUltInicioSesion: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      fechaUltCierreSesion: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      ultDireccionIp: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      ultToken: {
        allowNull: true,
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      resetPassToken: {
        allowNull: true,
        type: Sequelize.TEXT,
        defaultValue: null,
      },
      resetPassExpires: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado, 2: bloqueado login fallido
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
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
    return queryInterface.addConstraint('Usuario', ['perfilId'], {
      type: 'foreign key',
      name: 'FK_Usuario_Perfil_0',
      references: {
        table: 'Perfil',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Usuario');
  },
};
