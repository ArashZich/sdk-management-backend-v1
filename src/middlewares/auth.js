const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");

/**
 * میدلور احراز هویت با JWT
 */
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "توکن ارائه نشده است");
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    if (decoded.type !== "access") {
      throw new ApiError(httpStatus.UNAUTHORIZED, "نوع توکن نامعتبر است");
    }

    const user = await User.findById(decoded.sub);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "کاربر یافت نشد");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new ApiError(httpStatus.UNAUTHORIZED, "توکن نامعتبر است"));
    } else if (error.name === "TokenExpiredError") {
      next(new ApiError(httpStatus.UNAUTHORIZED, "توکن منقضی شده است"));
    } else {
      next(error);
    }
  }
};

/**
 * میدلور بررسی نقش ادمین
 */
const admin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new ApiError(httpStatus.FORBIDDEN, "دسترسی مجاز نیست"));
  }
  next();
};

module.exports = {
  auth,
  admin,
};
