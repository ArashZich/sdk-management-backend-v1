const httpStatus = require("http-status");
const { Coupon } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * ایجاد کوپن جدید
 * @param {Object} couponData - اطلاعات کوپن
 * @returns {Promise<Coupon>}
 */
const createCoupon = async (couponData) => {
  // تبدیل کد به حروف بزرگ
  couponData.code = couponData.code.toUpperCase();

  // بررسی وجود کد تکراری
  const existingCoupon = await Coupon.findOne({ code: couponData.code });
  if (existingCoupon) {
    throw new ApiError(httpStatus.BAD_REQUEST, "کد کوپن تکراری است");
  }

  return Coupon.create(couponData);
};

/**
 * دریافت کوپن با شناسه
 * @param {ObjectId} id - شناسه کوپن
 * @returns {Promise<Coupon>}
 */
const getCouponById = async (id) => {
  return Coupon.findById(id);
};

/**
 * دریافت کوپن با کد
 * @param {string} code - کد کوپن
 * @returns {Promise<Coupon>}
 */
const getCouponByCode = async (code) => {
  return Coupon.findOne({ code: code.toUpperCase() });
};

/**
 * دریافت همه کوپن‌ها
 * @param {Object} filter - فیلترهای جستجو
 * @param {Object} options - گزینه‌های دریافت
 * @returns {Promise<Array>}
 */
const queryCoupons = async (filter, options) => {
  return Coupon.find(filter, null, options)
    .populate("forPlans", "name")
    .populate("forUsers", "name phone")
    .sort({ createdAt: -1 });
};

/**
 * به‌روزرسانی کوپن
 * @param {ObjectId} couponId - شناسه کوپن
 * @param {Object} updateData - اطلاعات به‌روزرسانی
 * @returns {Promise<Coupon>}
 */
const updateCoupon = async (couponId, updateData) => {
  const coupon = await getCouponById(couponId);
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "کوپن یافت نشد");
  }

  // بررسی کد تکراری
  if (updateData.code && updateData.code.toUpperCase() !== coupon.code) {
    const existingCoupon = await Coupon.findOne({
      code: updateData.code.toUpperCase(),
      _id: { $ne: couponId },
    });

    if (existingCoupon) {
      throw new ApiError(httpStatus.BAD_REQUEST, "کد کوپن تکراری است");
    }

    updateData.code = updateData.code.toUpperCase();
  }

  Object.assign(coupon, updateData);
  await coupon.save();

  return coupon;
};

/**
 * افزایش تعداد استفاده از کوپن
 * @param {ObjectId} couponId - شناسه کوپن
 * @returns {Promise<Coupon>}
 */
const incrementCouponUsage = async (couponId) => {
  return Coupon.findByIdAndUpdate(
    couponId,
    { $inc: { usedCount: 1 } },
    { new: true }
  );
};

/**
 * بررسی اعتبار کوپن
 * @param {string} code - کد کوپن
 * @param {ObjectId} userId - شناسه کاربر
 * @param {ObjectId} planId - شناسه پلن
 * @returns {Promise<Object>}
 */
const validateCoupon = async (code, userId, planId) => {
  // دریافت کوپن با کد
  const coupon = await getCouponByCode(code);
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "کوپن یافت نشد");
  }

  // بررسی فعال بودن کوپن
  if (!coupon.active) {
    throw new ApiError(httpStatus.BAD_REQUEST, "کوپن غیرفعال است");
  }

  // بررسی تاریخ اعتبار
  const now = new Date();
  if (coupon.startDate > now || coupon.endDate < now) {
    throw new ApiError(httpStatus.BAD_REQUEST, "کوپن منقضی شده است");
  }

  // بررسی تعداد استفاده
  if (coupon.usedCount >= coupon.maxUsage) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "تعداد استفاده از کوپن به پایان رسیده است"
    );
  }

  // بررسی کاربر خاص
  if (coupon.forUsers && coupon.forUsers.length > 0) {
    const isForUser = coupon.forUsers.some(
      (id) => id.toString() === userId.toString()
    );
    if (!isForUser) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "این کوپن برای کاربر دیگری است"
      );
    }
  }

  // بررسی پلن خاص
  if (coupon.forPlans && coupon.forPlans.length > 0) {
    const isForPlan = coupon.forPlans.some(
      (id) => id.toString() === planId.toString()
    );
    if (!isForPlan) {
      throw new ApiError(httpStatus.BAD_REQUEST, "این کوپن برای پلن دیگری است");
    }
  }

  return {
    valid: true,
    coupon,
  };
};

/**
 * غیرفعال‌سازی کوپن
 * @param {ObjectId} couponId - شناسه کوپن
 * @returns {Promise<Coupon>}
 */
const deactivateCoupon = async (couponId) => {
  const coupon = await getCouponById(couponId);
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "کوپن یافت نشد");
  }

  coupon.active = false;
  await coupon.save();

  return coupon;
};

/**
 * حذف کوپن
 * @param {ObjectId} couponId - شناسه کوپن
 * @returns {Promise<Coupon>}
 */
const deleteCoupon = async (couponId) => {
  const coupon = await getCouponById(couponId);
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "کوپن یافت نشد");
  }

  await coupon.remove();
  return coupon;
};

module.exports = {
  createCoupon,
  getCouponById,
  getCouponByCode,
  queryCoupons,
  updateCoupon,
  incrementCouponUsage,
  validateCoupon,
  deactivateCoupon,
  deleteCoupon,
};
