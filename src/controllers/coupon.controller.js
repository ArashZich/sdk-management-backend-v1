const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { couponService, planService } = require("../services");
const pick = require("../utils/pick");

/**
 * بررسی اعتبار کوپن
 * @swagger
 * /coupons/validate:
 *   post:
 *     summary: بررسی اعتبار کوپن
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
 *                   $ref: '#/components/schemas/Coupon'
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
const validateCoupon = catchAsync(async (req, res) => {
  const { code, planId } = req.body;
  const userId = req.user._id;

  // دریافت اطلاعات پلن
  const plan = await planService.getPlanById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "پلن یافت نشد");
  }

  // بررسی اعتبار کوپن
  const { valid, coupon } = await couponService.validateCoupon(
    code,
    userId,
    planId
  );

  if (!valid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "کوپن نامعتبر است");
  }

  // محاسبه مبلغ تخفیف
  const discountAmount = Math.min(
    Math.floor((plan.price * coupon.percent) / 100),
    coupon.maxAmount
  );
  const finalPrice = plan.price - discountAmount;

  res.status(httpStatus.OK).send({
    valid: true,
    coupon,
    discountAmount,
    finalPrice,
  });
});

/**
 * دریافت همه کوپن‌ها (ادمین)
 * @swagger
 * /coupons:
 *   get:
 *     summary: دریافت همه کوپن‌ها
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *                     $ref: '#/components/schemas/Coupon'
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
const getCoupons = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["code", "active"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "populate"]);

  // افزودن populate برای پلن‌ها و کاربران
  options.populate = "forPlans,forUsers";

  const coupons = await couponService.queryCoupons(filter, options);
  res.status(httpStatus.OK).send(coupons);
});

/**
 * دریافت کوپن با شناسه (ادمین)
 * @swagger
 * /coupons/{couponId}:
 *   get:
 *     summary: دریافت کوپن با شناسه
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *               $ref: '#/components/schemas/Coupon'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کوپن یافت نشد
 */
const getCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.getCouponById(req.params.couponId);
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "کوپن یافت نشد");
  }

  res.status(httpStatus.OK).send(coupon);
});

/**
 * ایجاد کوپن جدید (ادمین)
 * @swagger
 * /coupons:
 *   post:
 *     summary: ایجاد کوپن جدید
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *               description:
 *                 type: string
 *               percent:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 100
 *               maxAmount:
 *                 type: number
 *                 minimum: 0
 *               maxUsage:
 *                 type: number
 *                 minimum: 1
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               forPlans:
 *                 type: array
 *                 items:
 *                   type: string
 *               forUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       "201":
 *         description: کوپن با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 */
const createCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  res.status(httpStatus.CREATED).send(coupon);
});

/**
 * به‌روزرسانی کوپن (ادمین)
 * @swagger
 * /coupons/{couponId}:
 *   put:
 *     summary: به‌روزرسانی کوپن
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *               description:
 *                 type: string
 *               percent:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 100
 *               maxAmount:
 *                 type: number
 *                 minimum: 0
 *               maxUsage:
 *                 type: number
 *                 minimum: 1
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               forPlans:
 *                 type: array
 *                 items:
 *                   type: string
 *               forUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: کوپن با موفقیت به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Coupon'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کوپن یافت نشد
 */
const updateCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.updateCoupon(
    req.params.couponId,
    req.body
  );
  res.status(httpStatus.OK).send(coupon);
});

/**
 * غیرفعال‌سازی کوپن (ادمین)
 * @swagger
 * /coupons/{couponId}:
 *   delete:
 *     summary: غیرفعال‌سازی کوپن
 *     description: فقط توسط ادمین قابل دسترسی
 * *     description: فقط توسط ادمین قابل دسترسی است.
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
const deactivateCoupon = catchAsync(async (req, res) => {
  await couponService.deactivateCoupon(req.params.couponId);
  res.status(httpStatus.OK).send({ message: "کوپن با موفقیت غیرفعال شد" });
});

module.exports = {
  validateCoupon,
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deactivateCoupon,
};
