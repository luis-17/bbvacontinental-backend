const build = (length, plus) => Array.from({ length }, (_, index) => ({
  id: (index + plus),
  usuarioId: (index + plus),
}));

const fuvex = build(12, 1);
const rrhh = build(12, 13);
const analista = build(12, 25);
const bbva = build(12, 37);
const formalizador = build(12, 49);

const fuvexadmin = build(12, 61);
const fuvexsupervisor = build(12, 73);
const analistaadmin = build(12, 85);
const analistasupervisor = build(12, 97);

module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('UsuarioPerfil', [
      ...fuvex.map(row => ({
        ...row,
        perfilId: 1,
        estado: 1,
      })),
      ...rrhh.map(row => ({
        ...row,
        perfilId: 3,
        estado: 1,
      })),
      ...analista.map(row => ({
        ...row,
        perfilId: 4,
        estado: 1,
      })),
      ...bbva.map(row => ({
        ...row,
        perfilId: 5,
        estado: 1,
      })),
      ...formalizador.map(row => ({
        ...row,
        perfilId: 6,
        estado: 1,
      })),
      ...fuvexadmin.map(row => ({
        ...row,
        perfilId: 7,
        estado: 1,
      })),
      ...fuvexsupervisor.map(row => ({
        ...row,
        perfilId: 8,
        estado: 1,
      })),
      ...analistaadmin.map(row => ({
        ...row,
        perfilId: 9,
        estado: 1,
      })),
      ...analistasupervisor.map(row => ({
        ...row,
        perfilId: 10,
        estado: 1,
      })),
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('UsuarioPerfil', null, {});
  },
};
