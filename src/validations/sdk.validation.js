const Joi = require("joi");

const validateToken = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const applyMakeup = {
  body: Joi.object().keys({
    productUid: Joi.string(),
    makeupData: Joi.object().required(),
  }),
};

module.exports = {
  validateToken,
  applyMakeup,
};
