module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('TipoDocumento', [
      {
        id: 1,
        descripcion: 'DNI',
        estado: 1,
      },
      {
        id: 2,
        descripcion: 'PASAPORTE',
        estado: 1,
      },
      {
        id: 3,
        descripcion: 'CARNET DE EXTRANJERÍA',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('TipoDocumento', null, {});
  },
};
