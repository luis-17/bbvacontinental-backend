const { Joi, celebrate } = require('./Joi');

const registerCustomer = celebrate({
  body: Joi.object().keys({
    clienteId: Joi.number().integer().allow(null),
    tipoDocumentoId: Joi.number().valid(1).integer().required(),
    numDocumento: Joi.string().regex(/^\d*/).required(),
    estadoCivilId: Joi.number().valid([1, 2, 3, 4, 5, 6, 7]).integer().required(),
    fechaVencimientoDoi: Joi.date().format('YYYY-MM-DD').required(),
    tipoDoiConyugue: Joi.number().valid(1).integer().allow(null),
    numDoiConyugue: Joi.string().regex(/^\d*/).allow(null),
    vistaHTML: Joi.string().required(),
  }),
});

const goBackCustomer = celebrate({
  query: Joi.object().keys({
    clienteId: Joi.number().integer().required(), // clienteId regresarClienteVivienda
  }),
});

const registerCustomerAparment = celebrate({
  body: Joi.object().keys({
    clienteId: Joi.number().integer().required(),
    tipoUbicacionId: Joi.number().integer().required(),
    relacionViviendaId: Joi.number().integer().required(), // si es alquiler
    operadorId: Joi.number().integer().required(),
    paisId: Joi.number().integer().required(),
    departamentoId: Joi.number().integer().required(),
    provinciaId: Joi.number().integer().required(),
    distritoId: Joi.number().integer().required(),
    tipoViaId: Joi.number().integer(),
    nombreVia: Joi.when('tipoViaId', {
      is: 1, // 'No Aplica'
      then: Joi.string().valid(null),
      otherwise: Joi.string().regex(/^[0-9A-ZÁÉÍÑÓÚÜ\s]*$/i).max(255).required(),
    }),
    manzana: Joi.string().alphanum().max(10).allow(null),
    lote: Joi.string().alphanum().max(2).allow(null),
    numExterior: Joi.string().alphanum().max(4).allow(null),
    numInterior: Joi.string().alphanum().max(4).allow(null),
    nombreUbicacion: Joi.when('tipoUbicacionId', {
      is: 1, // 'No Aplica'
      then: Joi.string().valid(null),
      otherwise: Joi.string().regex(/^[0-9A-ZÁÉÍÑÓÚÜ\s]*$/i).max(255).required(),
    }),
    referencia: Joi.string().regex(/^[0-9A-ZÁÉÍÑÓÚÜ\s]*$/i).max(255).required(),
    resideDesde: Joi.date().format('YYYY-MM-DD').required(),
    gastosAlquiler: Joi.when('relacionViviendaId', {
      is: 3, // 'Alquiler'
      then: Joi.number().precision(2).required(),
      otherwise: Joi.number().valid(null),
    }),
    numUnidadFam: Joi.string().regex(/^\d*/).max(2).required(),
    numCelular: Joi.string().regex(/^\d*/).length(9).required(),
    correoElectronico: Joi.string().email().max(255).required(),
    vistaHTML: Joi.string().required(),
  }),
});

const goBackCustomerAparment = celebrate({
  query: Joi.object().keys({
    clienteId: Joi.number().integer().required(), // clienteId
  }),
});

const registerCustomerWorking = celebrate({
  body: Joi.object().keys({
    clienteId: Joi.number().integer().required(),
    empresaConvenioId: Joi.number().integer().required(),
    frecuenciaPagoId: Joi.number().integer().required(),
    condicionLaboralId: Joi.number().integer().required(),
    inicioLaboral: Joi.date().format('YYYY-MM-DD').required(),
    ocupacionId: Joi.number().integer().required(),
    tipoIngreso: Joi.string().valid('F', 'V').required(),
    registroEmpresa: Joi.string().alphanum().max(255).allow(null),
    vistaHTML: Joi.string().required(),
  }),
});

const goBackCustomerWorking = celebrate({
  query: Joi.object().keys({
    clienteId: Joi.number().integer().required(),
  }),
});

const viewCustomerSummary = celebrate({
  query: Joi.object().keys({
    clienteId: Joi.number().integer().required(),
  }),
});

const confirmDataCustomer = celebrate({
  body: Joi.object().keys({
    clienteId: Joi.number().integer().required(),
    confDatosCorrectos: Joi.number().integer().max(1).valid(1).required(),
    vistaHTML: Joi.string().required(),
  }),
});

module.exports = {
  registerCustomer,
  goBackCustomer,
  registerCustomerAparment,
  goBackCustomerAparment,
  registerCustomerWorking,
  goBackCustomerWorking,
  viewCustomerSummary,
  confirmDataCustomer,
};
