module.exports = (sequelize, DataTypes) => {
  const SolicitudDocumento = sequelize.define('SolicitudDocumento', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    solicitudId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    documentoEmpresaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    fechaSubida: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    bucket: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    etag: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    filename: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    filetype: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    key: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    location: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    label: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    ingresoNeto: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    /* para cronograma */
    institucionFinancieraId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    cuotaMensual: {
      allowNull: true,
      type: DataTypes.FLOAT,
    },
    deudaSubro: {
      allowNull: true,
      type: DataTypes.DECIMAL(10, 2),
    },
    compraDeuda: {
      allowNull: true,
      type: DataTypes.BOOLEAN,
    },
    motivoRechazo: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  SolicitudDocumento.associate = function (models) {
    SolicitudDocumento.belongsTo(models.InstitucionFinanciera, {
      as: 'InstitucionFinanciera',
      foreignKey: 'institucionFinancieraId',
      targetKey: 'id',
    });
    SolicitudDocumento.belongsTo(models.Solicitud, {
      as: 'Solicitud',
      foreignKey: 'solicitudId',
      targetKey: 'id',
    });
    SolicitudDocumento.belongsTo(models.DocumentoEmpresa, {
      as: 'DocumentoEmpresa',
      foreignKey: 'documentoEmpresaId',
      targetKey: 'id',
    });
  };
  return SolicitudDocumento;
};
