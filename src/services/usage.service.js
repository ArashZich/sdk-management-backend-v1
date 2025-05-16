const { Usage, Package } = require("../models");
const useragent = require("useragent");

/**
 * ثبت استفاده از SDK
 * @param {Object} usageData - داده‌های استفاده
 * @param {boolean} decrementLimit - آیا از محدودیت کم شود؟
 * @returns {Promise<Usage>}
 */
const trackUsage = async (usageData, decrementLimit = true) => {
  // کاهش تعداد درخواست‌های باقیمانده (فقط اگر decrementLimit=true و packageId وجود داشته باشد)
  if (decrementLimit && usageData.packageId) {
    // بررسی بسته
    const pkg = await Package.findById(usageData.packageId);

    // فقط اگر محدودیت بی‌نهایت نیست، آن را کاهش دهید
    if (pkg && pkg.requestLimit.remaining !== -1) {
      await Package.findByIdAndUpdate(usageData.packageId, {
        $inc: { "requestLimit.remaining": -1 },
      });
    }
  }

  // تحلیل بیشتر User-Agent
  if (usageData.userAgent) {
    const agent = useragent.parse(usageData.userAgent);
    if (!usageData.metadata) usageData.metadata = {};
    usageData.metadata.deviceAnalysis = {
      browser: agent.family,
      browserVersion: agent.toVersion(),
      os: agent.os.family,
      osVersion: agent.os.toVersion(),
      device: agent.device.family,
      isMobile: agent.device.family !== "Other",
    };
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
