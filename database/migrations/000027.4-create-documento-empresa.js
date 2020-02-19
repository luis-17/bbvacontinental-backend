module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DocumentoEmpresa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      documentoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      empresaConvenioId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      seccion: {
        allowNull: false,
        type: Sequelize.ENUM('A', 'N'), // Adjunto / NoMostrar
      },
      obligatorio: {
        allowNull: false,
        type: Sequelize.ENUM('S', 'N'), // SI / NO
      },
      estado: {
        allowNull: false,
        type: Sequelize.TINYINT, // 1: habilitado; 0: deshabilitado
      },
    });
    await queryInterface.addConstraint('DocumentoEmpresa', ['empresaConvenioId'], {
      type: 'foreign key',
      name: 'FK_DocumentoEmpresa_EmpresaConvenio_0',
      references: {
        table: 'EmpresaConvenio',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('DocumentoEmpresa', ['documentoId'], {
      type: 'foreign key',
      name: 'FK_DocumentoEmpresa_Documento_0',
      references: {
        table: 'Documento',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('DocumentoEmpresa');
  },
};
