module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('EmpresaUsuario', [
      {
        // id: 1,
        empresaId: 1,
        usuarioId: 74,
        estado: 1,
      },
      {
        // id: 2,
        empresaId: 5,
        usuarioId: 74,
        estado: 1,
      },
      {
        // id: 3,
        empresaId: 6,
        usuarioId: 75,
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('EmpresaUsuario', null, {});
  },
};
