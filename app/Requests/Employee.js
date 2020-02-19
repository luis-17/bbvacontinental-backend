const { Joi, celebrate } = require('./Joi');

const registerEmployeeAnalista = celebrate({
  body: Joi.object().keys({
    apellidoMaterno: Joi.string().required(),
    apellidoPaterno: Joi.string().required(),
    celular: Joi.string().required(),
    correo: Joi.string().required(),
    // empresaId: Joi.number().integer().required(),
    perfilId: Joi.number().integer().required(),
    nombres: Joi.string().required(),
    numeroDocumento: Joi.string().required(),
    sexo: Joi.string().required(),
    tipoDocumentoId: Joi.number().integer().required(),
  }),
});
const registerEmployee = celebrate({
  body: Joi.object().keys({
    apellidoMaterno: Joi.string().required(),
    apellidoPaterno: Joi.string().required(),
    celular: Joi.string().required(),
    correo: Joi.string().required(),
    empresaId: Joi.number().integer().required(),
    nombres: Joi.string().required(),
    numeroDocumento: Joi.string().required(),
    sexo: Joi.string().required(),
    tipoDocumentoId: Joi.number().integer().required(),
  }),
});
const listEmployees = celebrate({
  query: Joi.object().keys({
    numeroDocumento: Joi.string(),
    colaborador: Joi.string(),
  }),
});

module.exports = {
  registerEmployee,
  listEmployees,
  registerEmployeeAnalista,
};
