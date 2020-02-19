module.exports = {
  up(queryInterface) {
    return queryInterface.bulkInsert('DocumentoEmpresa', [
      // CONVENIO 1
      {
        documentoId: 1,
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'S',
        estado: 1,
      },
      {
        documentoId: 2,
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'S',
        estado: 1,
      },
      {
        documentoId: 3,
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'S',
        estado: 1,
      },
      {
        documentoId: 4,
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'N',
        estado: 1,
      },
      {
        documentoId: 5,
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'S',
        estado: 1,
      },
      {
        documentoId: 6,
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'S',
        estado: 1,
      },
      {
        documentoId: 7, // boletas
        empresaConvenioId: 1,
        seccion: 'N',
        obligatorio: 'N',
        estado: 1,
      },
      {
        documentoId: 8, // carta_dcto_planilla
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'S',
        estado: 1,
      },
      {
        documentoId: 9,
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'N',
        estado: 1,
      },
      {
        documentoId: 10,
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'N',
        estado: 1,
      },
      {
        documentoId: 18, // cronograma_cd
        empresaConvenioId: 1,
        seccion: 'N',
        obligatorio: 'N',
        estado: 1,
      },
      {
        documentoId: 19, // pagare
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'S',
        estado: 1,
      },
      {
        documentoId: 20, // aut aper cuenta
        empresaConvenioId: 1,
        seccion: 'A',
        obligatorio: 'N',
        estado: 1,
      },
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('DocumentoEmpresa', null, {});
  },
};
