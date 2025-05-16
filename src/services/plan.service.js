const httpStatus = require("http-status");
const { Plan } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * ایجاد پلن جدید
 * @param {Object} planBody - اطلاعات پلن
 * @returns {Promise<Plan>}
 */
const createPlan = async (planBody) => {
  return Plan.create(planBody);
};

/**
 * دریافت پلن با شناسه
 * @param {ObjectId} id - شناسه پلن
 * @returns {Promise<Plan>}
 */
const getPlanById = async (id) => {
  return Plan.findById(id);
};

/**
 * دریافت همه پلن‌ها
 * @param {Object} filter - فیلترهای جستجو
 * @param {Object} options - گزینه‌های دریافت
 * @returns {Promise<QueryResult>}
 */
const queryPlans = async (filter, options) => {
  const plans = await Plan.find(filter, null, options);
  return plans;
};

/**
 * دریافت پلن‌های فعال
 * @returns {Promise<Array>}
 */
const getActivePlans = async () => {
  return Plan.find({ active: true }).sort({ price: 1 });
};

/**
 * به‌روزرسانی پلن
 * @param {ObjectId} planId - شناسه پلن
 * @param {Object} updateBody - اطلاعات به‌روزرسانی
 * @returns {Promise<Plan>}
 */
const updatePlan = async (planId, updateBody) => {
  const plan = await getPlanById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "پلن یافت نشد");
  }

  Object.assign(plan, updateBody);
  await plan.save();
  return plan;
};

/**
 * حذف پلن
 * @param {ObjectId} planId - شناسه پلن
 * @returns {Promise<Plan>}
 */
const deletePlan = async (planId) => {
  const plan = await getPlanById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "پلن یافت نشد");
  }

  await plan.remove();
  return plan;
};

/**
 * فعال‌سازی یا غیرفعال‌سازی پلن
 * @param {ObjectId} planId - شناسه پلن
 * @param {boolean} active - وضعیت فعال‌سازی
 * @returns {Promise<Plan>}
 */
const togglePlanStatus = async (planId, active) => {
  const plan = await getPlanById(planId);
  if (!plan) {
    throw new ApiError(httpStatus.NOT_FOUND, "پلن یافت نشد");
  }

  plan.active = active;
  await plan.save();
  return plan;
};

module.exports = {
  createPlan,
  getPlanById,
  queryPlans,
  getActivePlans,
  updatePlan,
  deletePlan,
  togglePlanStatus,
};
