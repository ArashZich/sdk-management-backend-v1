const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { packageService, userService, planService } = require("../services");
const pick = require("../utils/pick");

const getMyPackages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["status"]);
  const packages = await packageService.getUserPackages(req.user._id, filter);
  res.status(httpStatus.OK).send(packages);
});

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

const getPackages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["userId", "planId", "status"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "populate"]);

  // افزودن populate برای کاربر و پلن
  options.populate = "userId,planId";

  const packages = await packageService.queryPackages(filter, options);
  res.status(httpStatus.OK).send(packages);
});

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

const updateSdkFeatures = catchAsync(async (req, res) => {
  const updatedPackage = await packageService.updateSdkFeatures(
    req.params.packageId,
    req.body
  );
  res.status(httpStatus.OK).send(updatedPackage);
});

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

const suspendPackage = catchAsync(async (req, res) => {
  const suspendedPackage = await packageService.suspendPackage(
    req.params.packageId
  );
  res.status(httpStatus.OK).send({
    message: "بسته با موفقیت تعلیق شد",
    package: suspendedPackage,
  });
});

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
