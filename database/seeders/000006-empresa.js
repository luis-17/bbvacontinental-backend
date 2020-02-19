module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('Empresa', [
      {
        id: 1,
        actividadEconomicaId: 1,
        nombreComercial: 'FUVEX DEL PERÚ',
        nombreLegal: 'FUVEX DEL PERÚ S.A.C',
        representanteLegal: 'Doroteo Galarga',
        ruc: '20458754610',
        telefono: '998457201',
        estado: 1,
      },
      {
        id: 2,
        actividadEconomicaId: 1,
        nombreComercial: 'SEDAPAL',
        nombreLegal: 'SEDAPAL S.A.C',
        representanteLegal: 'Fernando Ñopo',
        ruc: '20100152356',
        telefono: '998457201',
        estado: 1,
      },
      {
        id: 3,
        actividadEconomicaId: 1,
        nombreComercial: 'ESSALUD',
        nombreLegal: 'ESSALUD S.A.C',
        representanteLegal: 'Justiniano Bellido',
        ruc: '20477820610',
        telefono: '997458620',
        estado: 1,
      },
      {
        id: 4,
        actividadEconomicaId: 1,
        nombreComercial: 'LA MARINA',
        nombreLegal: 'LA MARINA S.A.C',
        representanteLegal: 'Fernando Cilloniz',
        ruc: '20145874564',
        telefono: '995742103',
        estado: 1,
      },
      {
        id: 5,
        actividadEconomicaId: 1,
        nombreComercial: 'FUVEX DEL SUR',
        nombreLegal: 'FUVEX DEL SUR S.A.C',
        representanteLegal: 'Doroteo Galarga',
        ruc: '20458754610',
        telefono: '998457201',
        estado: 1,
      },
      {
        id: 6,
        actividadEconomicaId: 1,
        nombreComercial: 'FUVEX DEL NORTE',
        nombreLegal: 'FUVEX DEL NORTE S.A.C',
        representanteLegal: 'Doroteo Galarga',
        ruc: '20458754610',
        telefono: '998457201',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('Empresa', null, {});
  },
};
