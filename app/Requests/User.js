const { Joi, celebrate } = require('./Joi');

const login = celebrate({
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    rememberme: Joi.boolean().optional(),
    recaptcha: Joi.string().required(),
  }),
});

const lostpass = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    recaptcha: Joi.string().required(),
  }),
});

const resetpass = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    code: Joi.string().required(),
    recaptcha: Joi.string().required(),
  }),
});

module.exports = {
  login,
  lostpass,
  resetpass,
};
