const express = require("express");
const validate = require("../middlewares/validate");
const { couponValidation } = require("../validations");
const { couponController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: مدیریت کوپن‌های تخفیف
 */

// مسیرهای کوپن
router
  .route("/validate")
  .post(
    auth,
    validate(couponValidation.validateCoupon),
    couponController.validateCoupon
  );

// مسیرهای ادمین
router
  .route("/")
  .get(auth, admin, couponController.getCoupons)
  .post(
    auth,
    admin,
    validate(couponValidation.createCoupon),
    couponController.createCoupon
  );

router
  .route("/:couponId")
  .get(
    auth,
    admin,
    validate(couponValidation.getCoupon),
    couponController.getCoupon
  )
  .put(
    auth,
    admin,
    validate(couponValidation.updateCoupon),
    couponController.updateCoupon
  )
  .delete(
    auth,
    admin,
    validate(couponValidation.deactivateCoupon),
    couponController.deactivateCoupon
  );

module.exports = router;
