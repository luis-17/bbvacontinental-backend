const Database = use('Database');
const InstitucionFinanciera = Database.model('InstitucionFinanciera');

InstitucionFinanciera.listar = async function () {
  return InstitucionFinanciera.findAll();
};

module.exports = InstitucionFinanciera;
