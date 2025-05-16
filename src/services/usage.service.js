const { Usage, Package } = require("../models");

/**
 * ثبت استفاده از SDK
 * @param {Object} usageData - داده‌های استفاده
 * @returns {Promise<Usage>}
 */
const trackUsage = async (usageData) => {
  // کاهش تعداد درخواست‌های باقیمانده
  if (usageData.packageId) {
    await Package.findByIdAndUpdate(usageData.packageId, {
      $inc: { "requestLimit.remaining": -1 },
    });
  }

  // ثبت استفاده
  return Usage.create(usageData);
};

/**
 * دریافت آمار استفاده کاربر
 * @param {string} userId - شناسه کاربر
 * @param {Object} filter - فیلترهای اضافی
 * @param {Object} options - گزینه‌های دریافت
 * @returns {Promise<QueryResult>}
 */
const getUserUsageStats = async (userId, filter = {}, options = {}) => {
  const combinedFilter = { userId, ...filter };
  return Usage.find(combinedFilter, null, options);
};

/**
 * دریافت آمار استفاده برای یک بسته
 * @param {string} packageId - شناسه بسته
 * @returns {Promise<Object>}
 */
const getPackageUsageStats = async (packageId) => {
  const [total, validate, apply, check, other] = await Promise.all([
    Usage.countDocuments({ packageId }),
    Usage.countDocuments({ packageId, requestType: "validate" }),
    Usage.countDocuments({ packageId, requestType: "apply" }),
    Usage.countDocuments({ packageId, requestType: "check" }),
    Usage.countDocuments({ packageId, requestType: "other" }),
  ]);

  return {
    total,
    validate,
    apply,
    check,
    other,
  };
};

/**
 * دریافت آمار درخواست‌های موفق و ناموفق
 * @param {string} userId - شناسه کاربر
 * @returns {Promise<Object>}
 */
const getSuccessFailStats = async (userId) => {
  const [success, failed] = await Promise.all([
    Usage.countDocuments({ userId, success: true }),
    Usage.countDocuments({ userId, success: false }),
  ]);

  return {
    success,
    failed,
    total: success + failed,
    successRate:
      total > 0 ? ((success / (success + failed)) * 100).toFixed(2) : 0,
  };
};

module.exports = {
  trackUsage,
  getUserUsageStats,
  getPackageUsageStats,
  getSuccessFailStats,
};
