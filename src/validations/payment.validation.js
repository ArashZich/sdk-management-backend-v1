const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createPayment = {
  body: Joi.object().keys({
    planId: Joi.string().custom(objectId).required(),
    couponCode: Joi.string(),
  }),
};

const getPayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

const cancelPayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPayment,
  getPayment,
  cancelPayment,
};
