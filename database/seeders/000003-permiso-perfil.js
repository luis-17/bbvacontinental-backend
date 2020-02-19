module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('PermisoPerfil', [
      {
        id: 1,
        permisoId: 1,
        perfilId: 1,
      }, {
        id: 2,
        permisoId: 7,
        perfilId: 1,
      }, {
        id: 3,
        permisoId: 8,
        perfilId: 1,
      }, {
        id: 4,
        permisoId: 9,
        perfilId: 1,
      }, {
        id: 5,
        permisoId: 1,
        perfilId: 2,
      }, {
        id: 6,
        permisoId: 2,
        perfilId: 2,
      }, {
        id: 7,
        permisoId: 3,
        perfilId: 2,
      }, {
        id: 8,
        permisoId: 4,
        perfilId: 2,
      }, {
        id: 9,
        permisoId: 5,
        perfilId: 2,
      }, {
        id: 10,
        permisoId: 6,
        perfilId: 2,
      }, {
        id: 11,
        permisoId: 7,
        perfilId: 2,
      }, {
        id: 12,
        permisoId: 8,
        perfilId: 2,
      }, {
        id: 13,
        permisoId: 9,
        perfilId: 2,
      }, {
        id: 14,
        permisoId: 10,
        perfilId: 5,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('PermisoPerfil', null, {});
  },
};
