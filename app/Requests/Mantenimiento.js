const { Joi, celebrate } = require('./Joi');

const listCompanyDocuments = celebrate({
  query: Joi.object().keys({
    clienteId: Joi.number().integer().required(),
  }),
});

const listCompanyCampaings = celebrate({
  query: Joi.object().keys({
    empresaConvenioId: Joi.number().integer().required(),
    tipoCampania: Joi.string().required().valid(['N', 'S']), // nuevo o subrogado
  }),
});
// const listFuvexForAdmin = celebrate({
//   query: Joi.object().keys({
//     empresaConvenioId: Joi.number().integer(),
//   }),
// });

module.exports = {
  listCompanyDocuments,
  listCompanyCampaings,
  // listFuvexForAdmin,
};
