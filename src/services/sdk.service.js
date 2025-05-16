const httpStatus = require("http-status");
const tokenService = require("./token.service");
const packageService = require("./package.service");
const productService = require("./product.service");
const usageService = require("./usage.service");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");

/**
 * بررسی اعتبار توکن SDK
 * @param {string} token - توکن SDK
 * @param {string} origin - دامنه درخواست‌دهنده
 * @param {string} ipAddress - آدرس IP
 * @param {string} userAgent - مرورگر کاربر
 * @returns {Promise<Object>}
 */
const validateToken = async (token, origin, ipAddress, userAgent) => {
  try {
    // بررسی اعتبار توکن
    const decoded = tokenService.verifySDKToken(token);

    // بررسی کاربر و بسته
    const user = await User.findById(decoded.userId);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");

    const pkg = await packageService.getActivePackageByToken(token);
    if (!pkg) throw new ApiError(httpStatus.NOT_FOUND, "بسته فعال یافت نشد");

    // بررسی دامنه
    if (origin && user.allowedDomains?.length > 0) {
      const domain = new URL(origin).hostname;
      if (!user.allowedDomains.some((d) => domain.endsWith(d))) {
        throw new ApiError(httpStatus.FORBIDDEN, "دامنه مجاز نیست");
      }
    }

    // ثبت استفاده
    await usageService.trackUsage({
      userId: user._id,
      packageId: pkg._id,
      domain: origin ? new URL(origin).hostname : "",
      requestType: "validate",
      ipAddress,
      userAgent,
      success: true,
    });

    return {
      isValid: true,
      isPremium: pkg.sdkFeatures.isPremium,
      projectType: pkg.sdkFeatures.projectType,
      features: pkg.sdkFeatures.features,
      patterns: pkg.sdkFeatures.patterns,
      mediaFeatures: pkg.sdkFeatures.mediaFeatures,
    };
  } catch (error) {
    // ثبت استفاده ناموفق
    try {
      if (error.message.includes("userId")) {
        const decoded = tokenService.verifySDKToken(token);
        await usageService.trackUsage({
          userId: decoded.userId,
          requestType: "validate",
          domain: origin ? new URL(origin).hostname : "",
          ipAddress,
          userAgent,
          success: false,
          errorMessage: error.message,
        });
      }
    } catch (e) {
      // نادیده گرفتن خطا در ثبت استفاده
    }

    throw error;
  }
};

/**
 * دریافت محصولات برای SDK
 * @param {Object} user - اطلاعات کاربر
 * @param {Object} pkg - اطلاعات بسته
 * @param {string} origin - دامنه درخواست‌دهنده
 * @param {string} ipAddress - آدرس IP
 * @param {string} userAgent - مرورگر کاربر
 * @returns {Promise<Array>}
 */
const getProductsForSDK = async (user, pkg, origin, ipAddress, userAgent) => {
  try {
    // دریافت محصولات فعال کاربر
    const products = await productService.getUserProducts(user._id, {
      active: true,
    });

    // ثبت استفاده
    await usageService.trackUsage({
      userId: user._id,
      packageId: pkg._id,
      domain: origin ? new URL(origin).hostname : "",
      requestType: "check",
      ipAddress,
      userAgent,
      success: true,
    });

    return products;
  } catch (error) {
    // ثبت استفاده ناموفق
    await usageService.trackUsage({
      userId: user._id,
      packageId: pkg._id,
      domain: origin ? new URL(origin).hostname : "",
      requestType: "check",
      ipAddress,
      userAgent,
      success: false,
      errorMessage: error.message,
    });

    throw error;
  }
};

/**
 * دریافت محصول با uid برای SDK
 * @param {Object} user - اطلاعات کاربر
 * @param {Object} pkg - اطلاعات بسته
 * @param {string} productUid - شناسه منحصر به فرد محصول
 * @param {string} origin - دامنه درخواست‌دهنده
 * @param {string} ipAddress - آدرس IP
 * @param {string} userAgent - مرورگر کاربر
 * @returns {Promise<Object>}
 */
const getProductForSDK = async (
  user,
  pkg,
  productUid,
  origin,
  ipAddress,
  userAgent
) => {
  try {
    // دریافت محصول
    const product = await productService.getUserProductByUid(
      productUid,
      user._id
    );
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, "محصول یافت نشد");
    }

    // ثبت استفاده
    await usageService.trackUsage({
      userId: user._id,
      packageId: pkg._id,
      productId: product._id,
      productUid: product.uid,
      domain: origin ? new URL(origin).hostname : "",
      requestType: "check",
      ipAddress,
      userAgent,
      success: true,
    });

    return product;
  } catch (error) {
    // ثبت استفاده ناموفق
    await usageService.trackUsage({
      userId: user._id,
      packageId: pkg._id,
      productUid,
      domain: origin ? new URL(origin).hostname : "",
      requestType: "check",
      ipAddress,
      userAgent,
      success: false,
      errorMessage: error.message,
    });

    throw error;
  }
};

/**
 * درخواست اعمال آرایش
 * @param {Object} user - اطلاعات کاربر
 * @param {Object} pkg - اطلاعات بسته
 * @param {string} productUid - شناسه منحصر به فرد محصول
 * @param {Object} makeupData - اطلاعات آرایش
 * @param {string} origin - دامنه درخواست‌دهنده
 * @param {string} ipAddress - آدرس IP
 * @param {string} userAgent - مرورگر کاربر
 * @returns {Promise<Object>}
 */
const applyMakeup = async (
  user,
  pkg,
  productUid,
  makeupData,
  origin,
  ipAddress,
  userAgent
) => {
  try {
    // دریافت محصول
    let productId = null;
    if (productUid) {
      const product = await productService.getUserProductByUid(
        productUid,
        user._id
      );
      if (product) {
        productId = product._id;
      }
    }

    // ثبت استفاده
    await usageService.trackUsage({
      userId: user._id,
      packageId: pkg._id,
      productId,
      productUid,
      domain: origin ? new URL(origin).hostname : "",
      requestType: "apply",
      ipAddress,
      userAgent,
      metadata: makeupData,
      success: true,
    });

    return {
      success: true,
      message: "درخواست اعمال آرایش با موفقیت ثبت شد",
    };
  } catch (error) {
    // ثبت استفاده ناموفق
    await usageService.trackUsage({
      userId: user._id,
      packageId: pkg._id,
      productUid,
      domain: origin ? new URL(origin).hostname : "",
      requestType: "apply",
      ipAddress,
      userAgent,
      metadata: makeupData,
      success: false,
      errorMessage: error.message,
    });

    throw error;
  }
};

/**
 * دریافت وضعیت SDK
 * @param {Object} user - اطلاعات کاربر
 * @param {Object} pkg - اطلاعات بسته
 * @param {string} origin - دامنه درخواست‌دهنده
 * @param {string} ipAddress - آدرس IP
 * @param {string} userAgent - مرورگر کاربر
 * @returns {Promise<Object>}
 */
const getStatus = async (user, pkg, origin, ipAddress, userAgent) => {
  try {
    // دریافت آمار استفاده
    const usageStats = await usageService.getPackageUsageStats(pkg._id);

    // ثبت استفاده
    await usageService.trackUsage({
      userId: user._id,
      packageId: pkg._id,
      domain: origin ? new URL(origin).hostname : "",
      requestType: "other",
      ipAddress,
      userAgent,
      success: true,
    });

    return {
      packageId: pkg._id,
      planId: pkg.planId,
      startDate: pkg.startDate,
      endDate: pkg.endDate,
      status: pkg.status,
      features: pkg.sdkFeatures.features,
      isPremium: pkg.sdkFeatures.isPremium,
      projectType: pkg.sdkFeatures.projectType,
      requestLimit: pkg.requestLimit,
      usageStats,
    };
  } catch (error) {
    // ثبت استفاده ناموفق
    await usageService.trackUsage({
      userId: user._id,
      packageId: pkg._id,
      domain: origin ? new URL(origin).hostname : "",
      requestType: "other",
      ipAddress,
      userAgent,
      success: false,
      errorMessage: error.message,
    });

    throw error;
  }
};

module.exports = {
  validateToken,
  getProductsForSDK,
  getProductForSDK,
  applyMakeup,
  getStatus,
};
