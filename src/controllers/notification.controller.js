const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const {
  notificationService,
  userService,
  planService,
} = require("../services");
const pick = require("../utils/pick");

const getMyNotifications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["read", "type"]);
  filter.userId = req.user._id;

  const options = pick(req.query, ["limit", "page", "sortBy"]);
  options.sortBy = "createdAt:desc";

  const notifications = await notificationService.queryNotifications(
    filter,
    options
  );
  res.status(httpStatus.OK).send(notifications);
});

const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.params.notificationId,
    req.user._id
  );
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, "اطلاعیه یافت نشد");
  }
  res.status(httpStatus.OK).send(notification);
});

const markAllAsRead = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  res.status(httpStatus.OK).send(result);
});

const getAllNotifications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["userId", "planId", "type", "read"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "populate"]);

  // افزودن populate برای کاربر و پلن
  options.populate = "userId,planId";
  options.sortBy = "createdAt:desc";

  const notifications = await notificationService.queryNotifications(
    filter,
    options
  );
  res.status(httpStatus.OK).send(notifications);
});

const sendNotification = catchAsync(async (req, res) => {
  const { userId, planId, title, message, type, metadata, sendSms } = req.body;

  if (!userId && !planId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "باید یکی از فیلدهای userId یا planId را وارد کنید"
    );
  }

  let result;

  if (userId) {
    // بررسی وجود کاربر
    const user = await userService.getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
    }

    // ارسال اطلاعیه به کاربر خاص
    const notification = await notificationService.sendNotificationToUser(
      userId,
      title,
      message,
      type,
      metadata,
      sendSms
    );

    result = {
      message: "اطلاعیه با موفقیت به کاربر ارسال شد",
      notification,
      count: 1,
    };
  } else {
    // بررسی وجود پلن
    const plan = await planService.getPlanById(planId);
    if (!plan) {
      throw new ApiError(httpStatus.NOT_FOUND, "پلن یافت نشد");
    }

    // ارسال اطلاعیه به همه کاربران پلن
    const { count } = await notificationService.sendNotificationToPlanUsers(
      planId,
      title,
      message,
      type,
      metadata,
      sendSms
    );

    result = {
      message: `اطلاعیه با موفقیت به ${count} کاربر ارسال شد`,
      count,
    };
  }

  res.status(httpStatus.OK).send(result);
});

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getAllNotifications,
  sendNotification,
};
