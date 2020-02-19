module.exports = (sequelize, DataTypes) => {
  const Estado = sequelize.define('Estado', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    nombre: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    descripcion: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
    tableName: 'Estado',
  });
  Estado.associate = function (models) {
    Estado.belongsToMany(models.Solicitud, {
      as: 'Solicitud',
      through: 'EstadoSolicitud',
      foreignKey: 'estadoId',
    });
    Estado.belongsToMany(models.Colaborador, {
      as: 'ColaboradorCol',
      through: 'EstadoSolicitud',
      foreignKey: 'colaboradorId',
    });
  };
  return Estado;
};
