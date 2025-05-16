const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const planRoute = require("./plan.route");
const productRoute = require("./product.route");
const packageRoute = require("./package.route");
const paymentRoute = require("./payment.route");
const couponRoute = require("./coupon.route");
const notificationRoute = require("./notification.route");
const sdkRoute = require("./sdk.route");
const usageRoute = require("./usage.route");
const docsRoute = require("./docs.route");
const config = require("../config");

const router = express.Router();

// تعریف مسیرهای اصلی
const routes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/plans",
    route: planRoute,
  },
  {
    path: "/products",
    route: productRoute,
  },
  {
    path: "/packages",
    route: packageRoute,
  },
  {
    path: "/payments",
    route: paymentRoute,
  },
  {
    path: "/coupons",
    route: couponRoute,
  },
  {
    path: "/notifications",
    route: notificationRoute,
  },
  {
    path: "/sdk",
    route: sdkRoute,
  },
  {
    path: "/usage",
    route: usageRoute,
  },
  {
    path: "/docs",
    route: docsRoute,
  },
];

// نصب مسیرها
routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
