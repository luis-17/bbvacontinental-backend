module.exports = (sequelize, DataTypes) => {
  const Provincia = sequelize.define('Provincia', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    codigo: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    nombre: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    departamentoCod: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    timestamps: false,
    paranoid: false,
    version: false,
    freezeTableName: true,
  });
  return Provincia;
};
