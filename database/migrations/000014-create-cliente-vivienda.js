module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ClienteVivienda', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      clienteId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      tipoUbicacionId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      relacionViviendaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      paisId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      departamentoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      provinciaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      distritoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      tipoViaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      nombreVia: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      manzana: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      lote: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      numExterior: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      numInterior: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      nombreUbicacion: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      referencia: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      resideDesde: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      gastosAlquiler: {
        allowNull: true,
        type: Sequelize.FLOAT,
      },
      numUnidadFam: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      numCelular: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      correoElectronico: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      operadorId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
    await queryInterface.addConstraint('ClienteVivienda', ['clienteId'], {
      type: 'foreign key',
      name: 'FK_ClienteVivienda_Cliente_0',
      references: {
        table: 'Cliente',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ClienteVivienda', ['tipoViaId'], {
      type: 'foreign key',
      name: 'FK_ClienteVivienda_TipoVia_0',
      references: {
        table: 'TipoVia',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ClienteVivienda', ['tipoUbicacionId'], {
      type: 'foreign key',
      name: 'FK_ClienteVivienda_TipoUbicacion_0',
      references: {
        table: 'TipoUbicacion',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ClienteVivienda', ['paisId'], {
      type: 'foreign key',
      name: 'FK_ClienteVivienda_Pais_0',
      references: {
        table: 'Pais',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ClienteVivienda', ['departamentoId'], {
      type: 'foreign key',
      name: 'FK_ClienteVivienda_Departamento_0',
      references: {
        table: 'Departamento',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ClienteVivienda', ['provinciaId'], {
      type: 'foreign key',
      name: 'FK_ClienteVivienda_Provincia_0',
      references: {
        table: 'Provincia',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ClienteVivienda', ['distritoId'], {
      type: 'foreign key',
      name: 'FK_ClienteVivienda_Distrito_0',
      references: {
        table: 'Distrito',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('ClienteVivienda', ['operadorId'], {
      type: 'foreign key',
      name: 'FK_ClienteVivienda_Operador_0',
      references: {
        table: 'Operador',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    return queryInterface.addConstraint('ClienteVivienda', ['relacionViviendaId'], {
      type: 'foreign key',
      name: 'FK_ClienteVivienda_RelacionVivienda_0',
      references: {
        table: 'RelacionVivienda',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }); /**/
  },
  down(queryInterface) {
    return queryInterface.dropTable('ClienteVivienda');
  },
};
