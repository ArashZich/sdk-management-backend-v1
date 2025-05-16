const { Package, User, Plan, Notification } = require("../models");
const smsService = require("../services/sms.service");
const logger = require("../config/logger");

/**
 * اطلاع‌رسانی انقضای بسته
 */
const expiryNotification = async () => {
  try {
    // بسته‌های در حال انقضا در 10 روز آینده
    const tenDaysLater = new Date();
    tenDaysLater.setDate(tenDaysLater.getDate() + 10);

    const now = new Date();

    const expiringPackages = await Package.find({
      endDate: {
        $gt: now,
        $lte: tenDaysLater,
      },
      notified: false,
      status: "active",
    }).populate("userId planId");

    let count = 0;

    // ارسال اطلاع‌رسانی
    for (const pkg of expiringPackages) {
      const user = pkg.userId;
      const plan = pkg.planId;

      if (!user || !plan) continue;

      // محاسبه روزهای باقیمانده
      const daysLeft = Math.ceil((pkg.endDate - now) / (1000 * 60 * 60 * 24));

      try {
        // ارسال اطلاعیه داخلی
        await Notification.create({
          userId: user._id,
          planId: plan._id,
          title: "اطلاعیه انقضای بسته",
          message: `بسته ${plan.name} شما تا ${daysLeft} روز دیگر منقضی می‌شود. لطفاً نسبت به تمدید آن اقدام کنید.`,
          type: "expiry",
          metadata: {
            packageId: pkg._id,
            planId: plan._id,
            daysLeft,
          },
        });

        // ارسال پیامک
        if (user.notificationSettings?.sms) {
          await smsService.sendExpiryNotification(
            user.phone,
            daysLeft.toString(),
            plan.name
          );
        }

        // به‌روزرسانی وضعیت اطلاع‌رسانی
        await Package.findByIdAndUpdate(pkg._id, { notified: true });

        count++;
      } catch (error) {
        logger.error(
          `خطا در ارسال اطلاعیه انقضا برای بسته ${pkg._id}: ${error.message}`
        );
      }
    }

    return count;
  } catch (error) {
    logger.error(`خطا در اطلاع‌رسانی انقضای بسته: ${error.message}`);
    throw error;
  }
};

module.exports = expiryNotification;
