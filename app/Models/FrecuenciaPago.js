const Database = use('Database');
const FrecuenciaPago = Database.model('FrecuenciaPago');

FrecuenciaPago.listar = async function () {
  return FrecuenciaPago.findAll({ where: { estado: 1 } });
};

module.exports = FrecuenciaPago;
