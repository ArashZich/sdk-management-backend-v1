const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createManualPackage = {
  body: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
    planId: Joi.string().custom(objectId).required(),
    duration: Joi.number().min(1),
    sdkFeatures: Joi.object().keys({
      features: Joi.array().items(Joi.string()),
      patterns: Joi.object(),
      isPremium: Joi.boolean(),
      projectType: Joi.string(),
      mediaFeatures: Joi.object().keys({
        allowedSources: Joi.array().items(Joi.string()),
        allowedViews: Joi.array().items(Joi.string()),
        comparisonModes: Joi.array().items(Joi.string()),
      }),
    }),
  }),
};

const getPackage = {
  params: Joi.object().keys({
    packageId: Joi.string().custom(objectId),
  }),
};

const updateSdkFeatures = {
  params: Joi.object().keys({
    packageId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    features: Joi.array().items(Joi.string()),
    patterns: Joi.object(),
    isPremium: Joi.boolean(),
    projectType: Joi.string(),
    mediaFeatures: Joi.object().keys({
      allowedSources: Joi.array().items(Joi.string()),
      allowedViews: Joi.array().items(Joi.string()),
      comparisonModes: Joi.array().items(Joi.string()),
    }),
  }),
};

const extendPackage = {
  params: Joi.object().keys({
    packageId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    days: Joi.number().min(1).required(),
  }),
};

const suspendPackage = {
  params: Joi.object().keys({
    packageId: Joi.string().custom(objectId),
  }),
};

const reactivatePackage = {
  params: Joi.object().keys({
    packageId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createManualPackage,
  getPackage,
  updateSdkFeatures,
  extendPackage,
  suspendPackage,
  reactivatePackage,
};
