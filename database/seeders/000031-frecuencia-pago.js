module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('FrecuenciaPago', [
      {
        nombre: 'MENSUAL',
        multiplo: 1,
        estado: 1,
      },
      {
        nombre: 'QUINCENAL',
        multiplo: 2,
        estado: 0,
      },
      {
        nombre: 'SEMANAL',
        multiplo: 4,
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('FrecuenciaPago', null, {});
  },
};
