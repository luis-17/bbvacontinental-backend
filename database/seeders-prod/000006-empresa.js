module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Empresa', [
      {
        id: 1,
        actividadEconomicaId: 1,
        nombreComercial: 'CONEXION COMERCIAL SERVICIOS E INVERSIONES',
        nombreLegal: 'CONEXION COMERCIAL SERVICIOS E INVERSIONES S.A.C.',
        representanteLegal: 'XXX',
        ruc: '20601439299',
        telefono: 'XXX',
        estado: 1,
      },
      {
        id: 2,
        actividadEconomicaId: 1,
        nombreComercial: 'SEDAPAL',
        nombreLegal: 'SEDAPAL S.A.C',
        representanteLegal: 'XXX',
        ruc: '20100152356',
        telefono: 'XXX',
        estado: 1,
      },
      {
        id: 3,
        actividadEconomicaId: 1,
        nombreComercial: 'ESSALUD',
        nombreLegal: 'ESSALUD S.A.C',
        representanteLegal: 'XXX',
        ruc: '20477820610',
        telefono: 'XXX',
        estado: 1,
      },
      {
        id: 4,
        actividadEconomicaId: 1,
        nombreComercial: 'LA MARINA',
        nombreLegal: 'LA MARINA S.A.C',
        representanteLegal: 'XXX',
        ruc: '20145874564',
        telefono: 'XXX',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Empresa', null, {});
  },
};
