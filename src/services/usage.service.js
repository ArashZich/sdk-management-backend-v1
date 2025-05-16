const { Usage, Package } = require("../models");
const useragent = require("useragent");
const moment = require("moment");

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

  const total = success + failed;

  return {
    success,
    failed,
    total,
    successRate: total > 0 ? ((success / total) * 100).toFixed(2) : 0,
  };
};

/**
 * استخراج آنالیتیکس استفاده برای یک کاربر با فیلتر زمانی
 * @param {string} userId - شناسه کاربر
 * @param {string} timeRange - بازه زمانی (week, month, halfyear, year, all)
 * @returns {Promise<Object>}
 */
const getUserAnalytics = async (userId, timeRange = "all") => {
  // تعیین محدوده زمانی بر اساس پارامتر timeRange
  let startDate = new Date(0); // تاریخ شروع Unix epoch
  const endDate = new Date(); // زمان حال

  if (timeRange !== "all") {
    startDate = moment()
      .subtract(
        timeRange === "week"
          ? 1
          : timeRange === "month"
          ? 1
          : timeRange === "halfyear"
          ? 6
          : 12, // برای timeRange === 'year'

        timeRange === "week"
          ? "weeks"
          : timeRange === "month"
          ? "months"
          : "months" // برای 'halfyear' و 'year'
      )
      .toDate();
  }

  // تعریف فیلتر بر اساس کاربر و بازه زمانی
  const filter = {
    userId,
    createdAt: { $gte: startDate, $lte: endDate },
  };

  // دریافت تمام درخواست‌ها در بازه زمانی
  const usages = await Usage.find(filter);

  if (usages.length === 0) {
    return {
      totalRequests: 0,
      browserStats: {},
      deviceStats: {},
      timeDistribution: {
        byHour: {},
        byDay: {},
        byDate: {},
      },
      successRate: {
        success: 0,
        failed: 0,
        rate: 0,
      },
    };
  }

  // تحلیل داده‌ها
  const analytics = {
    totalRequests: usages.length,
    browserStats: {},
    deviceStats: {},
    osStats: {},
    timeDistribution: {
      byHour: {},
      byDay: {},
      byDate: {},
    },
    successRate: {
      success: 0,
      failed: 0,
      rate: 0,
    },
  };

  // پردازش هر درخواست
  usages.forEach((usage) => {
    // آمار موفقیت/شکست
    if (usage.success) {
      analytics.successRate.success++;
    } else {
      analytics.successRate.failed++;
    }

    // استخراج اطلاعات مرورگر و دستگاه
    let browser = "Unknown";
    let device = "Unknown";
    let os = "Unknown";

    if (usage.metadata && usage.metadata.deviceAnalysis) {
      const analysis = usage.metadata.deviceAnalysis;

      // مرورگر
      browser = analysis.browser || "Unknown";
      if (!analytics.browserStats[browser]) {
        analytics.browserStats[browser] = 0;
      }
      analytics.browserStats[browser]++;

      // دستگاه
      device = analysis.device || "Unknown";
      if (device === "Other" && analysis.isMobile) {
        device = "Mobile";
      } else if (device === "Other") {
        device = "Desktop";
      }

      if (!analytics.deviceStats[device]) {
        analytics.deviceStats[device] = 0;
      }
      analytics.deviceStats[device]++;

      // سیستم عامل
      os = analysis.os || "Unknown";
      if (!analytics.osStats[os]) {
        analytics.osStats[os] = 0;
      }
      analytics.osStats[os]++;
    }

    // توزیع زمانی
    const date = moment(usage.createdAt);
    const hour = date.hour();
    const day = date.format("dddd"); // نام روز هفته
    const dateStr = date.format("YYYY-MM-DD");

    // توزیع بر اساس ساعت
    if (!analytics.timeDistribution.byHour[hour]) {
      analytics.timeDistribution.byHour[hour] = 0;
    }
    analytics.timeDistribution.byHour[hour]++;

    // توزیع بر اساس روز هفته
    if (!analytics.timeDistribution.byDay[day]) {
      analytics.timeDistribution.byDay[day] = 0;
    }
    analytics.timeDistribution.byDay[day]++;

    // توزیع بر اساس تاریخ
    if (!analytics.timeDistribution.byDate[dateStr]) {
      analytics.timeDistribution.byDate[dateStr] = 0;
    }
    analytics.timeDistribution.byDate[dateStr]++;
  });

  // محاسبه نرخ موفقیت
  analytics.successRate.rate = (
    (analytics.successRate.success / analytics.totalRequests) *
    100
  ).toFixed(2);

  return analytics;
};

/**
 * دانلود کل داده‌های آنالیتیکس برای یک کاربر
 * @param {string} userId - شناسه کاربر
 * @returns {Promise<Object>}
 */
const downloadUserAnalytics = async (userId) => {
  // از متد موجود استفاده می‌کنیم، اما همه تاریخچه را مد نظر قرار می‌دهیم
  return getUserAnalytics(userId, "all");
};

module.exports = {
  trackUsage,
  getUserUsageStats,
  getPackageUsageStats,
  getSuccessFailStats,
  getUserAnalytics,
  downloadUserAnalytics,
};
