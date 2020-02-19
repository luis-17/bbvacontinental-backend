const Database = use('Database');
const Documento = Database.model('Documento');

Documento.findByAlias = function (alias) {
  return Documento.findOne({
    where: { alias },
  });
};

module.exports = Documento;
