module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Estado', [
      {
        id: 1,
        nombre: 'REGISTRADO',
        descripcion: '',
      },
      {
        id: 2,
        nombre: 'EVALUADO',
        descripcion: '',
      },
      {
        id: 3,
        nombre: 'SIMULADO',
        descripcion: '',
      },
      {
        id: 4,
        nombre: 'SOLICITADO',
        descripcion: '',
      },
      {
        id: 5,
        nombre: 'APROBADO - RRHH',
        descripcion: '',
      },
      {
        id: 6,
        nombre: 'OBSERVADO - RRHH',
        descripcion: '',
      },
      {
        id: 7,
        nombre: 'FINALIZADO',
        descripcion: '',
      },
      {
        id: 8,
        nombre: 'OBSERVADO - ANALISTA',
        descripcion: '',
      },
      {
        id: 9,
        nombre: 'CANCELADO',
        descripcion: '',
      },
      {
        id: 10,
        nombre: 'APROBADO - ANALISTA',
        descripcion: '',
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Estado', null, {});
  },
};
