const pool = [
  { tipoMotivoRechazo: 'ev', descripcion: 'Data de la solicitud incompleta' },
  { tipoMotivoRechazo: 'ev', descripcion: 'Datos en máscara' },
  { tipoMotivoRechazo: 'ev', descripcion: 'Datos inconsistentes en doc. y aplicativo' },
  { tipoMotivoRechazo: 'ev', descripcion: 'Documentación ilegible' },
  { tipoMotivoRechazo: 'ev', descripcion: 'Error en el aplicativo' },
  { tipoMotivoRechazo: 'ev', descripcion: 'Falta de documentación' },
  { tipoMotivoRechazo: 'ev', descripcion: 'Políticas de crédito' },
  { tipoMotivoRechazo: 'ev', descripcion: 'Vigencia de la información' },
  { tipoMotivoRechazo: 'rh', descripcion: 'Descuento judicial por alimentos' },
  { tipoMotivoRechazo: 'fv', descripcion: 'No tiene oferta' },
  { tipoMotivoRechazo: 'fv', descripcion: 'Evaluación por contratación sencilla' },
];

const poolPd = [
  { tipoMotivoRechazo: 'pd', descripcion: 'OTROS' },
  { tipoMotivoRechazo: 'pd', descripcion: 'RANGO DE EDAD' },
  { tipoMotivoRechazo: 'pd', descripcion: 'LISTA NEGRA' },
  { tipoMotivoRechazo: 'pd', descripcion: 'CALCULO DE ENDEUDAMIENTO' },
  { tipoMotivoRechazo: 'pd', descripcion: 'SOLICITUD EN CURSO' },
  { tipoMotivoRechazo: 'pd', descripcion: 'LIBERACION POR TIEMPO' },
];

module.exports = {
  up(queryInterface) {
    const now = new Date();
    return queryInterface.bulkInsert('MotivoRechazo', [
      ...pool.map(row => ({
        ...row,
        empresaConvenioId: 1,
        estado: 1,
        createdAt: now,
        updatedAt: now,
      })),
      ...poolPd.map(row => ({
        ...row,
        empresaConvenioId: 1,
        estado: 1,
        createdAt: now,
        updatedAt: now,
      })),
      ...pool.map(row => ({
        ...row,
        empresaConvenioId: 2,
        estado: 1,
        createdAt: now,
        updatedAt: now,
      })),
      ...poolPd.map(row => ({
        ...row,
        empresaConvenioId: 2,
        estado: 1,
        createdAt: now,
        updatedAt: now,
      })),
    ]);
  },
  down(queryInterface) {
    return queryInterface.bulkDelete('MotivoRechazo', null, {});
  },
};
