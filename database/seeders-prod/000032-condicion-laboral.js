module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('CondicionLaboral', [
      { nombre: 'NOMBRADOS', estado: 1 },
      { nombre: 'INDETERMINADO', estado: 1 },
      { nombre: 'PERMANENTE', estado: 1 },
      { nombre: 'PLAZO FIJO', estado: 1 },
      { nombre: 'CONTRATO POR FUNCIONAMIENTO', estado: 1 },
      { nombre: 'CAS', estado: 1 },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('CondicionLaboral', null, {});
  },
};
