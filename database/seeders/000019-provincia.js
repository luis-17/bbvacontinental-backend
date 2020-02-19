const provincia = require('../data/provincia.json');

const provMayus = provincia.map(v => ({
  codigo: v.codigo,
  nombre: v.nombre.toUpperCase(),
  departamentoCod: v.departamentoCod,
}));

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Provincia', provMayus);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Provincia', null, {});
  },
};
