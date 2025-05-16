const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  tokenService,
  smsService,
  userService,
} = require("../services");

/**
 * ورود با OTP
 * @swagger
 * /auth/login/otp:
 *   post:
 *     summary: درخواست کد تایید و ورود با OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: شماره تلفن کاربر
 *                 example: "09123456789"
 *     responses:
 *       "200":
 *         description: کد تایید با موفقیت ارسال شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *       "400":
 *         description: شماره تلفن نامعتبر است
 */
const loginWithOtp = catchAsync(async (req, res) => {
  const { phone } = req.body;

  const user = await authService.loginWithOtp(phone);

  // ارسال پیامک
  await smsService.sendVerificationCode(phone, user.otp.code);

  res.status(httpStatus.OK).send({
    message: "کد تأیید با موفقیت ارسال شد",
    userId: user._id,
  });
});

/**
 * تأیید OTP
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: تایید کد OTP و دریافت توکن
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - code
 *             properties:
 *               phone:
 *                 type: string
 *                 description: شماره تلفن کاربر
 *                 example: "09123456789"
 *               code:
 *                 type: string
 *                 description: کد تایید
 *                 example: "12345"
 *     responses:
 *       "200":
 *         description: کد تایید صحیح است
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 tokens:
 *                   type: object
 *       "400":
 *         description: کد تایید نامعتبر است
 */
const verifyOtp = catchAsync(async (req, res) => {
  const { phone, code } = req.body;

  const user = await authService.verifyOtp(phone, code);

  // تولید توکن‌های دسترسی
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.OK).send({
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      verified: user.verified,
    },
    tokens,
  });
});

/**
 * نوسازی توکن
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: نوسازی توکن دسترسی
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: توکن بازیابی
 *     responses:
 *       "200":
 *         description: توکن جدید تولید شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tokens:
 *                   type: object
 *       "401":
 *         description: توکن نامعتبر است
 */
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  const tokens = await authService.refreshAuth(refreshToken);

  res.status(httpStatus.OK).send({ tokens });
});

/**
 * خروج
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: خروج از سیستم
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: خروج موفقیت‌آمیز
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

/**
 * ورود با OAuth
 * @swagger
 * /auth/oauth:
 *   post:
 *     summary: ورود با OAuth
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oauthProvider
 *               - oauthId
 *               - token
 *             properties:
 *               oauthProvider:
 *                 type: string
 *                 description: نام سرویس‌دهنده OAuth
 *                 example: "divar"
 *               oauthId:
 *                 type: string
 *                 description: شناسه کاربر در سرویس OAuth
 *               token:
 *                 type: string
 *                 description: توکن OAuth
 *               name:
 *                 type: string
 *                 description: نام کاربر
 *               email:
 *                 type: string
 *                 description: ایمیل کاربر
 *               phone:
 *                 type: string
 *                 description: شماره تلفن کاربر
 *     responses:
 *       "200":
 *         description: ورود موفقیت‌آمیز
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 tokens:
 *                   type: object
 *       "401":
 *         description: احراز هویت ناموفق
 */
const loginWithOAuth = catchAsync(async (req, res) => {
  const { oauthProvider, oauthId, token, name, email, phone } = req.body;

  // در اینجا باید اعتبار توکن OAuth بررسی شود
  // این بخش به پیاده‌سازی سرویس‌دهنده OAuth بستگی دارد

  const user = await userService.createOrUpdateOAuthUser({
    oauthProvider,
    oauthId,
    name,
    email,
    phone,
  });

  // تولید توکن‌های دسترسی
  const tokens = await tokenService.generateAuthTokens(user);

  res.status(httpStatus.OK).send({
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      verified: user.verified,
    },
    tokens,
  });
});

module.exports = {
  loginWithOtp,
  verifyOtp,
  refreshToken,
  logout,
  loginWithOAuth,
};
