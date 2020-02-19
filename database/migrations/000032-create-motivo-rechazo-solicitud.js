module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MotivoRechazoSolicitud', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      solicitudId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      motivoRechazoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      descripcion: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
    await queryInterface.addConstraint('MotivoRechazoSolicitud', ['solicitudId'], {
      type: 'foreign key',
      name: 'FK_MotivoRechazoSolicitud_Solicitud_0',
      references: {
        table: 'Solicitud',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('MotivoRechazoSolicitud', ['motivoRechazoId'], {
      type: 'foreign key',
      name: 'FK_MotivoRechazoSolicitud_MotivoRechazo_0',
      references: {
        table: 'MotivoRechazo',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('MotivoRechazoSolicitud');
  },
};
