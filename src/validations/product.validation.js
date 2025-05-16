const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    type: Joi.string().required(),
    code: Joi.string().required(),
    thumbnail: Joi.string(),
    patterns: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        code: Joi.string().required(),
        imageUrl: Joi.string(),
      })
    ),
    colors: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        hexCode: Joi.string().required(),
        imageUrl: Joi.string(),
      })
    ),
    active: Joi.boolean(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      type: Joi.string(),
      code: Joi.string(),
      thumbnail: Joi.string(),
      patterns: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          code: Joi.string().required(),
          imageUrl: Joi.string(),
        })
      ),
      colors: Joi.array().items(
        Joi.object().keys({
          name: Joi.string().required(),
          hexCode: Joi.string().required(),
          imageUrl: Joi.string(),
        })
      ),
      active: Joi.boolean(),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
