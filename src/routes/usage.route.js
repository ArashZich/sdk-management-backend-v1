const express = require("express");
const { usageController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Usage
 *   description: مدیریت استفاده و آنالیتیکس
 */

// مسیرهای آنالیتیکس کاربر جاری
router.route("/analytics").get(auth, usageController.getMyAnalytics);
router
  .route("/analytics/download")
  .get(auth, usageController.downloadMyAnalytics);

// مسیرهای آنالیتیکس کاربر (ادمین)
router
  .route("/users/:userId/analytics")
  .get(auth, admin, usageController.getUserAnalytics);
router
  .route("/users/:userId/analytics/download")
  .get(auth, admin, usageController.downloadUserAnalytics);

module.exports = router;
