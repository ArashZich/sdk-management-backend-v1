const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createPlan = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required().min(0),
    duration: Joi.number().required().min(1),
    features: Joi.array().items(Joi.string()),
    allowedProducts: Joi.array().items(Joi.string().custom(objectId)),
    requestLimit: Joi.object()
      .keys({
        monthly: Joi.number().required().min(1),
        total: Joi.number(),
      })
      .required(),
    defaultSdkFeatures: Joi.object().keys({
      features: Joi.array().items(Joi.string()),
      patterns: Joi.object(),
      mediaFeatures: Joi.object().keys({
        allowedSources: Joi.array().items(Joi.string()),
        allowedViews: Joi.array().items(Joi.string()),
        comparisonModes: Joi.array().items(Joi.string()),
      }),
    }),
    active: Joi.boolean(),
    specialOffer: Joi.boolean(),
  }),
};

const getPlan = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
};

const updatePlan = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().min(0),
      duration: Joi.number().min(1),
      features: Joi.array().items(Joi.string()),
      allowedProducts: Joi.array().items(Joi.string().custom(objectId)),
      requestLimit: Joi.object().keys({
        monthly: Joi.number().min(1),
        total: Joi.number(),
      }),
      defaultSdkFeatures: Joi.object().keys({
        features: Joi.array().items(Joi.string()),
        patterns: Joi.object(),
        mediaFeatures: Joi.object().keys({
          allowedSources: Joi.array().items(Joi.string()),
          allowedViews: Joi.array().items(Joi.string()),
          comparisonModes: Joi.array().items(Joi.string()),
        }),
      }),
      active: Joi.boolean(),
      specialOffer: Joi.boolean(),
    })
    .min(1),
};

const deletePlan = {
  params: Joi.object().keys({
    planId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPlan,
  getPlan,
  updatePlan,
  deletePlan,
};
