const Joi = require("joi");
const { objectId } = require("./custom.validation");

const markAsRead = {
  params: Joi.object().keys({
    notificationId: Joi.string().custom(objectId),
  }),
};

const sendNotification = {
  body: Joi.object()
    .keys({
      userId: Joi.string().custom(objectId),
      planId: Joi.string().custom(objectId),
      title: Joi.string().required(),
      message: Joi.string().required(),
      type: Joi.string()
        .required()
        .valid("expiry", "payment", "system", "other"),
      metadata: Joi.object(),
      sendSms: Joi.boolean().default(false),
    })
    .xor("userId", "planId") // یا به کاربر خاص یا به همه کاربران یک پلن ارسال شود
    .required(),
};

module.exports = {
  markAsRead,
  sendNotification,
};
