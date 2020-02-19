const Database = use('Database');
const Empresa = Database.model('Empresa');
const EmpresaFuvex = Database.model('EmpresaFuvex');

EmpresaFuvex.listarEmpresasFuvex = async function () {
  return EmpresaFuvex.findAll({
    attributes: ['id'],
    include: [{
      attributes: ['id', 'nombreComercial', 'nombreLegal'],
      model: Empresa,
      as: 'Empresa',
    }],
  });
};

module.exports = EmpresaFuvex;
