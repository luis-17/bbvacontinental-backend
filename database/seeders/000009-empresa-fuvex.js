module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('EmpresaFuvex', [
      {
        id: 1,
        empresaId: 1,
      },
      {
        id: 2,
        empresaId: 5, // sur
      },
      {
        id: 3,
        empresaId: 6, // norte
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('EmpresaFuvex', null, {});
  },
};
