const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { planService } = require("../services");
const pick = require("../utils/pick");

/**
 * دریافت پلن‌های عمومی
 * @swagger
 * /plans/public:
 *   get:
 *     summary: دریافت پلن‌های عمومی
 *     description: دریافت لیست پلن‌های فعال برای نمایش به کاربران
 *     tags: [Plans]
 *     responses:
 *       "200":
 *         description: لیست پلن‌های عمومی
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 */
const getPublicPlans = catchAsync(async (req, res) => {
  const plans = await planService.getActivePlans();
  res.status(httpStatus.OK).send(plans);
});

/**
 * دریافت همه پلن‌ها
 * @swagger
 * /plans:
 *   get:
 *     summary: دریافت همه پلن‌ها
 *     description: دریافت لیست همه پلن‌ها (فعال و غیرفعال)
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
 *                 $ref: '#/components/schemas/Plan'
 *       "401":
 *         description: دسترسی غیرمجاز
 */
const getPlans = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "active", "specialOffer"]);
  const options = pick(req.query, ["limit", "page", "sortBy"]);
  const plans = await planService.queryPlans(filter, options);
  res.status(httpStatus.OK).send(plans);
});

/**
 * دریافت پلن با شناسه
 * @swagger
 * /plans/{planId}:
 *   get:
 *     summary: دریافت پلن با شناسه
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
 *               $ref: '#/components/schemas/Plan'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "404":
 *         description: پلن یافت نشد
 */
const getPlan = catchAsync(async (req, res) => {
  const plan = await planService.getPlanById(req.params.planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "پلن یافت نشد");
  }
  res.status(httpStatus.OK).send(plan);
});

/**
 * ایجاد پلن جدید (ادمین)
 * @swagger
 * /plans:
 *   post:
 *     summary: ایجاد پلن جدید
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: number
 *                 description: تعداد روز
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               allowedProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *               requestLimit:
 *                 type: object
 *                 properties:
 *                   monthly:
 *                     type: number
 *                   total:
 *                     type: number
 *               defaultSdkFeatures:
 *                 type: object
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
 *               specialOffer:
 *                 type: boolean
 *     responses:
 *       "201":
 *         description: پلن با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 */
const createPlan = catchAsync(async (req, res) => {
  const plan = await planService.createPlan(req.body);
  res.status(httpStatus.CREATED).send(plan);
});

/**
 * به‌روزرسانی پلن (ادمین)
 * @swagger
 * /plans/{planId}:
 *   put:
 *     summary: به‌روزرسانی پلن
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               duration:
 *                 type: number
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *               allowedProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *               requestLimit:
 *                 type: object
 *                 properties:
 *                   monthly:
 *                     type: number
 *                   total:
 *                     type: number
 *               defaultSdkFeatures:
 *                 type: object
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
 *               specialOffer:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: پلن با موفقیت به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plan'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: پلن یافت نشد
 */
const updatePlan = catchAsync(async (req, res) => {
  const plan = await planService.updatePlan(req.params.planId, req.body);
  res.status(httpStatus.OK).send(plan);
});

/**
 * حذف پلن (ادمین)
 * @swagger
 * /plans/{planId}:
 *   delete:
 *     summary: حذف پلن
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: پلن یافت نشد
 */
const deletePlan = catchAsync(async (req, res) => {
  await planService.deletePlan(req.params.planId);
  res.status(httpStatus.OK).send({ message: "پلن با موفقیت حذف شد" });
});

module.exports = {
  getPublicPlans,
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
};
