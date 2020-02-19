module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('RelacionVivienda', [
      {
        id: 1,
        nombre: 'PROPIEDAD LIBRE',
        estado: 1,
      },
      {
        id: 2,
        nombre: 'PROPIEDAD HIPOTECADA',
        estado: 1,
      },
      {
        id: 3,
        nombre: 'ALQUILER',
        estado: 1,
      },
      {
        id: 4,
        nombre: 'FAMILIA',
        estado: 1,
      },
      {
        id: 5,
        nombre: 'OTROS',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('RelacionVivienda', null, {});
  },
};
