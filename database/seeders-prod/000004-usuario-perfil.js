// const build = (length, plus) => Array.from({ length }, (_, index) => ({
//   id: (index + plus),
//   usuarioId: (index + plus),
// }));

// const fuvex = build(12, 1);
// const rrhh = build(12, 13);
// const analista = build(12, 25);
// const bbva = build(12, 37);
// const formalizador = build(12, 49);

// const fuvexadmin = build(12, 61);
// const fuvexsupervisor = build(12, 73);
// const analistaadmin = build(12, 85);
// const analistasupervisor = build(12, 97);

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('UsuarioPerfil', [
      /* FUVEX */
      {
        id: 1,
        usuarioId: 1,
        perfilId: 1,
        estado: 1,
      },
      {
        id: 2,
        usuarioId: 2,
        perfilId: 1,
        estado: 1,
      },
      {
        id: 3,
        usuarioId: 3,
        perfilId: 1,
        estado: 1,
      },
      {
        id: 4,
        usuarioId: 4,
        perfilId: 1,
        estado: 1,
      },
      {
        id: 5,
        usuarioId: 5,
        perfilId: 1,
        estado: 1,
      },
      {
        id: 6,
        usuarioId: 6,
        perfilId: 1,
        estado: 1,
      },
      /* FUVEX-ADMIN */
      {
        id: 7,
        usuarioId: 7,
        perfilId: 7,
        estado: 1,
      },
      /* FUVEX-SUPERVISOR */
      {
        id: 8,
        usuarioId: 8,
        perfilId: 8,
        estado: 1,
      },
      /* BBVA-REPORTE */
      {
        id: 9,
        usuarioId: 9,
        perfilId: 5,
        estado: 1,
      },
      {
        id: 10,
        usuarioId: 10,
        perfilId: 5,
        estado: 1,
      },
      /* prueba */
      {
        id: 11,
        usuarioId: 11,
        perfilId: 1,
        estado: 1,
      },
      {
        id: 12,
        usuarioId: 12,
        perfilId: 1,
        estado: 1,
      },
      /* FORMALIZADOR */
      {
        id: 13,
        usuarioId: 13,
        perfilId: 6,
        estado: 1,
      },
      {
        id: 14,
        usuarioId: 14,
        perfilId: 6,
        estado: 1,
      },
      /* ANALISTA */
      {
        id: 15,
        usuarioId: 15,
        perfilId: 4,
        estado: 1,
      },
      {
        id: 16,
        usuarioId: 16,
        perfilId: 4,
        estado: 1,
      },
      {
        id: 17,
        usuarioId: 17,
        perfilId: 4,
        estado: 1,
      },
      {
        id: 18,
        usuarioId: 18,
        perfilId: 4,
        estado: 1,
      },
      {
        id: 19,
        usuarioId: 19,
        perfilId: 4,
        estado: 1,
      },
      {
        id: 20,
        usuarioId: 20,
        perfilId: 4,
        estado: 1,
      },
      {
        id: 21,
        usuarioId: 21,
        perfilId: 4,
        estado: 1,
      },
      {
        id: 22,
        usuarioId: 22,
        perfilId: 4,
        estado: 1,
      },
      /* SUPERVISOR ANALISTA */
      {
        id: 23,
        usuarioId: 23,
        perfilId: 10,
        estado: 1,
      },
      /* ADMIN ANALISTA */
      {
        id: 24,
        usuarioId: 24,
        perfilId: 9,
        estado: 1,
      },
      {
        id: 25,
        usuarioId: 25,
        perfilId: 9,
        estado: 1,
      },
      /* APROBADOR RRHH */
      {
        id: 26,
        usuarioId: 26,
        perfilId: 3,
        estado: 1,
      },
      /* LECTOR */
      {
        id: 27,
        usuarioId: 27,
        perfilId: 11,
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('UsuarioPerfil', null, {});
  },
};
