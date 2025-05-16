const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { packageService, userService, planService } = require("../services");
const pick = require("../utils/pick");

/**
 * دریافت بسته‌های کاربر جاری
 * @swagger
 * /packages/me:
 *   get:
 *     summary: دریافت بسته‌های کاربر جاری
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
 *                 $ref: '#/components/schemas/Package'
 *       "401":
 *         description: دسترسی غیرمجاز
 */
const getMyPackages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status"]);
  const packages = await packageService.getUserPackages(req.user._id, filter);
  res.status(httpStatus.OK).send(packages);
});

/**
 * دریافت بسته با شناسه
 * @swagger
 * /packages/{packageId}:
 *   get:
 *     summary: دریافت بسته با شناسه
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
 *               $ref: '#/components/schemas/Package'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: عدم دسترسی به بسته
 *       "404":
 *         description: بسته یافت نشد
 */
const getPackage = catchAsync(async (req, res) => {
  const pkg = await packageService.getPackageById(req.params.packageId);
  if (!pkg) {
    throw new ApiError(httpStatus.NOT_FOUND, "بسته یافت نشد");
  }

  // بررسی مالکیت بسته
  if (
    pkg.userId._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "شما به این بسته دسترسی ندارید");
  }

  res.status(httpStatus.OK).send(pkg);
});

/**
 * دریافت همه بسته‌ها (ادمین)
 * @swagger
 * /packages:
 *   get:
 *     summary: دریافت همه بسته‌ها
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *                     $ref: '#/components/schemas/Package'
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
const getPackages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["userId", "planId", "status"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "populate"]);

  // افزودن populate برای کاربر و پلن
  options.populate = "userId,planId";

  const packages = await packageService.queryPackages(filter, options);
  res.status(httpStatus.OK).send(packages);
});

/**
 * ایجاد بسته بدون پرداخت (توسط ادمین)
 * @swagger
 * /packages:
 *   post:
 *     summary: ایجاد بسته بدون پرداخت
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *                 description: مدت اعتبار (روز)
 *               sdkFeatures:
 *                 type: object
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
 *               $ref: '#/components/schemas/Package'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یا پلن یافت نشد
 */
const createManualPackage = catchAsync(async (req, res) => {
  const { userId, planId, duration, sdkFeatures } = req.body;

  // بررسی وجود کاربر
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }

  // بررسی وجود پلن
  const plan = await planService.getPlanById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "پلن یافت نشد");
  }

  // تنظیم تاریخ‌ها
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (duration || plan.duration));

  // ایجاد بسته
  const packageData = {
    userId,
    planId,
    startDate,
    endDate,
    sdkFeatures,
  };

  const newPackage = await packageService.createPackage(packageData);

  res.status(httpStatus.CREATED).send({
    message: "بسته با موفقیت ایجاد شد",
    package: newPackage,
  });
});

/**
 * به‌روزرسانی ویژگی‌های SDK بسته (ادمین)
 * @swagger
 * /packages/{packageId}/sdk-features:
 *   put:
 *     summary: به‌روزرسانی ویژگی‌های SDK بسته
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *               patterns:
 *                 type: object
 *               isPremium:
 *                 type: boolean
 *               projectType:
 *                 type: string
 *               mediaFeatures:
 *                 type: object
 *                 properties:
 *                   allowedSources:
 *                     type: array
 *                     items:
 *                       type: string
 *                   allowedViews:
 *                     type: array
 *                     items:
 *                       type: string
 *                   comparisonModes:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       "200":
 *         description: ویژگی‌های SDK با موفقیت به‌روزرسانی شدند
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: بسته یافت نشد
 */
const updateSdkFeatures = catchAsync(async (req, res) => {
  const updatedPackage = await packageService.updateSdkFeatures(
    req.params.packageId,
    req.body
  );
  res.status(httpStatus.OK).send(updatedPackage);
});

/**
 * تمدید بسته (ادمین)
 * @swagger
 * /packages/{packageId}/extend:
 *   post:
 *     summary: تمدید بسته
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *                 description: تعداد روزهای تمدید
 *     responses:
 *       "200":
 *         description: بسته با موفقیت تمدید شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Package'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: بسته یافت نشد
 */
const extendPackage = catchAsync(async (req, res) => {
  const { days } = req.body;
  const extendedPackage = await packageService.extendPackage(
    req.params.packageId,
    days
  );
  res.status(httpStatus.OK).send({
    message: `بسته با موفقیت به مدت ${days} روز تمدید شد`,
    package: extendedPackage,
  });
});

/**
 * تعلیق بسته (ادمین)
 * @swagger
 * /packages/{packageId}/suspend:
 *   post:
 *     summary: تعلیق بسته
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *               $ref: '#/components/schemas/Package'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: بسته یافت نشد
 */
const suspendPackage = catchAsync(async (req, res) => {
  const suspendedPackage = await packageService.suspendPackage(
    req.params.packageId
  );
  res.status(httpStatus.OK).send({
    message: "بسته با موفقیت تعلیق شد",
    package: suspendedPackage,
  });
});

/**
 * فعال‌سازی مجدد بسته (ادمین)
 * @swagger
 * /packages/{packageId}/reactivate:
 *   post:
 *     summary: فعال‌سازی مجدد بسته
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *               $ref: '#/components/schemas/Package'
 *       "400":
 *         description: بسته منقضی شده و قابل فعال‌سازی نیست
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: بسته یافت نشد
 */
const reactivatePackage = catchAsync(async (req, res) => {
  const reactivatedPackage = await packageService.reactivatePackage(
    req.params.packageId
  );
  res.status(httpStatus.OK).send({
    message: "بسته با موفقیت فعال شد",
    package: reactivatedPackage,
  });
});

module.exports = {
  getMyPackages,
  getPackage,
  getPackages,
  createManualPackage,
  updateSdkFeatures,
  extendPackage,
  suspendPackage,
  reactivatePackage,
};
