const express = require("express");
const validate = require("../middlewares/validate");
const { paymentValidation } = require("../validations");
const { paymentController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: مدیریت پرداخت‌ها
 */

// مسیرهای پرداخت
router
  .route("/")
  .post(
    auth,
    validate(paymentValidation.createPayment),
    paymentController.createPayment
  )
  .get(auth, admin, paymentController.getPayments);

router.route("/callback").get(paymentController.paymentCallback);

router.route("/me").get(auth, paymentController.getMyPayments);

router
  .route("/:paymentId")
  .get(
    auth,
    validate(paymentValidation.getPayment),
    paymentController.getPayment
  );

router
  .route("/:paymentId/cancel")
  .post(
    auth,
    validate(paymentValidation.cancelPayment),
    paymentController.cancelPayment
  );

module.exports = router;
