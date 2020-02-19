module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('EstadoSolicitud', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      estadoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      solicitudId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      colaboradorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.addConstraint('EstadoSolicitud', ['estadoId'], {
      type: 'foreign key',
      name: 'FK_EstadoSolicitud_Estado_0',
      references: {
        table: 'Estado',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('EstadoSolicitud', ['colaboradorId'], {
      type: 'foreign key',
      name: 'FK_EstadoSolicitud_Colaborador_0',
      references: {
        table: 'Colaborador',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('EstadoSolicitud', ['solicitudId'], {
      type: 'foreign key',
      name: 'FK_EstadoSolicitud_Solicitud_0',
      references: {
        table: 'Solicitud',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('EstadoSolicitud');
  },
};
