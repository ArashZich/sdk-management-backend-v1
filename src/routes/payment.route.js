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

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: ایجاد درخواست پرداخت (کاربر)
 *     description: برای کاربران عادی - ایجاد درخواست پرداخت برای خرید پلن و انتقال به درگاه پرداخت
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planId
 *             properties:
 *               planId:
 *                 type: string
 *                 description: شناسه پلن مورد نظر برای خرید
 *               couponCode:
 *                 type: string
 *                 description: کد تخفیف (اختیاری)
 *     responses:
 *       "200":
 *         description: درخواست پرداخت با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 paymentId:
 *                   type: string
 *                   description: شناسه پرداخت
 *                 paymentUrl:
 *                   type: string
 *                   description: آدرس انتقال به درگاه پرداخت
 *                 amount:
 *                   type: number
 *                   description: مبلغ اصلی (ریال)
 *                 discount:
 *                   type: number
 *                   description: مبلغ تخفیف (ریال)
 *                 finalAmount:
 *                   type: number
 *                   description: مبلغ نهایی پس از تخفیف (ریال)
 *       "400":
 *         description: اطلاعات نامعتبر یا کوپن نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "404":
 *         description: پلن یافت نشد
 */
/**
 * @swagger
 * /payments:
 *   get:
 *     summary: دریافت همه پرداخت‌ها (ادمین)
 *     description: فقط ادمین - دریافت لیست تمام پرداخت‌ها با امکان فیلتر
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       - in: query
 *         name: planId
 *         schema:
 *           type: string
 *         description: شناسه پلن
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, success, failed, canceled]
 *         description: وضعیت پرداخت
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
 *         description: لیست پرداخت‌ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: object
 *                       planId:
 *                         type: object
 *                       amount:
 *                         type: number
 *                       originalAmount:
 *                         type: number
 *                       status:
 *                         type: string
 *                         enum: [pending, success, failed, canceled]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
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
router
  .route("/")
  .post(
    auth,
    validate(paymentValidation.createPayment),
    paymentController.createPayment
  )
  .get(auth, admin, paymentController.getPayments);

/**
 * @swagger
 * /payments/callback:
 *   get:
 *     summary: بازگشت از درگاه پرداخت
 *     description: مسیر بازگشت از درگاه پرداخت و بررسی نتیجه تراکنش - این مسیر توسط درگاه پرداخت فراخوانی می‌شود
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: refid
 *         schema:
 *           type: string
 *         description: کد مرجع پرداخت
 *       - in: query
 *         name: clientrefid
 *         schema:
 *           type: string
 *         description: شناسه یکتای درخواست
 *     responses:
 *       "302":
 *         description: انتقال به صفحه نتیجه پرداخت
 */
router.route("/callback").get(paymentController.paymentCallback);

/**
 * @swagger
 * /payments/me:
 *   get:
 *     summary: دریافت پرداخت‌های کاربر جاری (کاربر)
 *     description: برای کاربران عادی - دریافت لیست پرداخت‌های کاربر با امکان فیلتر
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, success, failed, canceled]
 *         description: وضعیت پرداخت
 *     responses:
 *       "200":
 *         description: لیست پرداخت‌ها
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   planId:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   amount:
 *                     type: number
 *                     description: مبلغ نهایی (ریال)
 *                   originalAmount:
 *                     type: number
 *                     description: مبلغ اصلی قبل از تخفیف (ریال)
 *                   status:
 *                     type: string
 *                     enum: [pending, success, failed, canceled]
 *                   paymentRefId:
 *                     type: string
 *                     description: شناسه مرجع پرداخت
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       "401":
 *         description: دسترسی غیرمجاز
 */
router.route("/me").get(auth, paymentController.getMyPayments);

/**
 * @swagger
 * /payments/{paymentId}:
 *   get:
 *     summary: دریافت پرداخت با شناسه (کاربر/ادمین)
 *     description: برای کاربران عادی و ادمین - دریافت جزئیات یک پرداخت (هر کاربر فقط پرداخت‌های خود را می‌بیند)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه پرداخت
 *     responses:
 *       "200":
 *         description: اطلاعات پرداخت
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 planId:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 originalAmount:
 *                   type: number
 *                 clientRefId:
 *                   type: string
 *                 paymentCode:
 *                   type: string
 *                 paymentRefId:
 *                   type: string
 *                 cardNumber:
 *                   type: string
 *                 cardHashPan:
 *                   type: string
 *                 payedDate:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [pending, success, failed, canceled]
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: عدم دسترسی به پرداخت
 *       "404":
 *         description: پرداخت یافت نشد
 */
router
  .route("/:paymentId")
  .get(
    auth,
    validate(paymentValidation.getPayment),
    paymentController.getPayment
  );

/**
 * @swagger
 * /payments/{paymentId}/cancel:
 *   post:
 *     summary: لغو پرداخت (کاربر/ادمین)
 *     description: برای کاربران عادی و ادمین - لغو یک پرداخت در وضعیت در انتظار (هر کاربر فقط می‌تواند پرداخت‌های خود را لغو کند)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه پرداخت
 *     responses:
 *       "200":
 *         description: پرداخت با موفقیت لغو شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payment:
 *                   type: object
 *       "400":
 *         description: فقط پرداخت‌های در انتظار قابل لغو هستند
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: عدم دسترسی به پرداخت
 *       "404":
 *         description: پرداخت یافت نشد
 */
router
  .route("/:paymentId/cancel")
  .post(
    auth,
    validate(paymentValidation.cancelPayment),
    paymentController.cancelPayment
  );

module.exports = router;
