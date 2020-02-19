const { celebrate, Joi: BaseJoi } = require('celebrate');
const Extension = require('joi-date-extensions');

const Joi = BaseJoi.extend(Extension);

module.exports = { Joi, celebrate };
