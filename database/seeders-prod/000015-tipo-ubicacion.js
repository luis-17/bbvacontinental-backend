module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('TipoUbicacion', [
      {
        id: 1,
        nombre: 'NO APLICA',
        estado: 1,
      },
      {
        id: 2,
        nombre: 'AGRUPACION',
        estado: 1,
      },
      {
        id: 3,
        nombre: 'ASENTAMIENTO HUMANO',
        estado: 1,
      },
      {
        id: 4,
        nombre: 'CONJUNTO HABITACIONAL',
        estado: 1,
      },
      {
        id: 5,
        nombre: 'COMUNIDAD',
        estado: 1,
      },
      {
        id: 6,
        nombre: 'COOP VIVIENDA',
        estado: 1,
      },
      {
        id: 7,
        nombre: 'ETAPA',
        estado: 1,
      },
      {
        id: 8,
        nombre: 'PUEBLO JOVEN',
        estado: 1,
      },
      {
        id: 9,
        nombre: 'SECTOR',
        estado: 1,
      },
      {
        id: 10,
        nombre: 'URBANIZACION',
        estado: 1,
      },
      {
        id: 11,
        nombre: 'UNIDAD VECINAL',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('TipoUbicacion', null, {});
  },
};
