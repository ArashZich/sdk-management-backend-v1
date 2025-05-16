const { Plan } = require("../models");
const logger = require("../config/logger");

/**
 * سید پلن‌های پیش‌فرض
 */
const seedPlans = async () => {
  try {
    // بررسی وجود پلن
    const plansCount = await Plan.countDocuments();

    if (plansCount > 0) {
      logger.info("پلن‌ها از قبل وجود دارند");
      return;
    }

    // لیست پلن‌های پیش‌فرض
    const defaultPlans = [
      {
        name: "پلن پایه",
        description: "مناسب برای استفاده آزمایشی",
        price: 500000,
        duration: 30, // 30 روز
        features: ["دسترسی به رژ لب", "محدودیت تعداد رنگ"],
        requestLimit: {
          monthly: 1000,
          total: 1000,
        },
        defaultSdkFeatures: {
          features: ["lips"],
          patterns: {
            lips: ["normal", "matte"],
          },
          mediaFeatures: {
            allowedSources: ["camera"],
            allowedViews: ["single"],
            comparisonModes: [],
          },
        },
        active: true,
      },
      {
        name: "پلن استاندارد",
        description: "مناسب برای سایت‌های کوچک و متوسط",
        price: 1500000,
        duration: 90, // 90 روز
        features: ["دسترسی به رژ لب", "دسترسی به سایه چشم", "پشتیبانی ایمیلی"],
        requestLimit: {
          monthly: 3000,
          total: 9000,
        },
        defaultSdkFeatures: {
          features: ["lips", "eyeshadow", "eyepencil"],
          patterns: {
            lips: ["normal", "matte", "glossy"],
            eyeshadow: ["normal"],
            eyepencil: ["normal"],
          },
          mediaFeatures: {
            allowedSources: ["camera"],
            allowedViews: ["single"],
            comparisonModes: [],
          },
        },
        active: true,
      },
      {
        name: "پلن حرفه‌ای",
        description: "مناسب برای سایت‌های پرترافیک",
        price: 3500000,
        duration: 180, // 180 روز
        features: [
          "دسترسی به همه محصولات",
          "الگوهای سفارشی",
          "پشتیبانی ویژه",
          "اولویت در به‌روزرسانی‌ها",
        ],
        requestLimit: {
          monthly: 10000,
          total: 60000,
        },
        defaultSdkFeatures: {
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
          isPremium: true,
          projectType: "professional",
          mediaFeatures: {
            allowedSources: ["camera", "image"],
            allowedViews: ["single", "multi", "split"],
            comparisonModes: ["before-after", "split"],
          },
        },
        active: true,
        specialOffer: true,
      },
    ];

    // ایجاد پلن‌ها
    await Plan.insertMany(defaultPlans);

    logger.info(`${defaultPlans.length} پلن پیش‌فرض با موفقیت ایجاد شدند`);
  } catch (error) {
    logger.error(`خطا در ایجاد پلن‌های پیش‌فرض: ${error.message}`);
    throw error;
  }
};

module.exports = seedPlans;
