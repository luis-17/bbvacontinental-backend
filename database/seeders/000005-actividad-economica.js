module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('ActividadEconomica', [
      {
        id: 1,
        nombre: 'CIIU 41000 - CAPTACION , DEPURACION Y DIST. DE AGUA',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('ActividadEconomica', null, {});
  },
};
