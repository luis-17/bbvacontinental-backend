const Database = use('Database');
const TipoCuenta = Database.model('TipoCuenta');

TipoCuenta.listar = async function () {
  return TipoCuenta.findAll({
    where: {
      estado: 1,
    },
  });
};

module.exports = TipoCuenta;
