module.exports = (sequelize, DataTypes) => {
  const DocumentoEmpresa = sequelize.define('DocumentoEmpresa', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    documentoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    empresaConvenioId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    seccion: {
      allowNull: false,
      type: DataTypes.ENUM('A', 'N'), // Adjunto / NoMostrar
    },
    obligatorio: {
      allowNull: false,
      type: DataTypes.ENUM('S', 'N'), // SI / NO
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  DocumentoEmpresa.associate = function (models) {
    DocumentoEmpresa.belongsTo(models.Documento, {
      as: 'Documento',
      foreignKey: 'documentoId',
      targetKey: 'id',
    });
    DocumentoEmpresa.belongsTo(models.EmpresaConvenio, {
      as: 'EmpresaConvenio',
      foreignKey: 'empresaConvenioId',
      targetKey: 'id',
    });
  };
  return DocumentoEmpresa;
};
