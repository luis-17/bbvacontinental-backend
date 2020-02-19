module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('EmpresaConvenio', [
      {
        id: 1,
        empresaId: 2,
        cantMesesVariable: 3,
        montoMinimoPrestamo: 1000,
        montoMaximoPrestamo: 100000,
        logicaEstadoRRHH: 'CA',
      },
      {
        id: 2,
        empresaId: 3,
        cantMesesVariable: 3,
        montoMinimoPrestamo: 1000,
        montoMaximoPrestamo: 100000,
        logicaEstadoRRHH: 'OB',
      },
      {
        id: 3,
        empresaId: 4,
        cantMesesVariable: 3,
        montoMinimoPrestamo: 1000,
        montoMaximoPrestamo: 100000,
        logicaEstadoRRHH: 'OB',
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('EmpresaConvenio', null, {});
  },
};
