module.exports = (sequelize, DataTypes) => {
  const EmpresaUsuario = sequelize.define('EmpresaUsuario', {
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
    empresaId: {
      allowNull: false,
      type: DataTypes.INTEGER,
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
  EmpresaUsuario.associate = function (models) {
    EmpresaUsuario.belongsTo(models.Empresa, {
      as: 'Empresa',
      foreignKey: 'empresaId',
      targetKey: 'id',
    });
    EmpresaUsuario.belongsTo(models.Usuario, {
      as: 'Usuario',
      foreignKey: 'usuarioId',
      targetKey: 'id',
    });
  };
  return EmpresaUsuario;
};
