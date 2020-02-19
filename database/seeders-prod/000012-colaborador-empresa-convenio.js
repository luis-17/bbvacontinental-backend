const build = (length, plus) => Array.from({ length }, (_, index) => ({
  colaboradorId: (index + plus),
}));

const pool = build(26, 1);

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('ColaboradorEmpresaConvenio', [
      ...pool.map(row => ({
        ...row,
        empresaConvenioId: 1,
      })),
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('ColaboradorEmpresaConvenio', null, {});
  },
};
