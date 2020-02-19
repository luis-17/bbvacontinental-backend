const { Joi, celebrate } = require('./Joi');

const listReasonsRejection = celebrate({
  query: {
    empresaConvenioId: Joi.number().required(),
    tipoMotivoRechazo: Joi.string().allow('fv', 'rh', 'ev').required(), // fv: Fuerza de ventas - rh: RRHH
  },
});

module.exports = {
  listReasonsRejection,
};
