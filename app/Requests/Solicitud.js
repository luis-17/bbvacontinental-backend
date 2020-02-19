const { Joi, celebrate } = require('./Joi');

const registerEvaluation = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
    empresaConvenioId: Joi.number().integer().required(),
    codigoSolicitante: Joi.string().required(),
    productoId: Joi.number().integer().required().valid(1),
    tipoProducto: Joi.string().required().valid(['N', 'S']),
    subProductoId: Joi.number().integer().required().valid(1),
    montoPrestamo: Joi.when('tipoProducto', {
      is: 'N', // 'Alquiler'
      then: Joi.number().integer().min(1000).max(100000).required(),
      otherwise: Joi.number().valid(null).optional(),
    }),
    campaniaConvenioId: Joi.number().integer().required(),
    plazo: Joi.number().min(6).max(72).positive().required(),
    tasa: Joi.number().precision(6).positive().required(),
    tipoCuotaId: Joi.number().integer().valid(1, 2).required(),
    diaPago: Joi.number().integer().max(99).required(),
    vistaHTML: Joi.string().required(),
    documentos: Joi.array().items(
      Joi.object().keys({
        id: Joi.number().integer(), // solo para edicion
        alias: Joi.string().required(),
        filename: Joi.string().required(),
        filetype: Joi.string().required(),
        label: Joi.string().required(),
        etag: Joi.string().required(),
        location: Joi.string().required(),
        key: Joi.string().required(),
        bucket: Joi.string().required(),
        motivoRechazo: Joi.string().allow(null).optional(),
      }),
    ),
    flagNext: Joi.string().required().valid(['S', 'N']),
  }),
});

const goBackEvaluation = celebrate({
  query: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});

const unlockEvaluationLector = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});

const registerSurrogate = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
    vistaHTML: Joi.string().required(),
    documentos: Joi.array().items(
      Joi.object().keys({
        id: Joi.number().integer().allow(null), // solo para edicion
        alias: Joi.string().required(),
        filename: Joi.string().required(),
        filetype: Joi.string().required(),
        label: Joi.string().required(),
        etag: Joi.string().required(),
        location: Joi.string().required(),
        key: Joi.string().required(),
        bucket: Joi.string().required(),
        institucionFinancieraId: Joi.number().integer().required(),
        cuotaMensual: Joi.number().precision(2).required(),
        deudaSubro: Joi.number().precision(2).required(),
        compraDeuda: Joi.boolean(),
      }),
    ).required(),
  }),
});
const goBackSurrogate = celebrate({
  query: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});
const resumen = celebrate({
  query: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});
const sendCronograma = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});
const viewCurrentEvaluationResult = celebrate({
  query: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});

const viewEvaluationResult = celebrate({
  query: Joi.object().keys({
    monto: Joi.number().integer().required(),
    plazo: Joi.number().required(),
    tasa: Joi.number().required(),
    sueldo: Joi.number().precision(2),
    solicitudId: Joi.number().integer(),
  }).without('sueldo', 'solicitudId'),
});

const confirmDefaultEvaluation = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
    vistaHTML: Joi.string().required(),
  }),
});

const confirmDataEvaluation = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
    tipoCuotaId: Joi.number().integer(),
    montoPrestamoFinal: Joi.number().integer().required(),
    plazo: Joi.number().required(),
    tasa: Joi.number().required(),
    cuota: Joi.number().precision(2).required(),
    diaPago: Joi.number().integer().required(),
    vistaHTML: Joi.string().required(),
  }),
});

const goBackBankAccount = celebrate({
  query: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});

const addBankAccount = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
    tipoCuentaId: Joi.number().integer(),
    tieneCuentaAhorros: Joi.string().required().valid(['S', 'N']),
    tienePagoHaberes: Joi.string().allow(null).optional().valid(['S', 'N']),
    trasladaPagoHaberes: Joi.string().allow(null).optional().valid(['S', 'N']),
    vistaHTML: Joi.string().required(),
  }),
});

const goBackPhysicalDocuments = celebrate({
  query: Joi.object().keys({
    clienteId: Joi.number().integer().required(),
    solicitudId: Joi.number().integer().required(),
  }),
});

const addPhysicalDocuments = celebrate({
  body: Joi.object().keys({
    clienteId: Joi.number().integer().required(),
    solicitudId: Joi.number().integer().required(),
    documentos: Joi.array().items(
      Joi.object().keys({
        documentoEmpresaId: Joi.number().integer().required(),
        filename: Joi.string().required(),
        filetype: Joi.string().required(),
        label: Joi.string().required(),
        etag: Joi.string().required(),
        location: Joi.string().required(),
        key: Joi.string().required(),
        bucket: Joi.string().required(),
      }),
    ).required(),
    vistaHTML: Joi.string().allow('', null).required(),
  }),
});

const viewEvaluationSummary = celebrate({
  query: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});

const approveCreditRequest = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});

const queryPPM = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});

const netoSolicitudDocumento = celebrate({
  body: Joi.object().keys({
    solicitudDocumentoId: Joi.number().integer().required(),
    ingresoNeto: Joi.number().required(),
  }),
});

const reportRequestGenerate = celebrate({
  query: Joi.object().keys({
    desde: Joi.string().allow(null).optional(),
    hasta: Joi.string().allow(null).optional(),
  }),
});

module.exports = {
  registerEvaluation,
  goBackEvaluation,
  goBackSurrogate,
  resumen,
  sendCronograma,
  viewCurrentEvaluationResult,
  viewEvaluationResult,
  confirmDefaultEvaluation,
  confirmDataEvaluation,
  goBackBankAccount,
  addBankAccount,
  goBackPhysicalDocuments,
  addPhysicalDocuments,
  viewEvaluationSummary,
  approveCreditRequest,
  queryPPM,
  netoSolicitudDocumento,
  reportRequestGenerate,
  registerSurrogate,
  unlockEvaluationLector,
};
