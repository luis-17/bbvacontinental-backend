const { Joi, celebrate } = require('./Joi');

const listRequestHr = celebrate({
  query: Joi.object().keys({
    empresaConvenioId: Joi.string().required(),
    cliente: Joi.string(),
    numDocumento: Joi.number().integer(),
    estadoId: Joi.string().required(),
    codigoSolicitante: Joi.string(),
    fechaInicio: Joi.date().format('YYYY-MM-DD'),
    fechaFin: Joi.date().format('YYYY-MM-DD'),
    usuarioId: Joi.string().optional(),
  }),
});

const listRequestHrExcel = celebrate({
  query: Joi.object().keys({
    empresaConvenioId: Joi.string().required(),
    cliente: Joi.string(),
    numDocumento: Joi.number().integer(),
    estadoId: Joi.string().required(),
    codigoSolicitante: Joi.string(),
    fechaInicio: Joi.date().format('YYYY-MM-DD'),
    fechaFin: Joi.date().format('YYYY-MM-DD'),
    code: Joi.string(),
  }),
});

const approveRequest = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
  }),
});

const rejectRequest = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
    tipoMotivoRechazo: Joi.string().allow('fv', 'rh', 'ev').required(), // fv: Fuerza de ventas - rh: RRHH
    reasonsReject: Joi.array().items(Joi.object({
      id: Joi.number().required(),
      descripcion: Joi.string().max(255).required(),
      descripcionOther: Joi.when('descripcion', {
        is: 'OTROS',
        then: Joi.string().max(255).required(),
        otherwise: Joi.string().regex(/^[0-9A-ZÁÉÍÑÓÚÜ\s]*$/i).max(255).allow('', null),
      }),
    }).required()),
  }),
});

module.exports = {
  listRequestHr,
  listRequestHrExcel,
  approveRequest,
  rejectRequest,
};
