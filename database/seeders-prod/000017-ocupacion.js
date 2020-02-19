const ocupacion = require('../data/ocupacion.json');

const ocupMayus = ocupacion.map(v => ({
  codigo: v.codigo,
  nombre: v.descripcion.toUpperCase(),
}));

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Ocupacion', ocupMayus);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Ocupacion', null, {});
  },
};
