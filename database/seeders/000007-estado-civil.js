module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('EstadoCivil', [
      {
        id: 1,
        nombre: 'SOLTERO',
        estado: 1,
      },
      {
        id: 2,
        nombre: 'CASADO',
        estado: 1,
      },
      {
        id: 3,
        nombre: 'VIUDO',
        estado: 1,
      },
      {
        id: 4,
        nombre: 'DIVORCIADO',
        estado: 1,
      },
      {
        id: 5,
        nombre: 'SEPARADO JUDICIAL',
        estado: 1,
      },
      {
        id: 6,
        nombre: 'SEPARADO DE HECHO',
        estado: 1,
      },
      {
        id: 7,
        nombre: 'CONVIVIENTE',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('EstadoCivil', null, {});
  },
};
