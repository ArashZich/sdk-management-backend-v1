// src/services/index.js
const authService = require("./auth.service");
const userService = require("./user.service");
const planService = require("./plan.service");
const productService = require("./product.service");
const packageService = require("./package.service");
const paymentService = require("./payment.service");
const couponService = require("./coupon.service");
const notificationService = require("./notification.service");
const tokenService = require("./token.service");
const sdkService = require("./sdk.service");
const usageService = require("./usage.service");
const smsService = require("./sms.service");
const usageService = require("./usage.service");

module.exports = {
  authService,
  userService,
  planService,
  productService,
  packageService,
  paymentService,
  couponService,
  notificationService,
  tokenService,
  sdkService,
  usageService,
  smsService,
  usageService,
};
