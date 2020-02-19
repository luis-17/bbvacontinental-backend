module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('EmpresaFuvex', [
      {
        id: 1,
        empresaId: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('EmpresaFuvex', null, {});
  },
};
