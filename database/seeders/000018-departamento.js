const departamentos = require('../data/departamento.json');

const dptoMayus = departamentos.map(v => ({
  codigo: v.codigo,
  nombre: v.nombre.toUpperCase(),
}));

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Departamento', dptoMayus);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Departamento', null, {});
  },
};
