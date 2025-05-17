const express = require("express");
const validate = require("../middlewares/validate");
const { productValidation } = require("../validations");
const { productController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: مدیریت محصولات
 */

/**
 * @swagger
 * /products/me:
 *   get:
 *     summary: دریافت محصولات کاربر جاری (کاربر)
 *     description: برای کاربران عادی - دریافت لیست محصولات متعلق به کاربر با امکان فیلتر
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: وضعیت فعال بودن
 *     responses:
 *       "200":
 *         description: لیست محصولات
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
 *                   type:
 *                     type: string
 *                   code:
 *                     type: string
 *                   uid:
 *                     type: string
 *                   thumbnail:
 *                     type: string
 *                   patterns:
 *                     type: array
 *                     items:
 *                       type: object
 *                   colors:
 *                     type: array
 *                     items:
 *                       type: object
 *                   active:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       "401":
 *         description: دسترسی غیرمجاز
 */
router.route("/me").get(auth, productController.getMyProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: ایجاد محصول جدید (کاربر)
 *     description: برای کاربران عادی - ایجاد یک محصول جدید
 *     tags: [Products]
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
 *               - type
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام محصول
 *               description:
 *                 type: string
 *                 description: توضیحات محصول
 *               type:
 *                 type: string
 *                 description: نوع محصول (lips, eyeshadow, ...)
 *               code:
 *                 type: string
 *                 description: کد محصول (یکتا برای هر کاربر)
 *               thumbnail:
 *                 type: string
 *                 description: آدرس تصویر بندانگشتی
 *               patterns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - code
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: نام الگو
 *                     code:
 *                       type: string
 *                       description: کد الگو
 *                     imageUrl:
 *                       type: string
 *                       description: آدرس تصویر الگو
 *               colors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - hexCode
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: نام رنگ
 *                     hexCode:
 *                       type: string
 *                       description: کد هگزادسیمال رنگ
 *                     imageUrl:
 *                       type: string
 *                       description: آدرس تصویر رنگ
 *               active:
 *                 type: boolean
 *                 default: true
 *                 description: وضعیت فعال بودن
 *     responses:
 *       "201":
 *         description: محصول با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "400":
 *         description: اطلاعات نامعتبر یا کد تکراری
 *       "401":
 *         description: دسترسی غیرمجاز
 */
router
  .route("/")
  .post(
    auth,
    validate(productValidation.createProduct),
    productController.createProduct
  );

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: دریافت محصول با شناسه (کاربر)
 *     description: برای کاربران عادی - دریافت جزئیات یک محصول (هر کاربر فقط می‌تواند محصولات خود را ببیند)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه محصول
 *     responses:
 *       "200":
 *         description: اطلاعات محصول
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: string
 *                 code:
 *                   type: string
 *                 uid:
 *                   type: string
 *                 thumbnail:
 *                   type: string
 *                 patterns:
 *                   type: array
 *                   items:
 *                     type: object
 *                 colors:
 *                   type: array
 *                   items:
 *                     type: object
 *                 active:
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
 *         description: شما به این محصول دسترسی ندارید
 *       "404":
 *         description: محصول یافت نشد
 */
/**
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: به‌روزرسانی محصول (کاربر)
 *     description: برای کاربران عادی - به‌روزرسانی اطلاعات یک محصول (هر کاربر فقط می‌تواند محصولات خود را ویرایش کند)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه محصول
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام محصول
 *               description:
 *                 type: string
 *                 description: توضیحات محصول
 *               type:
 *                 type: string
 *                 description: نوع محصول (lips, eyeshadow, ...)
 *               code:
 *                 type: string
 *                 description: کد محصول (یکتا برای هر کاربر)
 *               thumbnail:
 *                 type: string
 *                 description: آدرس تصویر بندانگشتی
 *               patterns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - code
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: نام الگو
 *                     code:
 *                       type: string
 *                       description: کد الگو
 *                     imageUrl:
 *                       type: string
 *                       description: آدرس تصویر الگو
 *               colors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - hexCode
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: نام رنگ
 *                     hexCode:
 *                       type: string
 *                       description: کد هگزادسیمال رنگ
 *                     imageUrl:
 *                       type: string
 *                       description: آدرس تصویر رنگ
 *               active:
 *                 type: boolean
 *                 description: وضعیت فعال بودن
 *     responses:
 *       "200":
 *         description: محصول با موفقیت به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "400":
 *         description: اطلاعات نامعتبر یا کد تکراری
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: شما به این محصول دسترسی ندارید
 *       "404":
 *         description: محصول یافت نشد
 */
/**
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: حذف محصول (کاربر)
 *     description: برای کاربران عادی - حذف یک محصول (هر کاربر فقط می‌تواند محصولات خود را حذف کند)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه محصول
 *     responses:
 *       "200":
 *         description: محصول با موفقیت حذف شد
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
 *         description: شما به این محصول دسترسی ندارید
 *       "404":
 *         description: محصول یافت نشد
 */
router
  .route("/:productId")
  .get(
    auth,
    validate(productValidation.getProduct),
    productController.getProduct
  )
  .put(
    auth,
    validate(productValidation.updateProduct),
    productController.updateProduct
  )
  .delete(
    auth,
    validate(productValidation.deleteProduct),
    productController.deleteProduct
  );

/**
 * @swagger
 * /products/uid/{productUid}:
 *   get:
 *     summary: دریافت محصول با شناسه منحصر به فرد (کاربر)
 *     description: برای کاربران عادی - دریافت محصول با شناسه منحصر به فرد (هر کاربر فقط می‌تواند محصولات خود را ببیند)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productUid
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه منحصر به فرد محصول
 *     responses:
 *       "200":
 *         description: اطلاعات محصول
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
 *                 type:
 *                   type: string
 *                 code:
 *                   type: string
 *                 uid:
 *                   type: string
 *                 thumbnail:
 *                   type: string
 *                 patterns:
 *                   type: array
 *                   items:
 *                     type: object
 *                 colors:
 *                   type: array
 *                   items:
 *                     type: object
 *                 active:
 *                   type: boolean
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "404":
 *         description: محصول یافت نشد
 */
router.route("/uid/:productUid").get(auth, productController.getProductByUid);

/**
 * @swagger
 * /products/user/{userId}:
 *   get:
 *     summary: دریافت محصولات کاربر (ادمین)
 *     description: فقط ادمین - دریافت لیست محصولات یک کاربر مشخص
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: وضعیت فعال بودن
 *     responses:
 *       "200":
 *         description: لیست محصولات
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 */
/**
 * @swagger
 * /products/user/{userId}:
 *   post:
 *     summary: ایجاد محصول برای کاربر (ادمین)
 *     description: فقط ادمین - ایجاد محصول جدید برای یک کاربر مشخص
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 description: نام محصول
 *               description:
 *                 type: string
 *                 description: توضیحات محصول
 *               type:
 *                 type: string
 *                 description: نوع محصول (lips, eyeshadow, ...)
 *               code:
 *                 type: string
 *                 description: کد محصول (یکتا برای هر کاربر)
 *               thumbnail:
 *                 type: string
 *                 description: آدرس تصویر بندانگشتی
 *               patterns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - code
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: نام الگو
 *                     code:
 *                       type: string
 *                       description: کد الگو
 *                     imageUrl:
 *                       type: string
 *                       description: آدرس تصویر الگو
 *               colors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - hexCode
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: نام رنگ
 *                     hexCode:
 *                       type: string
 *                       description: کد هگزادسیمال رنگ
 *                     imageUrl:
 *                       type: string
 *                       description: آدرس تصویر رنگ
 *               active:
 *                 type: boolean
 *                 default: true
 *                 description: وضعیت فعال بودن
 *     responses:
 *       "201":
 *         description: محصول با موفقیت ایجاد شد
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
  .route("/user/:userId")
  .get(auth, admin, productController.getUserProducts)
  .post(
    auth,
    admin,
    validate(productValidation.createProduct),
    productController.createProductForUser
  );

/**
 * @swagger
 * /products/user/{userId}/{productId}:
 *   put:
 *     summary: به‌روزرسانی محصول کاربر (ادمین)
 *     description: فقط ادمین - به‌روزرسانی محصول یک کاربر مشخص
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه محصول
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               code:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               patterns:
 *                 type: array
 *                 items:
 *                   type: object
 *               colors:
 *                 type: array
 *                 items:
 *                   type: object
 *               active:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: محصول با موفقیت به‌روزرسانی شد
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
 *         description: محصول یا کاربر یافت نشد
 */
/**
 * @swagger
 * /products/user/{userId}/{productId}:
 *   delete:
 *     summary: حذف محصول کاربر (ادمین)
 *     description: فقط ادمین - حذف محصول یک کاربر مشخص
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه محصول
 *     responses:
 *       "200":
 *         description: محصول با موفقیت حذف شد
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
 *         description: محصول یا کاربر یافت نشد
 */
router
  .route("/user/:userId/:productId")
  .put(
    auth,
    admin,
    validate(productValidation.updateProduct),
    productController.updateUserProduct
  )
  .delete(
    auth,
    admin,
    validate(productValidation.deleteProduct),
    productController.deleteUserProduct
  );

module.exports = router;
