const logger = require("../config/logger");
const seedPlans = require("./plans.seed");
const seedUsers = require("./users.seed");
const mongoose = require("mongoose");

/**
 * تلاش مجدد عملیات با تأخیر
 */
const retry = async (fn, retries = 5, delay = 3000, finalErr = null) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) {
      throw finalErr || err;
    }
    logger.info(
      `تلاش مجدد پس از ${delay}ms، تعداد تلاش‌های باقیمانده: ${retries}`
    );
    await new Promise((r) => setTimeout(r, delay));
    return retry(fn, retries - 1, delay, err);
  }
};

/**
 * اجرای همه سیدها
 */
const runSeeds = async () => {
  try {
    logger.info("شروع اجرای سیدهای اولیه...");

    // اطمینان از اتصال به دیتابیس
    if (mongoose.connection.readyState !== 1) {
      logger.info("در حال اتصال به دیتابیس...");
      await retry(async () => {
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        }
      });
      logger.info("اتصال به دیتابیس برقرار شد");
    }

    // اجرای سید پلن‌ها
    await retry(seedPlans);

    // اجرای سید کاربران
    await retry(seedUsers);

    logger.info("اجرای سیدهای اولیه با موفقیت به پایان رسید");
  } catch (error) {
    logger.error(`خطا در اجرای سیدهای اولیه: ${error.message}`);
    throw error;
  }
};

module.exports = {
  runSeeds,
};
