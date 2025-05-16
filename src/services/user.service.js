const httpStatus = require("http-status");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * ایجاد کاربر جدید
 * @param {Object} userBody - اطلاعات کاربر
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.findOne({ phone: userBody.phone })) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "این شماره تلفن قبلاً ثبت شده است"
    );
  }

  return User.create(userBody);
};

/**
 * دریافت کاربر با شناسه
 * @param {ObjectId} id - شناسه کاربر
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * دریافت کاربر با شماره تلفن
 * @param {string} phone - شماره تلفن
 * @returns {Promise<User>}
 */
const getUserByPhone = async (phone) => {
  return User.findOne({ phone });
};

/**
 * دریافت کاربر با شناسه OAuth
 * @param {string} oauthId - شناسه OAuth
 * @param {string} provider - نام سرویس‌دهنده
 * @returns {Promise<User>}
 */
const getUserByOAuth = async (oauthId, provider) => {
  return User.findOne({ oauthId, oauthProvider: provider });
};

/**
 * دریافت همه کاربران
 * @param {Object} filter - فیلترهای جستجو
 * @param {Object} options - گزینه‌های دریافت
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  return User.find(filter, null, options);
};

/**
 * به‌روزرسانی کاربر
 * @param {ObjectId} userId - شناسه کاربر
 * @param {Object} updateBody - اطلاعات به‌روزرسانی
 * @returns {Promise<User>}
 */
const updateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }

  if (updateBody.phone && updateBody.phone !== user.phone) {
    if (await User.findOne({ phone: updateBody.phone })) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "این شماره تلفن قبلاً ثبت شده است"
      );
    }
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * به‌روزرسانی دامنه‌های مجاز کاربر
 * @param {ObjectId} userId - شناسه کاربر
 * @param {Array} domains - دامنه‌های مجاز
 * @returns {Promise<User>}
 */
const updateUserDomains = async (userId, domains) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }

  user.allowedDomains = domains;
  await user.save();

  return user;
};

/**
 * به‌روزرسانی تنظیمات اطلاع‌رسانی کاربر
 * @param {ObjectId} userId - شناسه کاربر
 * @param {Object} settings - تنظیمات اطلاع‌رسانی
 * @returns {Promise<User>}
 */
const updateNotificationSettings = async (userId, settings) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }

  user.notificationSettings = {
    ...user.notificationSettings,
    ...settings,
  };

  await user.save();
  return user;
};

/**
 * حذف کاربر
 * @param {ObjectId} userId - شناسه کاربر
 * @returns {Promise<User>}
 */
const deleteUser = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }

  await user.remove();
  return user;
};

/**
 * ایجاد یا به‌روزرسانی کاربر با اطلاعات OAuth
 * @param {Object} oauthData - اطلاعات OAuth
 * @returns {Promise<User>}
 */
const createOrUpdateOAuthUser = async (oauthData) => {
  const { oauthId, oauthProvider, email, name, phone } = oauthData;

  let user = await getUserByOAuth(oauthId, oauthProvider);

  if (user) {
    // به‌روزرسانی اطلاعات کاربر موجود
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.verified = true;
    await user.save();
    return user;
  }

  // بررسی وجود کاربر با ایمیل یا شماره تلفن
  if (email) {
    user = await User.findOne({ email });
    if (user) {
      // اضافه کردن اطلاعات OAuth به کاربر موجود
      user.oauthId = oauthId;
      user.oauthProvider = oauthProvider;
      user.verified = true;
      await user.save();
      return user;
    }
  }

  if (phone) {
    user = await getUserByPhone(phone);
    if (user) {
      // اضافه کردن اطلاعات OAuth به کاربر موجود
      user.oauthId = oauthId;
      user.oauthProvider = oauthProvider;
      user.verified = true;
      await user.save();
      return user;
    }
  }

  // ایجاد کاربر جدید
  return User.create({
    name: name || `کاربر ${oauthProvider}`,
    email,
    phone,
    oauthId,
    oauthProvider,
    role: "user",
    verified: true,
  });
};

module.exports = {
  createUser,
  getUserById,
  getUserByPhone,
  getUserByOAuth,
  queryUsers,
  updateUser,
  updateUserDomains,
  updateNotificationSettings,
  deleteUser,
  createOrUpdateOAuthUser,
};
