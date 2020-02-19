module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Operador', [
      {
        nombre: 'CLARO',
        estado: 1,
      },
      {
        nombre: 'ENTEL',
        estado: 1,
      },
      {
        nombre: 'BITEL',
        estado: 1,
      },
      {
        nombre: 'MOVISTAR',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Operador', null, {});
  },
};
