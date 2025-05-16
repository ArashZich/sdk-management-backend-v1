const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createCoupon = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    description: Joi.string(),
    percent: Joi.number().required().min(1).max(100),
    maxAmount: Joi.number().required().min(0),
    maxUsage: Joi.number().required().min(1),
    startDate: Joi.date().required(),
    endDate: Joi.date().required().greater(Joi.ref("startDate")),
    forPlans: Joi.array().items(Joi.string().custom(objectId)),
    forUsers: Joi.array().items(Joi.string().custom(objectId)),
    active: Joi.boolean(),
  }),
};

const getCoupon = {
  params: Joi.object().keys({
    couponId: Joi.string().custom(objectId),
  }),
};

const updateCoupon = {
  params: Joi.object().keys({
    couponId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      code: Joi.string(),
      description: Joi.string(),
      percent: Joi.number().min(1).max(100),
      maxAmount: Joi.number().min(0),
      maxUsage: Joi.number().min(1),
      startDate: Joi.date(),
      endDate: Joi.date(),
      forPlans: Joi.array().items(Joi.string().custom(objectId)),
      forUsers: Joi.array().items(Joi.string().custom(objectId)),
      active: Joi.boolean(),
    })
    .min(1),
};

const deactivateCoupon = {
  params: Joi.object().keys({
    couponId: Joi.string().custom(objectId),
  }),
};

const validateCoupon = {
  body: Joi.object().keys({
    code: Joi.string().required(),
    planId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createCoupon,
  getCoupon,
  updateCoupon,
  deactivateCoupon,
  validateCoupon,
};
