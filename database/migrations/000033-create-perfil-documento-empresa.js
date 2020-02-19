module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PerfilDocumentoEmpresa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      perfilId: {
        type: Sequelize.INTEGER,
      },
      documentoEmpresaId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint('PerfilDocumentoEmpresa', ['perfilId'], {
      type: 'foreign key',
      name: 'FK_PerfilDocumentoEmpresa_Perfil_0',
      references: {
        table: 'Perfil',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('PerfilDocumentoEmpresa', ['documentoEmpresaId'], {
      type: 'foreign key',
      name: 'FK_PerfilDocumentoEmpresa_DocumentoEmpresa_0',
      references: {
        table: 'DocumentoEmpresa',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down: queryInterface => queryInterface.dropTable('PerfilDocumentoEmpresa'),
};
