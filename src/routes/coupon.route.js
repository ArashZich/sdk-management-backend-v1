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

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     summary: بررسی اعتبار کوپن
 *     description: برای کاربران عادی - بررسی اعتبار کد تخفیف
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - planId
 *             properties:
 *               code:
 *                 type: string
 *               planId:
 *                 type: string
 *     responses:
 *       "200":
 *         description: اطلاعات کوپن
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 coupon:
 *                   type: object
 *                 discountAmount:
 *                   type: number
 *                 finalPrice:
 *                   type: number
 *       "400":
 *         description: کوپن نامعتبر است
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "404":
 *         description: کوپن یا پلن یافت نشد
 */
router
  .route("/validate")
  .post(
    auth,
    validate(couponValidation.validateCoupon),
    couponController.validateCoupon
  );

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: دریافت همه کوپن‌ها (ادمین)
 *     description: فقط ادمین - دریافت لیست تمام کوپن‌ها با امکان فیلتر
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: کد کوپن
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: وضعیت فعال بودن
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: تعداد آیتم در هر صفحه
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: شماره صفحه
 *     responses:
 *       "200":
 *         description: لیست کوپن‌ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 */
/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: ایجاد کوپن جدید (ادمین)
 *     description: فقط ادمین - ایجاد کوپن تخفیف جدید
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - percent
 *               - maxAmount
 *               - maxUsage
 *               - startDate
 *               - endDate
 *             properties:
 *               code:
 *                 type: string
 *                 description: کد کوپن (به حروف بزرگ تبدیل می‌شود)
 *               description:
 *                 type: string
 *                 description: توضیحات کوپن
 *               percent:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 100
 *                 description: درصد تخفیف (1-100)
 *               maxAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: حداکثر مبلغ تخفیف (به ریال)
 *               maxUsage:
 *                 type: number
 *                 minimum: 1
 *                 description: حداکثر تعداد استفاده مجاز
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: تاریخ شروع اعتبار کوپن
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: تاریخ پایان اعتبار کوپن
 *               forPlans:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: لیست شناسه پلن‌های مجاز (خالی = همه پلن‌ها)
 *               forUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: لیست شناسه کاربران مجاز (خالی = همه کاربران)
 *               active:
 *                 type: boolean
 *                 description: وضعیت فعال بودن کوپن
 *     responses:
 *       "201":
 *         description: کوپن با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "400":
 *         description: اطلاعات نامعتبر یا کد تکراری
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 */
router
  .route("/")
  .get(auth, admin, couponController.getCoupons)
  .post(
    auth,
    admin,
    validate(couponValidation.createCoupon),
    couponController.createCoupon
  );

/**
 * @swagger
 * /coupons/{couponId}:
 *   get:
 *     summary: دریافت کوپن با شناسه (ادمین)
 *     description: فقط ادمین - دریافت اطلاعات کامل یک کوپن با شناسه
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کوپن
 *     responses:
 *       "200":
 *         description: اطلاعات کوپن
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کوپن یافت نشد
 */
/**
 * @swagger
 * /coupons/{couponId}:
 *   put:
 *     summary: به‌روزرسانی کوپن (ادمین)
 *     description: فقط ادمین - به‌روزرسانی اطلاعات یک کوپن
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کوپن
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: کد کوپن (به حروف بزرگ تبدیل می‌شود)
 *               description:
 *                 type: string
 *                 description: توضیحات کوپن
 *               percent:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 100
 *                 description: درصد تخفیف (1-100)
 *               maxAmount:
 *                 type: number
 *                 minimum: 0
 *                 description: حداکثر مبلغ تخفیف (به ریال)
 *               maxUsage:
 *                 type: number
 *                 minimum: 1
 *                 description: حداکثر تعداد استفاده مجاز
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: تاریخ شروع اعتبار کوپن
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: تاریخ پایان اعتبار کوپن
 *               forPlans:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: لیست شناسه پلن‌های مجاز (خالی = همه پلن‌ها)
 *               forUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: لیست شناسه کاربران مجاز (خالی = همه کاربران)
 *               active:
 *                 type: boolean
 *                 description: وضعیت فعال بودن کوپن
 *     responses:
 *       "200":
 *         description: کوپن با موفقیت به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "400":
 *         description: اطلاعات نامعتبر یا کد تکراری
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کوپن یافت نشد
 */
/**
 * @swagger
 * /coupons/{couponId}:
 *   delete:
 *     summary: غیرفعال‌سازی کوپن (ادمین)
 *     description: فقط ادمین - غیرفعال کردن کوپن (حذف نمی‌شود)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کوپن
 *     responses:
 *       "200":
 *         description: کوپن با موفقیت غیرفعال شد
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کوپن یافت نشد
 */
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
