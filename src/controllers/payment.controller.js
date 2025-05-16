const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const {
  paymentService,
  planService,
  packageService,
  couponService,
  userService,
} = require("../services");
const config = require("../config");
const { nanoid } = require("nanoid");
const payments = require("../config/payments");

/**
 * ایجاد درخواست پرداخت
 * @swagger
 * /payments:
 *   post:
 *     summary: ایجاد درخواست پرداخت
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
 *               couponCode:
 *                 type: string
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
 *                 paymentUrl:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 discount:
 *                   type: number
 *                 finalAmount:
 *                   type: number
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "404":
 *         description: پلن یافت نشد
 */
const createPayment = catchAsync(async (req, res) => {
  const { planId, couponCode } = req.body;
  const userId = req.user._id;

  // دریافت اطلاعات پلن
  const plan = await planService.getPlanById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "پلن یافت نشد");
  }

  if (!plan.active) {
    throw new ApiError(httpStatus.BAD_REQUEST, "این پلن در حال حاضر فعال نیست");
  }

  // محاسبه قیمت نهایی با اعمال کد تخفیف
  let finalAmount = plan.price;
  let discount = 0;
  let couponId = null;

  if (couponCode) {
    try {
      // بررسی اعتبار کوپن
      const { valid, coupon } = await couponService.validateCoupon(
        couponCode,
        userId,
        planId
      );

      if (valid) {
        discount = Math.min(
          Math.floor((plan.price * coupon.percent) / 100),
          coupon.maxAmount
        );
        finalAmount = plan.price - discount;
        couponId = coupon._id;
      }
    } catch (error) {
      // اگر کوپن معتبر نباشد، بدون تخفیف ادامه می‌دهیم
      console.error("خطا در اعمال کوپن:", error.message);
    }
  }

  // ایجاد شناسه یکتا برای پرداخت
  const clientRefId = `${userId.toString().substr(-4)}-${nanoid(8)}`;

  // ایجاد رکورد پرداخت در دیتابیس
  const payment = await paymentService.createPayment({
    userId,
    planId,
    amount: finalAmount,
    originalAmount: plan.price,
    couponId,
    clientRefId,
    status: "pending",
  });

  // ایجاد درخواست پرداخت در درگاه
  const paymentResult = await paymentService.createPaymentRequest({
    amount: payments.rialToToman(finalAmount), // تبدیل به تومان
    clientRefId,
    payerName: req.user.name,
    description: `خرید پلن ${plan.name}`,
  });

  if (!paymentResult.success) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `خطا در ایجاد درخواست پرداخت: ${paymentResult.message}`
    );
  }

  // به‌روزرسانی اطلاعات پرداخت
  await paymentService.updatePayment(payment._id, {
    paymentCode: paymentResult.code,
  });

  res.status(httpStatus.OK).send({
    paymentId: payment._id,
    paymentUrl: paymentResult.paymentUrl,
    amount: plan.price,
    discount,
    finalAmount,
  });
});

/**
 * بازگشت از درگاه پرداخت
 * @swagger
 * /payments/callback:
 *   get:
 *     summary: بازگشت از درگاه پرداخت
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
const paymentCallback = catchAsync(async (req, res) => {
  const { refid, clientrefid } = req.query;

  // دریافت اطلاعات پرداخت
  const payment = await paymentService.getPaymentByClientRefId(clientrefid);
  if (!payment) {
    return res.redirect(
      `${config.frontendUrl}/payment/result?status=failed&message=پرداخت یافت نشد`
    );
  }

  try {
    // بررسی وضعیت پرداخت
    if (refid) {
      // تأیید پرداخت در درگاه
      const verifyResult = await paymentService.verifyPayment(
        refid,
        payments.rialToToman(payment.amount)
      );

      if (verifyResult.success) {
        // به‌روزرسانی اطلاعات پرداخت
        const updatedPayment = await paymentService.updatePayment(payment._id, {
          status: "success",
          paymentRefId: refid,
          cardNumber: verifyResult.cardNumber,
          cardHashPan: verifyResult.cardHashPan,
          payedDate: new Date(),
        });

        // اگر کوپن استفاده شده، افزایش تعداد استفاده
        if (payment.couponId) {
          await couponService.incrementCouponUsage(payment.couponId);
        }

        // ایجاد بسته برای کاربر
        const user = await userService.getUserById(payment.userId);
        const plan = await planService.getPlanById(payment.planId);

        // تنظیم تاریخ‌ها
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + plan.duration);

        // ایجاد بسته
        await packageService.createPackage({
          userId: payment.userId,
          planId: payment.planId,
          paymentId: payment._id,
          startDate,
          endDate,
          sdkFeatures: plan.defaultSdkFeatures,
        });

        // هدایت به صفحه موفقیت
        return res.redirect(
          `${
            config.frontendUrl
          }/payment/result?status=success&refId=${refid}&planName=${encodeURIComponent(
            plan.name
          )}`
        );
      } else {
        // به‌روزرسانی وضعیت پرداخت به ناموفق
        await paymentService.updatePayment(payment._id, {
          status: "failed",
          paymentRefId: refid,
        });

        return res.redirect(
          `${config.frontendUrl}/payment/result?status=failed&message=پرداخت ناموفق بود`
        );
      }
    } else {
      // به‌روزرسانی وضعیت پرداخت به لغو شده
      await paymentService.updatePayment(payment._id, {
        status: "canceled",
      });

      return res.redirect(
        `${config.frontendUrl}/payment/result?status=canceled&message=پرداخت لغو شد`
      );
    }
  } catch (error) {
    console.error("خطا در پردازش بازگشت از درگاه:", error);

    // به‌روزرسانی وضعیت پرداخت به ناموفق
    await paymentService.updatePayment(payment._id, {
      status: "failed",
    });

    return res.redirect(
      `${
        config.frontendUrl
      }/payment/result?status=failed&message=${encodeURIComponent(
        error.message
      )}`
    );
  }
});

/**
 * دریافت پرداخت‌های کاربر جاری
 * @swagger
 * /payments/me:
 *   get:
 *     summary: دریافت پرداخت‌های کاربر جاری
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
 *                 $ref: '#/components/schemas/Payment'
 *       "401":
 *         description: دسترسی غیرمجاز
 */
const getMyPayments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status"]);
  filter.userId = req.user._id;

  const payments = await paymentService.queryPayments(filter, {
    populate: "planId",
  });
  res.status(httpStatus.OK).send(payments);
});

/**
 * دریافت پرداخت با شناسه
 * @swagger
 * /payments/{paymentId}:
 *   get:
 *     summary: دریافت پرداخت با شناسه
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
 *               $ref: '#/components/schemas/Payment'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: عدم دسترسی به پرداخت
 *       "404":
 *         description: پرداخت یافت نشد
 */
const getPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "پرداخت یافت نشد");
  }

  // بررسی مالکیت پرداخت
  if (
    payment.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "شما به این پرداخت دسترسی ندارید");
  }

  res.status(httpStatus.OK).send(payment);
});

/**
 * لغو پرداخت
 * @swagger
 * /payments/{paymentId}/cancel:
 *   post:
 *     summary: لغو پرداخت
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
 *               $ref: '#/components/schemas/Payment'
 *       "400":
 *         description: فقط پرداخت‌های در انتظار قابل لغو هستند
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: عدم دسترسی به پرداخت
 *       "404":
 *         description: پرداخت یافت نشد
 */
const cancelPayment = catchAsync(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "پرداخت یافت نشد");
  }

  // بررسی مالکیت پرداخت
  if (
    payment.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "شما به این پرداخت دسترسی ندارید");
  }

  // بررسی وضعیت پرداخت
  if (payment.status !== "pending") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "فقط پرداخت‌های در انتظار قابل لغو هستند"
    );
  }

  // لغو پرداخت
  const canceledPayment = await paymentService.updatePayment(payment._id, {
    status: "canceled",
  });

  res.status(httpStatus.OK).send({
    message: "پرداخت با موفقیت لغو شد",
    payment: canceledPayment,
  });
});

/**
 * دریافت همه پرداخت‌ها (ادمین)
 * @swagger
 * /payments:
 *   get:
 *     summary: دریافت همه پرداخت‌ها
 *     description: فقط توسط ادمین قابل دسترسی است.
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
 *                     $ref: '#/components/schemas/Payment'
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
const getPayments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["userId", "planId", "status"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "populate"]);

  // افزودن populate برای کاربر و پلن
  options.populate = "userId,planId,couponId";

  const payments = await paymentService.queryPayments(filter, options);
  res.status(httpStatus.OK).send(payments);
});

module.exports = {
  createPayment,
  paymentCallback,
  getMyPayments,
  getPayment,
  cancelPayment,
  getPayments,
};
