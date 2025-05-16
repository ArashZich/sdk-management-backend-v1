const Joi = require("joi");
const { password, objectId, phoneFormat } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    phone: Joi.string().required().custom(phoneFormat),
    email: Joi.string().email(),
    company: Joi.string(),
    role: Joi.string().valid("user", "admin"),
    userType: Joi.string().valid("real", "legal"),
    nationalId: Joi.string(),
    allowedDomains: Joi.array().items(Joi.string()),
    notificationSettings: Joi.object().keys({
      email: Joi.boolean(),
      sms: Joi.boolean(),
    }),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      company: Joi.string(),
      userType: Joi.string().valid("real", "legal"),
      nationalId: Joi.string(),
      notificationSettings: Joi.object().keys({
        email: Joi.boolean(),
        sms: Joi.boolean(),
      }),
    })
    .min(1),
};

const updateDomains = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    domains: Joi.array().items(Joi.string()).required(),
  }),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateMe = {
  body: Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string().email(),
      company: Joi.string(),
      userType: Joi.string().valid("real", "legal"),
      nationalId: Joi.string(),
      notificationSettings: Joi.object().keys({
        email: Joi.boolean(),
        sms: Joi.boolean(),
      }),
    })
    .min(1),
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  updateDomains,
  deleteUser,
  updateMe,
};
