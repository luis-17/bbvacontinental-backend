module.exports = (sequelize, DataTypes) => {
  const PerfilDocumentoEmpresa = sequelize.define('PerfilDocumentoEmpresa', {
    perfilId: DataTypes.INTEGER,
    documentoEmpresaId: DataTypes.INTEGER,
  }, {
    tableName: 'PerfilDocumentoEmpresa',
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  PerfilDocumentoEmpresa.associate = function (models) {
    // associations can be defined here
    PerfilDocumentoEmpresa.belongsTo(models.Perfil, {
      as: 'Perfil',
      foreignKey: 'perfilId',
      targetKey: 'id',
    });
    PerfilDocumentoEmpresa.belongsTo(models.DocumentoEmpresa, {
      as: 'DocumentoEmpresa',
      foreignKey: 'documentoEmpresaId',
      targetKey: 'id',
    });
  };
  return PerfilDocumentoEmpresa;
};
