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

      // اگر محدودیت بی‌نهایت است، آن را حفظ کن
      const monthlyLimit = pkg.planId.requestLimit.monthly;
      const newRemainingValue = monthlyLimit === -1 ? -1 : monthlyLimit;

      // به‌روزرسانی شمارنده ماهانه
      await Package.findByIdAndUpdate(pkg._id, {
        "requestLimit.remaining": newRemainingValue,
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
