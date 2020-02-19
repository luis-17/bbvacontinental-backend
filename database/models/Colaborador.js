module.exports = (sequelize, DataTypes) => {
  const Colaborador = sequelize.define('Colaborador', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    usuarioId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    estadoCivilId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    empresaId: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    tipoDocumentoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    numeroDocumento: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    sexo: {
      allowNull: false,
      type: DataTypes.ENUM('M', 'F'),
    },
    nombres: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    apellidoPaterno: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    apellidoMaterno: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    fechaNacimiento: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    fechaInicioLaboral: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    celular: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    correo: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    estado: {
      allowNull: false,
      type: DataTypes.TINYINT, // 1: habilitado; 0: deshabilitado
    },
    fullname: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.nombres} ${this.apellidoPaterno} ${this.apellidoMaterno}`;
      },
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  Colaborador.associate = function (models) {
    Colaborador.belongsTo(models.Usuario, {
      as: 'Usuario',
      foreignKey: 'usuarioId',
      targetKey: 'id',
    });
    Colaborador.belongsTo(models.EstadoCivil, {
      as: 'EstadoCivil',
      foreignKey: 'estadoCivilId',
      targetKey: 'id',
    });
    Colaborador.belongsTo(models.Empresa, {
      as: 'Empresa',
      foreignKey: 'empresaId',
      targetKey: 'id',
    });
    Colaborador.belongsTo(models.TipoDocumento, {
      as: 'TipoDocumento',
      foreignKey: 'tipoDocumentoId',
      targetKey: 'id',
    });
    Colaborador.hasOne(models.ColaboradorEmpresaConvenio, {
      as: 'ColaboradorEmpresaConvenio',
      foreignKey: 'colaboradorId',
      sourceKey: 'id',
    });
    Colaborador.belongsToMany(models.Estado, {
      as: 'EstadoCol',
      through: 'EstadoSolicitud',
      foreignKey: 'colaboradorId',
    });
  };
  return Colaborador;
};
