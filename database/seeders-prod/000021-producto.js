module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Producto', [
      {
        codigoExterno: '96',
        nombre: 'PRÉSTAMOS PERSONALES',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Producto', null, {});
  },
};
