module.exports = (sequelize, DataTypes) => {
  const LogSesion = sequelize.define('LogSesion', {
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
    tokenGenerado: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    fechaInicioSesion: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    fechaFinSesion: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    direccionIp: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
    version: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    timestamps: true,
    paranoid: true,
    version: true,
    freezeTableName: true,
  });
  LogSesion.associate = function (models) {
    LogSesion.belongsTo(models.Usuario, {
      as: 'Usuario',
      foreignKey: 'usuarioId',
      targetKey: 'id',
    });
  };
  return LogSesion;
};
