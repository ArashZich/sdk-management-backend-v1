const { Package } = require("../models");
const logger = require("../config/logger");

/**
 * ریست شمارنده استفاده ماهانه
 */
const resetMonthlyUsage = async () => {
  try {
    // بسته‌های فعال
    const activePackages = await Package.find({
      status: "active",
    }).populate("planId");

    let updatedCount = 0;

    // ریست شمارنده ماهانه برای هر بسته
    for (const pkg of activePackages) {
      if (!pkg.planId) continue;

      // به‌روزرسانی شمارنده ماهانه
      await Package.findByIdAndUpdate(pkg._id, {
        "requestLimit.remaining": pkg.planId.requestLimit.monthly,
      });

      updatedCount++;
    }

    return updatedCount;
  } catch (error) {
    logger.error(`خطا در ریست شمارنده ماهانه: ${error.message}`);
    throw error;
  }
};

module.exports = resetMonthlyUsage;
