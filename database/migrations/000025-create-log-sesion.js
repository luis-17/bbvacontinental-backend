module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LogSesion', {
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
      tokenGenerado: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      fechaInicioSesion: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      fechaFinSesion: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      direccionIp: {
        allowNull: false,
        type: Sequelize.STRING,
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
    return queryInterface.addConstraint('LogSesion', ['usuarioId'], {
      type: 'foreign key',
      name: 'FK_LogSesion_Usuario_0',
      references: {
        table: 'Usuario',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('LogSesion');
  },
};
