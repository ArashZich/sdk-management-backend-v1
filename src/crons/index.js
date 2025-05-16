const cron = require("node-cron");
const logger = require("../config/logger");
const resetMonthlyUsage = require("./resetMonthlyUsage");
const expiryNotification = require("./expiryNotification");

/**
 * تنظیم وظایف زمان‌بندی شده
 */
const setupCronJobs = () => {
  // ریست شمارنده‌های ماهانه (اجرا در روز اول هر ماه ساعت 00:01)
  cron.schedule("1 0 1 * *", async () => {
    logger.info("شروع ریست شمارنده‌های ماهانه...");
    try {
      const count = await resetMonthlyUsage();
      logger.info(
        `ریست شمارنده‌های ماهانه با موفقیت انجام شد. تعداد بسته‌های به‌روزرسانی شده: ${count}`
      );
    } catch (error) {
      logger.error(`خطا در ریست شمارنده‌های ماهانه: ${error.message}`);
    }
  });

  // اطلاع‌رسانی انقضای بسته (اجرا هر روز ساعت 09:00)
  cron.schedule("0 9 * * *", async () => {
    logger.info("شروع بررسی و اطلاع‌رسانی بسته‌های در حال انقضا...");
    try {
      const count = await expiryNotification();
      logger.info(
        `اطلاع‌رسانی انقضای بسته با موفقیت انجام شد. تعداد اطلاعیه‌های ارسال شده: ${count}`
      );
    } catch (error) {
      logger.error(`خطا در اطلاع‌رسانی انقضای بسته: ${error.message}`);
    }
  });

  logger.info("وظایف زمان‌بندی شده با موفقیت تنظیم شدند");
};

module.exports = setupCronJobs;
