const { User, Plan, Package } = require("../models");
const logger = require("../config/logger");
const tokenService = require("../services/token.service");

/**
 * سید کاربران پیش‌فرض
 */
const seedUsers = async () => {
  try {
    // بررسی وجود کاربر
    const usersCount = await User.countDocuments();

    if (usersCount > 0) {
      logger.info("کاربران از قبل وجود دارند");
      return;
    }

    // ایجاد کاربر ادمین
    const adminUser = await User.create({
      name: "مدیر سیستم",
      phone: "09120000000",
      email: "admin@example.com",
      company: "شرکت آرایش مجازی",
      role: "admin",
      userType: "real",
      nationalId: "1234567890",
      verified: true,
      allowedDomains: ["localhost", "example.com"],
    });

    // ایجاد کاربر عادی
    const normalUser = await User.create({
      name: "کاربر آزمایشی",
      phone: "09120000001",
      email: "user@example.com",
      company: "شرکت نمونه",
      role: "user",
      userType: "real",
      nationalId: "0123456789",
      verified: true,
      allowedDomains: ["localhost", "example.com"],
    });

    // دریافت پلن حرفه‌ای
    const professionalPlan = await Plan.findOne({ name: "پلن حرفه‌ای" });

    if (professionalPlan) {
      // ایجاد بسته برای هر دو کاربر
      // ادمین
      const startDateAdmin = new Date();
      const endDateAdmin = new Date(startDateAdmin);
      endDateAdmin.setFullYear(endDateAdmin.getFullYear() + 1); // یک سال

      const adminToken = tokenService.generateSDKToken(
        adminUser._id,
        professionalPlan,
        startDateAdmin,
        endDateAdmin
      );

      await Package.create({
        userId: adminUser._id,
        planId: professionalPlan._id,
        startDate: startDateAdmin,
        endDate: endDateAdmin,
        token: adminToken,
        sdkFeatures: professionalPlan.defaultSdkFeatures,
        requestLimit: {
          monthly: professionalPlan.requestLimit.monthly,
          remaining: professionalPlan.requestLimit.monthly,
        },
        status: "active",
      });

      // کاربر عادی
      const startDateUser = new Date();
      const endDateUser = new Date(startDateUser);
      endDateUser.setFullYear(endDateUser.getFullYear() + 1); // یک سال

      const userToken = tokenService.generateSDKToken(
        normalUser._id,
        professionalPlan,
        startDateUser,
        endDateUser
      );

      await Package.create({
        userId: normalUser._id,
        planId: professionalPlan._id,
        startDate: startDateUser,
        endDate: endDateUser,
        token: userToken,
        sdkFeatures: professionalPlan.defaultSdkFeatures,
        requestLimit: {
          monthly: professionalPlan.requestLimit.monthly,
          remaining: professionalPlan.requestLimit.monthly,
        },
        status: "active",
      });

      logger.info("بسته‌های پیش‌فرض با موفقیت برای کاربران ایجاد شدند");
    } else {
      logger.warn("پلن حرفه‌ای یافت نشد. بسته‌ای ایجاد نشد.");
    }

    logger.info("کاربران پیش‌فرض با موفقیت ایجاد شدند");
  } catch (error) {
    logger.error(`خطا در ایجاد کاربران پیش‌فرض: ${error.message}`);
    throw error;
  }
};

module.exports = seedUsers;
