const httpStatus = require("http-status");
const { Package, User, Plan } = require("../models");
const ApiError = require("../utils/ApiError");
const tokenService = require("./token.service");

/**
 * ایجاد بسته جدید
 * @param {Object} packageData - اطلاعات بسته
 * @returns {Promise<Package>}
 */
const createPackage = async (packageData) => {
  const { userId, planId, startDate, endDate, sdkFeatures } = packageData;

  // بررسی وجود کاربر
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }

  // بررسی وجود پلن
  const plan = await Plan.findById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "پلن یافت نشد");
  }

  // تولید توکن SDK
  const token = tokenService.generateSDKToken(
    userId,
    plan,
    startDate,
    endDate,
    sdkFeatures
  );

  // تنظیم محدودیت درخواست (بی‌نهایت یا عددی)
  const monthlyLimit = plan.requestLimit.monthly;
  const remainingLimit = monthlyLimit === -1 ? -1 : monthlyLimit;

  // ایجاد بسته جدید
  const newPackage = await Package.create({
    userId,
    planId,
    startDate,
    endDate,
    token,
    sdkFeatures: sdkFeatures || plan.defaultSdkFeatures,
    requestLimit: {
      monthly: monthlyLimit,
      remaining: remainingLimit,
    },
    status: "active",
    paymentId: packageData.paymentId,
  });

  return newPackage;
};

/**
 * دریافت بسته با شناسه
 * @param {ObjectId} packageId - شناسه بسته
 * @returns {Promise<Package>}
 */
const getPackageById = async (packageId) => {
  return Package.findById(packageId)
    .populate("userId", "name phone email")
    .populate("planId", "name duration price");
};

/**
 * دریافت بسته‌های کاربر
 * @param {ObjectId} userId - شناسه کاربر
 * @param {Object} filter - فیلترهای اضافی
 * @returns {Promise<Array>}
 */
const getUserPackages = async (userId, filter = {}) => {
  const combinedFilter = { userId, ...filter };
  return Package.find(combinedFilter)
    .populate("planId", "name duration price")
    .sort({ createdAt: -1 });
};

/**
 * دریافت بسته‌های فعال کاربر
 * @param {ObjectId} userId - شناسه کاربر
 * @returns {Promise<Array>}
 */
const getUserActivePackages = async (userId) => {
  const now = new Date();
  return Package.find({
    userId,
    status: "active",
    endDate: { $gt: now },
  })
    .populate("planId", "name duration price")
    .sort({ endDate: 1 });
};

/**
 * دریافت بسته فعال با توکن
 * @param {string} token - توکن SDK
 * @returns {Promise<Package>}
 */
const getActivePackageByToken = async (token) => {
  const now = new Date();
  return Package.findOne({
    token,
    status: "active",
    endDate: { $gt: now },
  }).populate("userId", "allowedDomains");
};

/**
 * به‌روزرسانی ویژگی‌های SDK بسته
 * @param {ObjectId} packageId - شناسه بسته
 * @param {Object} sdkFeatures - ویژگی‌های جدید SDK
 * @returns {Promise<Package>}
 */
const updateSdkFeatures = async (packageId, sdkFeatures) => {
  const pkg = await getPackageById(packageId);
  if (!pkg) {
    throw new ApiError(httpStatus.NOT_FOUND, "بسته یافت نشد");
  }

  // به‌روزرسانی ویژگی‌های SDK
  pkg.sdkFeatures = sdkFeatures;

  // تولید توکن SDK جدید
  const plan = await Plan.findById(pkg.planId);
  const token = tokenService.generateSDKToken(
    pkg.userId._id,
    plan,
    pkg.startDate,
    pkg.endDate,
    sdkFeatures
  );

  pkg.token = token;
  await pkg.save();

  return pkg;
};

/**
 * تمدید بسته
 * @param {ObjectId} packageId - شناسه بسته
 * @param {number} days - تعداد روزهای تمدید
 * @returns {Promise<Package>}
 */
const extendPackage = async (packageId, days) => {
  const pkg = await getPackageById(packageId);
  if (!pkg) {
    throw new ApiError(httpStatus.NOT_FOUND, "بسته یافت نشد");
  }

  // تنظیم تاریخ پایان جدید
  const newEndDate = new Date(pkg.endDate);
  newEndDate.setDate(newEndDate.getDate() + days);
  pkg.endDate = newEndDate;

  // تولید توکن SDK جدید
  const plan = await Plan.findById(pkg.planId);
  const token = tokenService.generateSDKToken(
    pkg.userId._id,
    plan,
    pkg.startDate,
    newEndDate,
    pkg.sdkFeatures
  );

  pkg.token = token;
  pkg.status = "active";
  pkg.notified = false;

  await pkg.save();

  return pkg;
};

/**
 * تعلیق بسته
 * @param {ObjectId} packageId - شناسه بسته
 * @returns {Promise<Package>}
 */
const suspendPackage = async (packageId) => {
  const pkg = await getPackageById(packageId);
  if (!pkg) {
    throw new ApiError(httpStatus.NOT_FOUND, "بسته یافت نشد");
  }

  pkg.status = "suspended";
  await pkg.save();

  return pkg;
};

/**
 * فعال‌سازی مجدد بسته
 * @param {ObjectId} packageId - شناسه بسته
 * @returns {Promise<Package>}
 */
const reactivatePackage = async (packageId) => {
  const pkg = await getPackageById(packageId);
  if (!pkg) {
    throw new ApiError(httpStatus.NOT_FOUND, "بسته یافت نشد");
  }

  const now = new Date();
  if (pkg.endDate <= now) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "بسته منقضی شده است و قابل فعال‌سازی مجدد نیست"
    );
  }

  pkg.status = "active";
  await pkg.save();

  return pkg;
};

/**
 * ریست شمارنده استفاده ماهانه
 * @returns {Promise<number>}
 */
const resetMonthlyUsage = async () => {
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
};

module.exports = {
  createPackage,
  getPackageById,
  getUserPackages,
  getUserActivePackages,
  getActivePackageByToken,
  updateSdkFeatures,
  extendPackage,
  suspendPackage,
  reactivatePackage,
  resetMonthlyUsage,
};
