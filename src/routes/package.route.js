const express = require("express");
const validate = require("../middlewares/validate");
const { packageValidation } = require("../validations");
const { packageController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: مدیریت بسته‌ها
 */

/**
 * @swagger
 * /packages/me:
 *   get:
 *     summary: دریافت بسته‌های کاربر جاری (کاربر)
 *     description: برای کاربران عادی - دریافت لیست بسته‌های فعال و تاریخچه بسته‌های کاربر
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, expired, suspended]
 *         description: وضعیت بسته
 *     responses:
 *       "200":
 *         description: لیست بسته‌ها
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
 *                       price:
 *                         type: number
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   endDate:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                     enum: [active, expired, suspended]
 *                   sdkFeatures:
 *                     type: object
 *                   requestLimit:
 *                     type: object
 *                     properties:
 *                       monthly:
 *                         type: number
 *                       remaining:
 *                         type: number
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       "401":
 *         description: دسترسی غیرمجاز
 */
router.route("/me").get(auth, packageController.getMyPackages);

/**
 * @swagger
 * /packages/{packageId}:
 *   get:
 *     summary: دریافت بسته با شناسه (کاربر/ادمین)
 *     description: برای کاربران عادی و ادمین - دریافت جزئیات کامل یک بسته با شناسه (هر کاربر فقط بسته‌های خود را می‌بیند)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه بسته
 *     responses:
 *       "200":
 *         description: اطلاعات بسته
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     email:
 *                       type: string
 *                 planId:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     duration:
 *                       type: number
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 token:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [active, expired, suspended]
 *                 sdkFeatures:
 *                   type: object
 *                 requestLimit:
 *                   type: object
 *                   properties:
 *                     monthly:
 *                       type: number
 *                     remaining:
 *                       type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: عدم دسترسی به بسته
 *       "404":
 *         description: بسته یافت نشد
 */
router
  .route("/:packageId")
  .get(
    auth,
    validate(packageValidation.getPackage),
    packageController.getPackage
  );

/**
 * @swagger
 * /packages:
 *   get:
 *     summary: دریافت همه بسته‌ها (ادمین)
 *     description: فقط ادمین - دریافت لیست تمام بسته‌ها با امکان فیلتر
 *     tags: [Packages]
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
 *           enum: [active, expired, suspended]
 *         description: وضعیت بسته
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
 *         description: لیست بسته‌ها
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
 * /packages:
 *   post:
 *     summary: ایجاد بسته بدون پرداخت (ادمین)
 *     description: فقط ادمین - ایجاد بسته به صورت دستی بدون نیاز به پرداخت
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - planId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: شناسه کاربر
 *               planId:
 *                 type: string
 *                 description: شناسه پلن
 *               duration:
 *                 type: number
 *                 description: مدت اعتبار (روز) - اگر وارد نشود از مدت پلن استفاده می‌شود
 *               sdkFeatures:
 *                 type: object
 *                 description: ویژگی‌های سفارشی SDK - اگر وارد نشود از ویژگی‌های پیش‌فرض پلن استفاده می‌شود
 *                 properties:
 *                   features:
 *                     type: array
 *                     items:
 *                       type: string
 *                   patterns:
 *                     type: object
 *                   isPremium:
 *                     type: boolean
 *                   projectType:
 *                     type: string
 *                   mediaFeatures:
 *                     type: object
 *                     properties:
 *                       allowedSources:
 *                         type: array
 *                         items:
 *                           type: string
 *                       allowedViews:
 *                         type: array
 *                         items:
 *                           type: string
 *                       comparisonModes:
 *                         type: array
 *                         items:
 *                           type: string
 *     responses:
 *       "201":
 *         description: بسته با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 package:
 *                   type: object
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یا پلن یافت نشد
 */
router
  .route("/")
  .get(auth, admin, packageController.getPackages)
  .post(
    auth,
    admin,
    validate(packageValidation.createManualPackage),
    packageController.createManualPackage
  );

/**
 * @swagger
 * /packages/{packageId}/sdk-features:
 *   put:
 *     summary: به‌روزرسانی ویژگی‌های SDK بسته (ادمین)
 *     description: فقط ادمین - تغییر ویژگی‌های SDK بسته و صدور توکن جدید
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه بسته
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: لیست ویژگی‌های SDK (مانند lips, eyeshadow, eyepencil)
 *               patterns:
 *                 type: object
 *                 description: الگوهای مجاز برای هر ویژگی
 *               isPremium:
 *                 type: boolean
 *                 description: آیا بسته پریمیوم است
 *               projectType:
 *                 type: string
 *                 description: نوع پروژه (standard, professional)
 *               mediaFeatures:
 *                 type: object
 *                 properties:
 *                   allowedSources:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: منابع مجاز (camera, image)
 *                   allowedViews:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: نماهای مجاز (single, multi, split)
 *                   comparisonModes:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: حالت‌های مقایسه (before-after, split)
 *     responses:
 *       "200":
 *         description: ویژگی‌های SDK با موفقیت به‌روزرسانی شدند
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: بسته یافت نشد
 */
router
  .route("/:packageId/sdk-features")
  .put(
    auth,
    admin,
    validate(packageValidation.updateSdkFeatures),
    packageController.updateSdkFeatures
  );

/**
 * @swagger
 * /packages/{packageId}/extend:
 *   post:
 *     summary: تمدید بسته (ادمین)
 *     description: فقط ادمین - تمدید مدت زمان یک بسته به صورت دستی
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه بسته
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - days
 *             properties:
 *               days:
 *                 type: number
 *                 minimum: 1
 *                 description: تعداد روزهای تمدید
 *     responses:
 *       "200":
 *         description: بسته با موفقیت تمدید شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 package:
 *                   type: object
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: بسته یافت نشد
 */
router
  .route("/:packageId/extend")
  .post(
    auth,
    admin,
    validate(packageValidation.extendPackage),
    packageController.extendPackage
  );

/**
 * @swagger
 * /packages/{packageId}/suspend:
 *   post:
 *     summary: تعلیق بسته (ادمین)
 *     description: فقط ادمین - تعلیق یک بسته فعال (غیرفعال کردن موقت)
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه بسته
 *     responses:
 *       "200":
 *         description: بسته با موفقیت تعلیق شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 package:
 *                   type: object
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: بسته یافت نشد
 */
router
  .route("/:packageId/suspend")
  .post(
    auth,
    admin,
    validate(packageValidation.suspendPackage),
    packageController.suspendPackage
  );

/**
 * @swagger
 * /packages/{packageId}/reactivate:
 *   post:
 *     summary: فعال‌سازی مجدد بسته (ادمین)
 *     description: فقط ادمین - فعال‌سازی مجدد یک بسته تعلیق شده
 *     tags: [Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: packageId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه بسته
 *     responses:
 *       "200":
 *         description: بسته با موفقیت فعال شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 package:
 *                   type: object
 *       "400":
 *         description: بسته منقضی شده و قابل فعال‌سازی نیست
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: بسته یافت نشد
 */
router
  .route("/:packageId/reactivate")
  .post(
    auth,
    admin,
    validate(packageValidation.reactivatePackage),
    packageController.reactivatePackage
  );

module.exports = router;
