const { Notification, User } = require("../models");
const smsService = require("./sms.service");

/**
 * ایجاد اطلاعیه جدید
 * @param {Object} notificationData - اطلاعات اطلاعیه
 * @returns {Promise<Notification>}
 */
const createNotification = async (notificationData) => {
  return Notification.create(notificationData);
};

/**
 * دریافت اطلاعیه‌های کاربر
 * @param {ObjectId} userId - شناسه کاربر
 * @param {Object} filter - فیلترهای اضافی
 * @returns {Promise<Array>}
 */
const getUserNotifications = async (userId, filter = {}) => {
  const combinedFilter = { userId, ...filter };
  return Notification.find(combinedFilter).sort({ createdAt: -1 });
};

/**
 * دریافت همه اطلاعیه‌ها
 * @param {Object} filter - فیلترهای جستجو
 * @param {Object} options - گزینه‌های دریافت
 * @returns {Promise<Array>}
 */
const queryNotifications = async (filter, options) => {
  return Notification.find(filter, null, options)
    .populate("userId", "name phone email")
    .populate("planId", "name")
    .sort({ createdAt: -1 });
};

/**
 * علامت‌گذاری اطلاعیه به عنوان خوانده شده
 * @param {ObjectId} notificationId - شناسه اطلاعیه
 * @param {ObjectId} userId - شناسه کاربر
 * @returns {Promise<Notification>}
 */
const markAsRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { read: true },
    { new: true }
  );
};

/**
 * علامت‌گذاری همه اطلاعیه‌های کاربر به عنوان خوانده شده
 * @param {ObjectId} userId - شناسه کاربر
 * @returns {Promise<Object>}
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { userId, read: false },
    { read: true }
  );

  return {
    modifiedCount: result.modifiedCount,
  };
};

/**
 * ارسال اطلاعیه به کاربر
 * @param {ObjectId} userId - شناسه کاربر
 * @param {string} title - عنوان اطلاعیه
 * @param {string} message - متن اطلاعیه
 * @param {string} type - نوع اطلاعیه
 * @param {Object} metadata - متادیتا
 * @param {boolean} sendSms - ارسال پیامک
 * @returns {Promise<Notification>}
 */
const sendNotificationToUser = async (
  userId,
  title,
  message,
  type,
  metadata = {},
  sendSms = false
) => {
  // ایجاد اطلاعیه
  const notification = await createNotification({
    userId,
    title,
    message,
    type,
    metadata,
  });

  // ارسال پیامک
  if (sendSms) {
    const user = await User.findById(userId);
    if (user && user.phone && user.notificationSettings?.sms) {
      try {
        await smsService.sendSMS(user.phone, `${title}: ${message}`);
      } catch (error) {
        console.error("خطا در ارسال پیامک:", error);
      }
    }
  }

  return notification;
};

/**
 * ارسال اطلاعیه به کاربران پلن
 * @param {ObjectId} planId - شناسه پلن
 * @param {string} title - عنوان اطلاعیه
 * @param {string} message - متن اطلاعیه
 * @param {string} type - نوع اطلاعیه
 * @param {Object} metadata - متادیتا
 * @param {boolean} sendSms - ارسال پیامک
 * @returns {Promise<Object>}
 */
const sendNotificationToPlanUsers = async (
  planId,
  title,
  message,
  type,
  metadata = {},
  sendSms = false
) => {
  // یافتن کاربرانی که پلن مورد نظر را دارند
  const packages = await require("./package.service").queryPackages({
    planId,
    status: "active",
  });

  let count = 0;

  // ارسال اطلاعیه به هر کاربر
  for (const pkg of packages) {
    await sendNotificationToUser(
      pkg.userId,
      title,
      message,
      type,
      {
        ...metadata,
        planId,
        packageId: pkg._id,
      },
      sendSms
    );
    count++;
  }

  return { count };
};

/**
 * ارسال اطلاعیه انقضای بسته
 * @returns {Promise<number>}
 */
const sendExpiryNotifications = async () => {
  // بسته‌های در حال انقضا در 10 روز آینده
  const tenDaysLater = new Date();
  tenDaysLater.setDate(tenDaysLater.getDate() + 10);

  const now = new Date();

  const expiringPackages = await require("./package.service").queryPackages({
    endDate: {
      $gt: now,
      $lte: tenDaysLater,
    },
    notified: false,
    status: "active",
  });

  let count = 0;

  // ارسال اطلاع‌رسانی
  for (const pkg of expiringPackages) {
    const user = await User.findById(pkg.userId);
    const plan = await require("./plan.service").getPlanById(pkg.planId);

    if (!user || !plan) continue;

    // محاسبه روزهای باقیمانده
    const daysLeft = Math.ceil((pkg.endDate - now) / (1000 * 60 * 60 * 24));

    // ارسال اطلاعیه داخلی
    await createNotification({
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
      try {
        await smsService.sendExpiryNotification(
          user.phone,
          daysLeft.toString(),
          plan.name
        );
      } catch (error) {
        console.error("خطا در ارسال پیامک:", error);
      }
    }

    // به‌روزرسانی وضعیت اطلاع‌رسانی
    await require("./package.service").updatePackageById(pkg._id, {
      notified: true,
    });

    count++;
  }

  return count;
};

module.exports = {
  createNotification,
  getUserNotifications,
  queryNotifications,
  markAsRead,
  markAllAsRead,
  sendNotificationToUser,
  sendNotificationToPlanUsers,
  sendExpiryNotifications,
};
