const httpStatus = require("http-status");
const tokenService = require("../services/token.service");
const ApiError = require("../utils/ApiError");
const { User, Package } = require("../models");

/**
 * میدلور احراز هویت SDK
 */
const sdkAuth = async (req, res, next) => {
  try {
    const token = req.headers["x-sdk-token"];
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "توکن SDK ارائه نشده است");
    }

    const decoded = tokenService.verifySDKToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
    }

    const package = await Package.findOne({
      userId: decoded.userId,
      token: token,
      status: "active",
      endDate: { $gt: new Date() },
    });

    if (!package) {
      throw new ApiError(httpStatus.NOT_FOUND, "بسته فعال یافت نشد");
    }

    if (package.requestLimit.remaining <= 0) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "محدودیت درخواست به پایان رسیده است"
      );
    }

    // بررسی دامنه درخواست
    const origin = req.headers.origin || req.headers.referer;
    if (origin && user.allowedDomains?.length > 0) {
      const domain = new URL(origin).hostname;
      if (!user.allowedDomains.some((d) => domain.endsWith(d))) {
        throw new ApiError(httpStatus.FORBIDDEN, "دامنه مجاز نیست");
      }
    }

    req.sdkUser = user;
    req.sdkPackage = package;

    // اطلاعات برای ثبت استفاده
    req.clientInfo = {
      origin: origin || "",
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers["user-agent"] || "",
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = sdkAuth;
