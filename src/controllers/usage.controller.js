const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { usageService, userService } = require("../services");

/**
 * دریافت آنالیتیکس استفاده کاربر جاری
 * @swagger
 * /usage/analytics:
 *   get:
 *     summary: دریافت آنالیتیکس استفاده کاربر جاری
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [week, month, halfyear, year, all]
 *         default: month
 *         description: بازه زمانی
 *     responses:
 *       "200":
 *         description: اطلاعات آنالیتیکس
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         description: دسترسی غیرمجاز
 */
const getMyAnalytics = catchAsync(async (req, res) => {
  const { timeRange } = req.query;
  const analytics = await usageService.getUserAnalytics(
    req.user._id,
    timeRange || "month"
  );
  res.status(httpStatus.OK).send(analytics);
});

/**
 * دانلود آنالیتیکس استفاده کاربر جاری
 * @swagger
 * /usage/analytics/download:
 *   get:
 *     summary: دانلود آنالیتیکس استفاده کاربر جاری (کل تاریخچه)
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: اطلاعات آنالیتیکس
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         description: دسترسی غیرمجاز
 */
const downloadMyAnalytics = catchAsync(async (req, res) => {
  const analytics = await usageService.downloadUserAnalytics(req.user._id);

  // تنظیم هدرها برای دانلود
  res.setHeader("Content-Disposition", 'attachment; filename="analytics.json"');
  res.setHeader("Content-Type", "application/json");

  res.status(httpStatus.OK).send(analytics);
});

/**
 * دریافت آنالیتیکس استفاده کاربر (ادمین)
 * @swagger
 * /usage/users/{userId}/analytics:
 *   get:
 *     summary: دریافت آنالیتیکس استفاده کاربر
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [week, month, halfyear, year, all]
 *         default: month
 *         description: بازه زمانی
 *     responses:
 *       "200":
 *         description: اطلاعات آنالیتیکس
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یافت نشد
 */
const getUserAnalytics = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }

  const { timeRange } = req.query;
  const analytics = await usageService.getUserAnalytics(
    req.params.userId,
    timeRange || "month"
  );
  res.status(httpStatus.OK).send(analytics);
});

/**
 * دانلود آنالیتیکس استفاده کاربر (ادمین)
 * @swagger
 * /usage/users/{userId}/analytics/download:
 *   get:
 *     summary: دانلود آنالیتیکس استفاده کاربر (کل تاریخچه)
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Usage]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     responses:
 *       "200":
 *         description: اطلاعات آنالیتیکس
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یافت نشد
 */
const downloadUserAnalytics = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }

  const analytics = await usageService.downloadUserAnalytics(req.params.userId);

  // تنظیم هدرها برای دانلود
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="analytics-${req.params.userId}.json"`
  );
  res.setHeader("Content-Type", "application/json");

  res.status(httpStatus.OK).send(analytics);
});

module.exports = {
  getMyAnalytics,
  downloadMyAnalytics,
  getUserAnalytics,
  downloadUserAnalytics,
};
