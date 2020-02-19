const distrito = require('../data/distrito.json');

const distMayus = distrito.map(v => ({
  codigo: v.codigo,
  nombre: v.nombre.toUpperCase(),
  provinciaCod: v.provinciaCod,
  departamentoCod: v.departamentoCod,
}));

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Distrito', distMayus);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Distrito', null, {});
  },
};
