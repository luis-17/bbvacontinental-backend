const argon2 = require('argon2');

module.exports = {
  async up(queryInterface) {
    const hash1 = await argon2.hash('123456');
    const hashLector = await argon2.hash('$lector$');
    return queryInterface.bulkInsert('Usuario', [
      {
        id: 1,
        perfilId: 1,
        username: 'YAQUELINE.CAIRO',
        password: hash1,
        estado: 1,
      },
      {
        id: 2,
        perfilId: 1,
        username: 'ERIKA.ALZAMORA',
        password: hash1,
        estado: 1,
      },
      {
        id: 3,
        perfilId: 1,
        username: 'MARILYN.NUÑEZ',
        password: hash1,
        estado: 1,
      },
      {
        id: 4,
        perfilId: 1,
        username: 'MONICA.ESPINO',
        password: hash1,
        estado: 1,
      },
      {
        id: 5,
        perfilId: 1,
        username: 'CARLOS.GONZALES',
        password: hash1,
        estado: 1,
      },
      {
        id: 6,
        perfilId: 1,
        username: 'JOSE.VASQUEZ',
        password: hash1,
        estado: 1,
      },
      {
        id: 7,
        perfilId: 7, // fuvexadmin
        username: 'JOSE.VELASQUEZ',
        password: hash1,
        estado: 1,
      },
      {
        id: 8,
        perfilId: 8, // fuvexsupervisor
        username: 'LUIS.SHEPHERD',
        password: hash1,
        estado: 1,
      },
      {
        id: 9,
        perfilId: 5, // bbva-reporte
        username: 'ANA.MEJIA',
        password: hash1,
        estado: 1,
      },
      {
        id: 10,
        perfilId: 5, // bbva-reporte
        username: 'GADBEN.BARRETO',
        password: hash1,
        estado: 1,
      },
      /* PRUEBA */
      {
        id: 11,
        perfilId: 1,
        username: 'FUVEX1',
        password: hash1,
        estado: 1,
      },
      {
        id: 12,
        perfilId: 1,
        username: 'FUVEX2',
        password: hash1,
        estado: 1,
      },
      {
        id: 13,
        perfilId: 6, // formalizador - everis
        username: 'LESLIE.LOYOLA',
        password: hash1,
        estado: 1,
      },
      {
        id: 14,
        perfilId: 6, // formalizador - everis
        username: 'FIORELLA.GORRITTI',
        password: hash1,
        estado: 1,
      },
      {
        id: 15,
        perfilId: 4, // analista - everis
        username: 'CHRISTIAN.CUEVA',
        password: hash1,
        estado: 1,
      },
      {
        id: 16,
        perfilId: 4, // analista - everis
        username: 'SHEYLA.REMIGIO',
        password: hash1,
        estado: 1,
      },
      {
        id: 17,
        perfilId: 4, // analista - everis
        username: 'MARIA.MALCA',
        password: hash1,
        estado: 1,
      },
      {
        id: 18,
        perfilId: 4, // analista - everis
        username: 'JORGE.VARILLAS',
        password: hash1,
        estado: 1,
      },
      {
        id: 19,
        perfilId: 4, // analista - everis
        username: 'SANDIVEL.SANCHEZ',
        password: hash1,
        estado: 1,
      },
      {
        id: 20,
        perfilId: 4, // analista - everis
        username: 'JENNIFER.ORBEGOSO',
        password: hash1,
        estado: 1,
      },
      {
        id: 21,
        perfilId: 4, // analista - everis
        username: 'RICHARD.ESPINOZA',
        password: hash1,
        estado: 1,
      },
      {
        id: 22,
        perfilId: 4, // analista - everis
        username: 'ERICK.GONZALES',
        password: hash1,
        estado: 1,
      },
      {
        id: 23,
        perfilId: 10, // supervisor analista - everis
        username: 'PABLO.HURTADO',
        password: hash1,
        estado: 1,
      },
      {
        id: 24,
        perfilId: 9, // admin analista - everis
        username: 'DIEGO.OTERO',
        password: hash1,
        estado: 1,
      },
      {
        id: 25,
        perfilId: 9, // admin analista - everis
        username: 'LUZ.QUISPE',
        password: hash1,
        estado: 1,
      },
      {
        id: 26,
        perfilId: 3, // rrhh aprobador
        username: 'MARIA.PAREDES',
        password: hash1,
        estado: 1,
      },
      {
        id: 27,
        perfilId: 11, // lector
        username: 'LECTOR',
        password: hashLector,
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Usuario', null, {});
  },
};
