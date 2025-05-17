const express = require("express");
const validate = require("../middlewares/validate");
const { planValidation } = require("../validations");
const { planController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: مدیریت پلن‌ها
 */

/**
 * @swagger
 * /plans/public:
 *   get:
 *     summary: دریافت پلن‌های عمومی (عمومی)
 *     description: برای همه کاربران (حتی بدون ورود) - دریافت لیست پلن‌های فعال برای نمایش به کاربران
 *     tags: [Plans]
 *     responses:
 *       "200":
 *         description: لیست پلن‌های عمومی
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   duration:
 *                     type: number
 *                     description: مدت اعتبار (روز)
 *                   features:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: ویژگی‌های قابل نمایش
 *                   requestLimit:
 *                     type: object
 *                     properties:
 *                       monthly:
 *                         type: number
 *                       total:
 *                         type: number
 *                   specialOffer:
 *                     type: boolean
 *                     description: آیا پیشنهاد ویژه است
 */
router.route("/public").get(planController.getPublicPlans);

/**
 * @swagger
 * /plans:
 *   get:
 *     summary: دریافت همه پلن‌ها (ادمین)
 *     description: فقط ادمین - دریافت لیست همه پلن‌ها (فعال و غیرفعال) با امکان فیلتر
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: نام پلن
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: وضعیت فعال بودن
 *       - in: query
 *         name: specialOffer
 *         schema:
 *           type: boolean
 *         description: آیا پیشنهاد ویژه است
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
 *         description: لیست پلن‌ها
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   duration:
 *                     type: number
 *                   features:
 *                     type: array
 *                     items:
 *                       type: string
 *                   requestLimit:
 *                     type: object
 *                   defaultSdkFeatures:
 *                     type: object
 *                   active:
 *                     type: boolean
 *                   specialOffer:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 */
/**
 * @swagger
 * /plans:
 *   post:
 *     summary: ایجاد پلن جدید (ادمین)
 *     description: فقط ادمین - ایجاد پلن جدید در سیستم
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - duration
 *               - requestLimit
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام پلن
 *               description:
 *                 type: string
 *                 description: توضیحات پلن
 *               price:
 *                 type: number
 *                 description: قیمت پلن (ریال)
 *               duration:
 *                 type: number
 *                 description: مدت اعتبار (روز)
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: ویژگی‌های قابل نمایش
 *               allowedProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: محصولات مجاز (شناسه محصولات)
 *               requestLimit:
 *                 type: object
 *                 required:
 *                   - monthly
 *                 properties:
 *                   monthly:
 *                     type: number
 *                     description: محدودیت درخواست ماهانه (عدد -1 برای بی‌نهایت)
 *                   total:
 *                     type: number
 *                     description: محدودیت درخواست کل (اختیاری)
 *               defaultSdkFeatures:
 *                 type: object
 *                 description: ویژگی‌های پیش‌فرض SDK
 *                 properties:
 *                   features:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: ویژگی‌های فعال (lips, eyeshadow, ...)
 *                   patterns:
 *                     type: object
 *                     description: الگوهای مجاز برای هر ویژگی
 *                   mediaFeatures:
 *                     type: object
 *                     properties:
 *                       allowedSources:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: منابع مجاز (camera, image)
 *                       allowedViews:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: نماهای مجاز (single, multi, split)
 *                       comparisonModes:
 *                         type: array
 *                         items:
 *                           type: string
 *                         description: حالت‌های مقایسه (before-after, split)
 *               active:
 *                 type: boolean
 *                 default: true
 *                 description: وضعیت فعال بودن
 *               specialOffer:
 *                 type: boolean
 *                 default: false
 *                 description: آیا پیشنهاد ویژه است
 *     responses:
 *       "201":
 *         description: پلن با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 */
router
  .route("/")
  .get(auth, planController.getPlans)
  .post(
    auth,
    admin,
    validate(planValidation.createPlan),
    planController.createPlan
  );

/**
 * @swagger
 * /plans/{planId}:
 *   get:
 *     summary: دریافت پلن با شناسه (ادمین)
 *     description: فقط ادمین - دریافت جزئیات کامل یک پلن با شناسه
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه پلن
 *     responses:
 *       "200":
 *         description: اطلاعات پلن
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 duration:
 *                   type: number
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *                 allowedProducts:
 *                   type: array
 *                   items:
 *                     type: string
 *                 requestLimit:
 *                   type: object
 *                   properties:
 *                     monthly:
 *                       type: number
 *                     total:
 *                       type: number
 *                 defaultSdkFeatures:
 *                   type: object
 *                 active:
 *                   type: boolean
 *                 specialOffer:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: پلن یافت نشد
 */
/**
 * @swagger
 * /plans/{planId}:
 *   put:
 *     summary: به‌روزرسانی پلن (ادمین)
 *     description: فقط ادمین - به‌روزرسانی اطلاعات یک پلن
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه پلن
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام پلن
 *               description:
 *                 type: string
 *                 description: توضیحات پلن
 *               price:
 *                 type: number
 *                 description: قیمت پلن (ریال)
 *               duration:
 *                 type: number
 *                 description: مدت اعتبار (روز)
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: ویژگی‌های قابل نمایش
 *               allowedProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: محصولات مجاز (شناسه محصولات)
 *               requestLimit:
 *                 type: object
 *                 properties:
 *                   monthly:
 *                     type: number
 *                     description: محدودیت درخواست ماهانه
 *                   total:
 *                     type: number
 *                     description: محدودیت درخواست کل
 *               defaultSdkFeatures:
 *                 type: object
 *                 description: ویژگی‌های پیش‌فرض SDK
 *                 properties:
 *                   features:
 *                     type: array
 *                     items:
 *                       type: string
 *                   patterns:
 *                     type: object
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
 *               active:
 *                 type: boolean
 *                 description: وضعیت فعال بودن
 *               specialOffer:
 *                 type: boolean
 *                 description: آیا پیشنهاد ویژه است
 *     responses:
 *       "200":
 *         description: پلن با موفقیت به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: پلن یافت نشد
 */
/**
 * @swagger
 * /plans/{planId}:
 *   delete:
 *     summary: حذف پلن (ادمین)
 *     description: فقط ادمین - حذف کامل یک پلن از سیستم
 *     tags: [Plans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه پلن
 *     responses:
 *       "200":
 *         description: پلن با موفقیت حذف شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: پلن یافت نشد
 */
router
  .route("/:planId")
  .get(auth, validate(planValidation.getPlan), planController.getPlan)
  .put(
    auth,
    admin,
    validate(planValidation.updatePlan),
    planController.updatePlan
  )
  .delete(
    auth,
    admin,
    validate(planValidation.deletePlan),
    planController.deletePlan
  );

module.exports = router;
