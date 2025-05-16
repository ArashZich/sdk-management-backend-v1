const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config");
const { User } = require("../models");

/**
 * تولید توکن JWT
 * @param {string} userId - شناسه کاربر
 * @param {Date} expires - تاریخ انقضا
 * @param {string} type - نوع توکن (access یا refresh)
 * @param {string} secret - کلید رمزگذاری
 * @returns {string} - توکن JWT
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * تولید توکن‌های دسترسی و بازیابی
 * @param {Object} user - اطلاعات کاربر
 * @returns {Object} - توکن‌های دسترسی و بازیابی
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationDays,
    "days"
  );
  const accessToken = generateToken(user._id, accessTokenExpires, "access");

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  const refreshToken = generateToken(user._id, refreshTokenExpires, "refresh");

  // ذخیره refresh token در دیتابیس
  await User.findByIdAndUpdate(user._id, { refreshToken });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * تولید توکن SDK
 * @param {string} userId - شناسه کاربر
 * @param {Object} plan - اطلاعات پلن
 * @param {Date} startDate - تاریخ شروع
 * @param {Date} endDate - تاریخ پایان
 * @param {Object} customFeatures - ویژگی‌های سفارشی SDK
 * @returns {string} - توکن SDK
 */
const generateSDKToken = (
  userId,
  plan,
  startDate,
  endDate,
  customFeatures = null
) => {
  // تنظیم ویژگی‌های پیش‌فرض SDK
  const defaultFeatures = {
    features: [
      "lips",
      "eyeshadow",
      "eyepencil",
      "eyelashes",
      "blush",
      "concealer",
      "foundation",
      "brows",
      "eyeliner",
    ],
    patterns: {
      lips: ["normal", "matte", "glossy", "glitter"],
      eyeshadow: ["normal"],
      eyepencil: ["normal"],
      eyeliner: ["normal", "lashed"],
      eyelashes: ["long-lash"],
      blush: ["normal"],
      concealer: ["normal"],
      foundation: ["normal"],
      brows: ["normal"],
    },
    isPremium: false,
    projectType: "standard",
    mediaFeatures: {
      allowedSources: ["camera"],
      allowedViews: ["single"],
      comparisonModes: [],
    },
  };

  const sdkFeatures =
    customFeatures || (plan && plan.defaultSdkFeatures) || defaultFeatures;

  const payload = {
    userId,
    planId: plan && plan._id ? plan._id.toString() : "",
    startDate: startDate.getTime(),
    endDate: endDate.getTime(),
    features: sdkFeatures,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, config.sdkToken.secret, {
    expiresIn: Math.floor((endDate - startDate) / 1000),
  });
};

/**
 * بررسی اعتبار توکن SDK
 * @param {string} token - توکن SDK
 * @returns {Object} - پیلود توکن
 */
const verifySDKToken = (token) => {
  try {
    return jwt.verify(token, config.sdkToken.secret);
  } catch (error) {
    throw new Error(`توکن SDK نامعتبر: ${error.message}`);
  }
};

module.exports = {
  generateToken,
  generateAuthTokens,
  generateSDKToken,
  verifySDKToken,
};
