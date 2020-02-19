module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Perfil', [
      {
        // id: 1,
        nombre: 'FUVEX',
        descripcion: 'Usuario de la fuerza de ventas',
        estado: 1,
        prioridad: 4,
      },
      {
        // id: 2,
        nombre: 'ADMIN',
        descripcion: 'Acceso a todas las opciones',
        estado: 1,
        prioridad: 1,
      },
      {
        // id: 3,
        nombre: 'APROBADOR',
        descripcion: 'Acceso al módulo de aprobación de RRHH',
        estado: 1,
        prioridad: 3,
      },
      {
        // id: 4,
        nombre: 'ANALISTA',
        descripcion: 'Acceso al módulo de aprobación de ANALISTA',
        estado: 1,
        prioridad: 2,
      },
      {
        // id: 5,
        nombre: 'BBVA-REPORTE',
        descripcion: 'Acceso al módulo de reportes del BANCO',
        estado: 1,
        prioridad: 5,
      },
      {
        // id: 6,
        nombre: 'FORMALIZADOR',
        descripcion: 'Acceso al módulo de aprobación del FORMALIZADOR',
        estado: 1,
        prioridad: 6,
      },
      {
        // id: 7,
        nombre: 'FUVEXADMIN',
        descripcion: 'Admin de la fuerza de ventas',
        estado: 1,
        prioridad: 7,
      },
      {
        // id: 8,
        nombre: 'FUVEXSUPERVISOR',
        descripcion: 'Supervisor de la fuerza de ventas',
        estado: 1,
        prioridad: 8,
      },
      {
        // id: 9,
        nombre: 'ANALISTAADMIN',
        descripcion: 'Admin de analistas',
        estado: 1,
        prioridad: 9,
      },
      {
        // id: 10,
        nombre: 'ANALISTASUPERVISOR',
        descripcion: 'Supervisor de analistas',
        estado: 1,
        prioridad: 10,
      },
      {
        // id: 11,
        nombre: 'LECTOR',
        descripcion: 'Perfil del Lector',
        estado: 1,
        prioridad: 11,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Perfil', null, {});
  },
};
