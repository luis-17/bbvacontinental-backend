const { Joi, celebrate } = require('./Joi');

const updateFromLectorOk = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
    ingresoFijo: Joi.number().required(),
    ingresoVariable: Joi.number().required(),
    cuotaMaxima: Joi.number().required(),
    cuotaPr: Joi.number().required(),
  }),
});

const updateFromLectorRechazo = celebrate({
  body: Joi.object().keys({
    solicitudId: Joi.number().integer().required(),
    documentos: Joi.array().items(
      Joi.object().keys({
        solicitudDocumentoId: Joi.number().integer().required(),
        motivo: Joi.string().required(),
      }),
    ),
  }),
});
module.exports = {
  updateFromLectorOk,
  updateFromLectorRechazo,
};
