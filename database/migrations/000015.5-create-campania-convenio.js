module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CampaniaConvenio', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      codigo: {
        allowNull: false,
        type: Sequelize.STRING(5),
      },
      empresaConvenioId: {
        allowNull: false,
        type: Sequelize.INTEGER(11),
      },
      descripcionCorta: {
        allowNull: false,
        type: Sequelize.STRING(200),
      },
      descripcionLarga: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      tipoCampania: {
        allowNull: false,
        type: Sequelize.STRING(1),
      },
      tasa: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      fechaFinVigencia: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      diaPago: {
        allowNull: false,
        type: Sequelize.INTEGER(2),
      },
      diaCorte: {
        allowNull: false,
        type: Sequelize.INTEGER(2),
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
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
    await queryInterface.addConstraint('CampaniaConvenio', ['empresaConvenioId'], {
      type: 'foreign key',
      name: 'FK_CampaniaConvenio_EmpresaConvenio_0',
      references: {
        table: 'EmpresaConvenio',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('CampaniaConvenio');
  },
};
