const logger = require("../config/logger");
const seedPlans = require("./plans.seed");
const seedUsers = require("./users.seed");

/**
 * اجرای همه سیدها
 */
const runSeeds = async () => {
  try {
    logger.info("شروع اجرای سیدهای اولیه...");

    // اجرای سید پلن‌ها
    await seedPlans();

    // اجرای سید کاربران
    await seedUsers();

    logger.info("اجرای سیدهای اولیه با موفقیت به پایان رسید");
  } catch (error) {
    logger.error(`خطا در اجرای سیدهای اولیه: ${error.message}`);
    throw error;
  }
};

module.exports = {
  runSeeds,
};
