const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { couponService, planService } = require("../services");
const pick = require("../utils/pick");

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

const getCoupons = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["code", "active"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "populate"]);

  // افزودن populate برای پلن‌ها و کاربران
  options.populate = "forPlans,forUsers";

  const coupons = await couponService.queryCoupons(filter, options);
  res.status(httpStatus.OK).send(coupons);
});

const getCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.getCouponById(req.params.couponId);
  if (!coupon) {
    throw new ApiError(httpStatus.NOT_FOUND, "کوپن یافت نشد");
  }

  res.status(httpStatus.OK).send(coupon);
});

const createCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  res.status(httpStatus.CREATED).send(coupon);
});

const updateCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.updateCoupon(
    req.params.couponId,
    req.body
  );
  res.status(httpStatus.OK).send(coupon);
});

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
