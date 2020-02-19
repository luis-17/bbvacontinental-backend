module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('TipoCuenta', [
      {
        nombre: 'CUENTA INDEPENDENCIA',
        key: 'cta_indep',
        estado: 0,
      },
      {
        nombre: 'CUENTA SUELDO',
        key: 'cta_sueldo',
        estado: 0,
      },
      {
        nombre: 'CUENTA FACIL',
        key: 'cta_facil',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('TipoCuenta', null, {});
  },
};
