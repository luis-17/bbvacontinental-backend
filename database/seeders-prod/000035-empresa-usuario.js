module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('EmpresaUsuario', [
      {
        id: 1,
        empresaId: 1,
        usuarioId: 8, // fuvexsupervisor
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('EmpresaUsuario', null, {});
  },
};
