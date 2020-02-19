const argon2 = require('argon2');

const build = (name, length, plus) => Array.from({ length }, (_, index) => ({
  id: (index + plus),
  username: `${name}${index + 1}`,
}));

const fuvex = build('fuvex', 12, 1);
const rrhh = build('rrhh', 12, 13);
const analista = build('analista', 12, 25);
const bbva = build('bbva', 12, 37);
const formalizador = build('formalizador', 12, 49);

const fuvexadmin = build('fuvexadmin', 12, 61);
const fuvexsupervisor = build('fuvexsupervisor', 12, 73);
const analistaadmin = build('analistaadmin', 12, 85);
const analistasupervisor = build('analistasupervisor', 12, 97);

module.exports = {
  async up(queryInterface) {
    const hash1 = await argon2.hash('123456');
    return queryInterface.bulkInsert('Usuario', [
      ...fuvex.map(row => ({
        ...row,
        password: hash1,
        perfilId: 1,
        estado: 1,
      })),
      ...rrhh.map(row => ({
        ...row,
        password: hash1,
        perfilId: 3,
        estado: 1,
      })),
      ...analista.map(row => ({
        ...row,
        password: hash1,
        perfilId: 4,
        estado: 1,
      })),
      ...bbva.map(row => ({
        ...row,
        password: hash1,
        perfilId: 5,
        estado: 1,
      })),
      ...formalizador.map(row => ({
        ...row,
        password: hash1,
        perfilId: 6,
        estado: 1,
      })),
      ...fuvexadmin.map(row => ({
        ...row,
        password: hash1,
        perfilId: 7,
        estado: 1,
      })),
      ...fuvexsupervisor.map(row => ({
        ...row,
        password: hash1,
        perfilId: 8,
        estado: 1,
      })),
      ...analistaadmin.map(row => ({
        ...row,
        password: hash1,
        perfilId: 9,
        estado: 1,
      })),
      ...analistasupervisor.map(row => ({
        ...row,
        password: hash1,
        perfilId: 10,
        estado: 1,
      })),
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Usuario', null, {});
  },
};
