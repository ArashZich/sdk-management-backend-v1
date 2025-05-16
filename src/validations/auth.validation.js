const Joi = require("joi");
const { phoneFormat } = require("./custom.validation");

const loginWithOtp = {
  body: Joi.object().keys({
    phone: Joi.string().required().custom(phoneFormat),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    phone: Joi.string().required().custom(phoneFormat),
    code: Joi.string().required().length(5),
  }),
};

const refreshToken = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const loginWithOAuth = {
  body: Joi.object().keys({
    oauthProvider: Joi.string().required(),
    oauthId: Joi.string().required(),
    token: Joi.string().required(),
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string().custom(phoneFormat),
  }),
};

module.exports = {
  loginWithOtp,
  verifyOtp,
  refreshToken,
  loginWithOAuth,
};
