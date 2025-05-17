const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  tokenService,
  smsService,
  userService,
} = require("../services");

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

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  const tokens = await authService.refreshAuth(refreshToken);

  res.status(httpStatus.OK).send({ tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

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
