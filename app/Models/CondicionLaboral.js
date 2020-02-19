const Database = use('Database');
const CondicionLaboral = Database.model('CondicionLaboral');

CondicionLaboral.listar = async function () {
  return CondicionLaboral.findAll();
};

module.exports = CondicionLaboral;
