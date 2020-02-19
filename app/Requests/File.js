const { Joi, celebrate } = require('./Joi');

const signedUrl = celebrate({
  query: {
    name: Joi.string().required(),
    type: Joi.string().required(),
  },
});

module.exports = {
  signedUrl,
};
