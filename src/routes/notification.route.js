const express = require("express");
const validate = require("../middlewares/validate");
const { notificationValidation } = require("../validations");
const { notificationController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: مدیریت اطلاع‌رسانی‌ها
 */

// مسیرهای اطلاعیه‌های کاربر جاری
router.route("/me").get(auth, notificationController.getMyNotifications);

router
  .route("/:notificationId/read")
  .post(
    auth,
    validate(notificationValidation.markAsRead),
    notificationController.markAsRead
  );

router.route("/read-all").post(auth, notificationController.markAllAsRead);

// مسیرهای ادمین
router.route("/").get(auth, admin, notificationController.getAllNotifications);

router
  .route("/send")
  .post(
    auth,
    admin,
    validate(notificationValidation.sendNotification),
    notificationController.sendNotification
  );

module.exports = router;
