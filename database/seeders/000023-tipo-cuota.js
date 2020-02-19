module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('TipoCuota', [
      {
        id: 1,
        nombre: 'SIMPLE',
        estado: 1,
      },
      {
        id: 2,
        nombre: 'ADICIONALES',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('TipoCuota', null, {});
  },
};
