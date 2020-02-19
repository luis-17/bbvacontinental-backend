module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Permiso', [
      {
        id: 1,
        nombre: 'INICIO',
        descripcion: 'Pantalla de inicio.',
        url: '/inicio',
        estado: 1,
        parentPermisoId: null,
      },
      {
        id: 2,
        nombre: 'SEGURIDAD',
        descripcion: 'Opción donde se gestiona la seguridad.',
        url: null,
        estado: 1,
        parentPermisoId: null,
      },
      {
        id: 3,
        nombre: 'USUARIOS',
        descripcion: 'Opción donde se gestiona los usuarios',
        url: '/usuario',
        estado: 1,
        parentPermisoId: 2,
      },
      {
        id: 4,
        nombre: 'PERMISOS',
        descripcion: 'Opción donde se gestiona los permisos',
        url: '/permisos',
        estado: 1,
        parentPermisoId: 2,
      },
      {
        id: 5,
        nombre: 'PERFILES',
        descripcion: 'Opción donde se gestiona los perfiles',
        url: '/perfiles',
        estado: 1,
        parentPermisoId: 2,
      },
      {
        id: 6,
        nombre: 'FUVEX',
        descripcion: 'Opción donde se gestiona a las FUVEX',
        url: '/fuvex',
        estado: 1,
        parentPermisoId: 2,
      },
      {
        id: 7,
        nombre: 'SOLICITUDES',
        descripcion: 'Opción donde se gestiona las solicitudes',
        url: null,
        estado: 1,
        parentPermisoId: null,
      },
      {
        id: 8,
        nombre: 'NUEVA SOLICITUD',
        descripcion: 'Opción donde se genera una solicitud de préstamo',
        url: '/nueva-solicitud',
        estado: 1,
        parentPermisoId: 7,
      },
      {
        id: 9,
        nombre: 'HISTORICO',
        descripcion: 'Opción donde se consulta el histórico de solicitudes',
        url: '/historico',
        estado: 1,
        parentPermisoId: 7,
      },
      {
        id: 10,
        nombre: 'REPORTES',
        descripcion: 'Opción donde se descargan y eliminan los reportes',
        url: '/reportes',
        estado: 1,
        parentPermisoId: null,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Permiso', null, {});
  },
};
