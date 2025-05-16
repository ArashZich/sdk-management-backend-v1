const httpStatus = require("http-status");
const logger = require("../config/logger");
const config = require("../config");
const ApiError = require("../utils/ApiError");

/**
 * تبدیل خطاها به ApiError
 */
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || "خطای داخلی سرور";
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

/**
 * میدلور مدیریت خطا
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // در محیط پروداکشن پیام‌های خطای داخلی را پنهان می‌کنیم
  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "خطای داخلی سرور";
  }

  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && { stack: err.stack }),
  };

  if (config.env === "development") {
    logger.error(err);
  }

  res.status(statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
