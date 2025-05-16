const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { sdkService, tokenService, usageService } = require("../services");

/**
 * اعتبارسنجی توکن SDK
 * @swagger
 * /sdk/validate:
 *   post:
 *     summary: اعتبارسنجی توکن SDK
 *     tags: [SDK]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       "200":
 *         description: اطلاعات توکن SDK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                 isPremium:
 *                   type: boolean
 *                 projectType:
 *                   type: string
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *                 patterns:
 *                   type: object
 *                 mediaFeatures:
 *                   type: object
 *       "400":
 *         description: توکن نامعتبر است
 *       "403":
 *         description: دامنه مجاز نیست
 *       "404":
 *         description: کاربر یا بسته یافت نشد
 */
const validateToken = catchAsync(async (req, res) => {
  try {
    const { token } = req.body;

    const origin = req.headers.origin || req.headers.referer;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers["user-agent"];

    const validationResult = await sdkService.validateToken(
      token,
      origin,
      ipAddress,
      userAgent
    );

    res.status(httpStatus.OK).send(validationResult);
  } catch (error) {
    // در صورت خطا، پاسخ مناسب برمی‌گردانیم
    res.status(error.statusCode || httpStatus.BAD_REQUEST).json({
      isValid: false,
      message: error.message,
    });
  }
});

/**
 * دریافت محصولات برای SDK
 * @swagger
 * /sdk/products:
 *   get:
 *     summary: دریافت محصولات برای SDK
 *     tags: [SDK]
 *     security:
 *       - sdkAuth: []
 *     responses:
 *       "200":
 *         description: لیست محصولات
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       "401":
 *         description: توکن SDK نامعتبر است
 *       "403":
 *         description: محدودیت درخواست یا دامنه مجاز نیست
 */
const getProducts = catchAsync(async (req, res) => {
  const products = await sdkService.getProductsForSDK(
    req.sdkUser,
    req.sdkPackage,
    req.clientInfo.origin,
    req.clientInfo.ipAddress,
    req.clientInfo.userAgent
  );

  res.status(httpStatus.OK).send(products);
});

/**
 * دریافت محصول با uid برای SDK
 * @swagger
 * /sdk/products/{productUid}:
 *   get:
 *     summary: دریافت محصول با شناسه منحصر به فرد برای SDK
 *     tags: [SDK]
 *     security:
 *       - sdkAuth: []
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
 *               $ref: '#/components/schemas/Product'
 *       "401":
 *         description: توکن SDK نامعتبر است
 *       "403":
 *         description: محدودیت درخواست یا دامنه مجاز نیست
 *       "404":
 *         description: محصول یافت نشد
 */
const getProductForSDK = catchAsync(async (req, res) => {
  const product = await sdkService.getProductForSDK(
    req.sdkUser,
    req.sdkPackage,
    req.params.productUid,
    req.clientInfo.origin,
    req.clientInfo.ipAddress,
    req.clientInfo.userAgent
  );

  res.status(httpStatus.OK).send(product);
});

/**
 * درخواست اعمال آرایش
 * @swagger
 * /sdk/apply:
 *   post:
 *     summary: درخواست اعمال آرایش
 *     tags: [SDK]
 *     security:
 *       - sdkAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - makeupData
 *             properties:
 *               productUid:
 *                 type: string
 *               makeupData:
 *                 type: object
 *     responses:
 *       "200":
 *         description: درخواست اعمال آرایش با موفقیت ثبت شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       "401":
 *         description: توکن SDK نامعتبر است
 *       "403":
 *         description: محدودیت درخواست یا دامنه مجاز نیست
 *       "404":
 *         description: محصول یافت نشد
 */
const applyMakeup = catchAsync(async (req, res) => {
  const { productUid, makeupData } = req.body;

  const result = await sdkService.applyMakeup(
    req.sdkUser,
    req.sdkPackage,
    productUid,
    makeupData,
    req.clientInfo.origin,
    req.clientInfo.ipAddress,
    req.clientInfo.userAgent
  );

  res.status(httpStatus.OK).send(result);
});

/**
 * دریافت وضعیت SDK
 * @swagger
 * /sdk/status:
 *   get:
 *     summary: دریافت وضعیت SDK
 *     tags: [SDK]
 *     security:
 *       - sdkAuth: []
 *     responses:
 *       "200":
 *         description: اطلاعات وضعیت SDK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 packageId:
 *                   type: string
 *                 planId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                 features:
 *                   type: array
 *                   items:
 *                     type: string
 *                 isPremium:
 *                   type: boolean
 *                 projectType:
 *                   type: string
 *                 requestLimit:
 *                   type: object
 *                   properties:
 *                     monthly:
 *                       type: number
 *                     remaining:
 *                       type: number
 *                 usageStats:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     validate:
 *                       type: number
 *                     apply:
 *                       type: number
 *                     check:
 *                       type: number
 *                     other:
 *                       type: number
 *       "401":
 *         description: توکن SDK نامعتبر است
 *       "403":
 *         description: محدودیت درخواست یا دامنه مجاز نیست
 */
const getStatus = catchAsync(async (req, res) => {
  const status = await sdkService.getStatus(
    req.sdkUser,
    req.sdkPackage,
    req.clientInfo.origin,
    req.clientInfo.ipAddress,
    req.clientInfo.userAgent
  );

  res.status(httpStatus.OK).send(status);
});

module.exports = {
  validateToken,
  getProducts,
  getProductForSDK,
  applyMakeup,
  getStatus,
};
