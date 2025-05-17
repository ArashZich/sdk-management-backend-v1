const redis = require("redis");
const config = require("../config");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const logger = require("../config/logger");

// دریافت کلاینت ردیس
const redisModule = require("../config/redis");

/**
 * میدلور محدودیت نرخ درخواست
 * @param {number} maxRequests - حداکثر تعداد درخواست مجاز
 * @param {number} windowMs - مدت زمان (به میلی‌ثانیه) برای محدودیت
 * @returns {Function} میدلور Express
 */
const rateLimiter = (maxRequests = 300, windowMs = 60 * 1000) => {
  return async (req, res, next) => {
    try {
      const client = await redisModule.getClient();

      const ip =
        req.headers["x-real-user-ip"] || req.ip || req.socket.remoteAddress;
      const key = `rate-limit:${ip}`;

      // دریافت تعداد درخواست‌های فعلی
      const current = await client.get(key);
      const currentRequests = current ? parseInt(current) : 0;

      // بررسی محدودیت
      if (currentRequests >= maxRequests) {
        throw new ApiError(
          httpStatus.TOO_MANY_REQUESTS,
          "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً چند دقیقه بعد مجدداً تلاش کنید."
        );
      }

      // افزایش شمارنده درخواست و تنظیم زمان منقضی شدن
      await client.set(key, currentRequests + 1, {
        EX: Math.ceil(windowMs / 1000), // تبدیل به ثانیه برای Redis
        NX: currentRequests === 0, // فقط اگر کلید وجود نداشته باشد
      });

      // تنظیم هدرهای Rate Limit
      res.setHeader("X-RateLimit-Limit", maxRequests);
      res.setHeader(
        "X-RateLimit-Remaining",
        Math.max(0, maxRequests - currentRequests - 1)
      );

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        next(error);
      } else {
        logger.error(`خطا در میدلور rateLimiter: ${error.message}`);
        // در صورت خطا در اتصال به Redis، اجازه دهید درخواست ادامه یابد
        next();
      }
    }
  };
};

module.exports = rateLimiter;
