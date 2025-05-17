const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { planService } = require("../services");
const pick = require("../utils/pick");

const getPublicPlans = catchAsync(async (req, res) => {
  const plans = await planService.getActivePlans();
  res.status(httpStatus.OK).send(plans);
});

const getPlans = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "active", "specialOffer"]);
  const options = pick(req.query, ["limit", "page", "sortBy"]);
  const plans = await planService.queryPlans(filter, options);
  res.status(httpStatus.OK).send(plans);
});

const getPlan = catchAsync(async (req, res) => {
  const plan = await planService.getPlanById(req.params.planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "پلن یافت نشد");
  }
  res.status(httpStatus.OK).send(plan);
});

const createPlan = catchAsync(async (req, res) => {
  const plan = await planService.createPlan(req.body);
  res.status(httpStatus.CREATED).send(plan);
});

const updatePlan = catchAsync(async (req, res) => {
  const plan = await planService.updatePlan(req.params.planId, req.body);
  res.status(httpStatus.OK).send(plan);
});

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
