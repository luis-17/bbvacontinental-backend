module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('SubProducto', [
      {
        codigoExterno: 'MS14',
        nombre: 'PRÉSTAMOS POR CONVENIO',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('SubProducto', null, {});
  },
};
