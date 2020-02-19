module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('InstitucionFinanciera', [
      {
        nombreComercial: 'BANCO INTERAMERICANO',
        estado: 1,
      },
      {
        nombreComercial: 'CONV. BANCO SCOTIABANK',
        estado: 1,
      },
      {
        nombreComercial: 'CONV. BANCO GNB',
        estado: 1,
      },
      {
        nombreComercial: 'CAJA METROPOL- CONV',
        estado: 1,
      },
      {
        nombreComercial: 'A.C. FINANCIERA',
        estado: 1,
      },
      {
        nombreComercial: 'A.C. FINANTEL',
        estado: 1,
      },
      {
        nombreComercial: 'CREDI COOP',
        estado: 1,
      },
      {
        nombreComercial: 'CREDI COOP. ESPECIAL',
        estado: 1,
      },
      {
        nombreComercial: 'ATLANTIS',
        estado: 1,
      },
      {
        nombreComercial: 'PAMEF (NOTAS DE CARGO)',
        estado: 1,
      },
      {
        nombreComercial: 'PREST. VAC. AMORTIZ.',
        estado: 1,
      },
      {
        nombreComercial: 'PREST. VAC. INTERESES',
        estado: 1,
      },
      {
        nombreComercial: 'P VAC',
        estado: 1,
      },
      {
        nombreComercial: 'PVAC',
        estado: 1,
      },
      {
        nombreComercial: 'PREST. VAC. IGV',
        estado: 1,
      },
      {
        nombreComercial: 'PREST. SALUD AMORT.',
        estado: 1,
      },
      {
        nombreComercial: 'PREST. ESP. AMORTIZ. REGUL.',
        estado: 1,
      },

    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('InstitucionFinanciera', null, {});
  },
};
