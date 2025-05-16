const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { isValidIranianPhone } = require("../utils/phoneUtil");

/**
 * ثبت ورود با OTP
 * @param {string} phone - شماره تلفن
 * @returns {Promise<User>}
 */
const loginWithOtp = async (phone) => {
  if (!isValidIranianPhone(phone)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "شماره تلفن نامعتبر است");
  }

  // جستجوی کاربر یا ایجاد کاربر جدید
  let user = await userService.getUserByPhone(phone);

  if (!user) {
    user = await userService.createUser({
      phone,
      name: `کاربر ${phone.substring(phone.length - 4)}`,
      role: "user",
      verified: false,
    });
  }

  // تولید OTP 5 رقمی
  const otpCode = Math.floor(10000 + Math.random() * 90000).toString();

  // ذخیره OTP در دیتابیس
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 5);

  user.otp = {
    code: otpCode,
    expiresAt,
  };

  await user.save();

  return user;
};

/**
 * تأیید OTP
 * @param {string} phone - شماره تلفن
 * @param {string} code - کد تأیید
 * @returns {Promise<User>}
 */
const verifyOtp = async (phone, code) => {
  const user = await userService.getUserByPhone(phone);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }

  // بررسی OTP
  if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
    throw new ApiError(httpStatus.BAD_REQUEST, "کد تأیید ارسال نشده است");
  }

  if (user.otp.expiresAt < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "کد تأیید منقضی شده است");
  }

  if (user.otp.code !== code) {
    throw new ApiError(httpStatus.BAD_REQUEST, "کد تأیید نامعتبر است");
  }

  // تأیید کاربر
  user.verified = true;
  user.otp = undefined;
  await user.save();

  return user;
};

/**
 * نوسازی توکن
 * @param {string} refreshToken - توکن بازیابی
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const tokenPayload = tokenService.verifyToken(refreshToken, "refresh");
    const user = await userService.getUserById(tokenPayload.sub);

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new Error("توکن بازیابی نامعتبر است");
    }

    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "خطا در نوسازی توکن: " + error.message
    );
  }
};

/**
 * خروج
 * @param {string} userId - شناسه کاربر
 * @returns {Promise}
 */
const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};

module.exports = {
  loginWithOtp,
  verifyOtp,
  refreshAuth,
  logout,
};
