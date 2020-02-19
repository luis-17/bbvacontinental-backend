module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('TipoVia', [
      {
        id: 1,
        nombre: 'NO APLICA',
        estado: 1,
      },
      {
        id: 2,
        nombre: 'ALAMEDA',
        estado: 1,
      },
      {
        id: 3,
        nombre: 'AVENIDA',
        estado: 1,
      },
      {
        id: 4,
        nombre: 'CALLE',
        estado: 1,
      },
      {
        id: 5,
        nombre: 'CTRO. COMERCIAL',
        estado: 1,
      },
      {
        id: 6,
        nombre: 'CARRETERA',
        estado: 1,
      },
      {
        id: 7,
        nombre: 'GALERIA',
        estado: 1,
      },
      {
        id: 8,
        nombre: 'JIRON',
        estado: 1,
      },
      {
        id: 9,
        nombre: 'MALECON',
        estado: 1,
      },
      {
        id: 10,
        nombre: 'OVALO',
        estado: 1,
      },
      {
        id: 11,
        nombre: 'PASEO',
        estado: 1,
      },
      {
        id: 12,
        nombre: 'PLAZA',
        estado: 1,
      },
      {
        id: 13,
        nombre: 'PARQUE',
        estado: 1,
      },
      {
        id: 14,
        nombre: 'PROLONGACION',
        estado: 1,
      },
      {
        id: 15,
        nombre: 'PASAJE',
        estado: 1,
      },
      {
        id: 16,
        nombre: 'PUENTE',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('TipoVia', null, {});
  },
};
