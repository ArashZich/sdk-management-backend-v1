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

/**
 * @swagger
 * /notifications/me:
 *   get:
 *     summary: دریافت اطلاعیه‌های کاربر جاری (کاربر)
 *     description: برای کاربران عادی - دریافت لیست اطلاعیه‌های کاربر با امکان فیلتر
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: read
 *         schema:
 *           type: boolean
 *         description: وضعیت خوانده شدن
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [expiry, payment, system, other]
 *         description: نوع اطلاعیه
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
 *         description: لیست اطلاعیه‌ها
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
 *                       title:
 *                         type: string
 *                       message:
 *                         type: string
 *                       type:
 *                         type: string
 *                       read:
 *                         type: boolean
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
 */
router.route("/me").get(auth, notificationController.getMyNotifications);

/**
 * @swagger
 * /notifications/{notificationId}/read:
 *   post:
 *     summary: علامت‌گذاری اطلاعیه به عنوان خوانده شده (کاربر)
 *     description: برای کاربران عادی - تغییر وضعیت یک اطلاعیه به خوانده شده
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه اطلاعیه
 *     responses:
 *       "200":
 *         description: اطلاعیه با موفقیت خوانده شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 message:
 *                   type: string
 *                 type:
 *                   type: string
 *                 read:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "404":
 *         description: اطلاعیه یافت نشد
 */
router
  .route("/:notificationId/read")
  .post(
    auth,
    validate(notificationValidation.markAsRead),
    notificationController.markAsRead
  );

/**
 * @swagger
 * /notifications/read-all:
 *   post:
 *     summary: علامت‌گذاری همه اطلاعیه‌ها به عنوان خوانده شده (کاربر)
 *     description: برای کاربران عادی - تغییر وضعیت تمام اطلاعیه‌های کاربر به خوانده شده
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: همه اطلاعیه‌ها با موفقیت خوانده شدند
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 modifiedCount:
 *                   type: integer
 *                   description: تعداد اطلاعیه‌های به‌روزرسانی شده
 *       "401":
 *         description: دسترسی غیرمجاز
 */
router.route("/read-all").post(auth, notificationController.markAllAsRead);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: دریافت همه اطلاعیه‌ها (ادمین)
 *     description: فقط ادمین - دریافت لیست تمام اطلاعیه‌ها با امکان فیلتر
 *     tags: [Notifications]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [expiry, payment, system, other]
 *         description: نوع اطلاعیه
 *       - in: query
 *         name: read
 *         schema:
 *           type: boolean
 *         description: وضعیت خوانده شدن
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
 *         description: لیست اطلاعیه‌ها
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
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       planId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       title:
 *                         type: string
 *                       message:
 *                         type: string
 *                       type:
 *                         type: string
 *                       read:
 *                         type: boolean
 *                       metadata:
 *                         type: object
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
router.route("/").get(auth, admin, notificationController.getAllNotifications);

/**
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: ارسال اطلاعیه (ادمین)
 *     description: فقط ادمین - ارسال اطلاعیه به یک کاربر یا به همه کاربران یک پلن با امکان ارسال پیامک
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - type
 *             properties:
 *               userId:
 *                 type: string
 *                 description: شناسه کاربر (برای ارسال به یک کاربر خاص)
 *               planId:
 *                 type: string
 *                 description: شناسه پلن (برای ارسال به همه کاربران یک پلن)
 *               title:
 *                 type: string
 *                 description: عنوان اطلاعیه
 *               message:
 *                 type: string
 *                 description: متن اطلاعیه
 *               type:
 *                 type: string
 *                 enum: [expiry, payment, system, other]
 *                 description: نوع اطلاعیه
 *               metadata:
 *                 type: object
 *                 description: متادیتای اطلاعیه
 *               sendSms:
 *                 type: boolean
 *                 default: false
 *                 description: آیا پیامک هم ارسال شود؟
 *     responses:
 *       "200":
 *         description: اطلاعیه با موفقیت ارسال شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: پیام موفقیت
 *                 count:
 *                   type: integer
 *                   description: تعداد کاربرانی که اطلاعیه برای آنها ارسال شده
 *                 notification:
 *                   type: object
 *                   description: اطلاعیه ایجاد شده (فقط در حالت ارسال به یک کاربر)
 *       "400":
 *         description: اطلاعات نامعتبر یا فیلدهای ضروری وارد نشده
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یا پلن یافت نشد
 */
router
  .route("/send")
  .post(
    auth,
    admin,
    validate(notificationValidation.sendNotification),
    notificationController.sendNotification
  );

module.exports = router;
