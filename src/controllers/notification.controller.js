const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const {
  notificationService,
  userService,
  planService,
} = require("../services");
const pick = require("../utils/pick");

/**
 * دریافت اطلاعیه‌های کاربر جاری
 * @swagger
 * /notifications/me:
 *   get:
 *     summary: دریافت اطلاعیه‌های کاربر جاری
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: read
 *         schema:
 *           type: boolean
 *         description: وضعیت خوانده شدن
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [expiry, payment, system, other]
 *         description: نوع اطلاعیه
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
 *         description: لیست اطلاعیه‌ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
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
 */
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

/**
 * علامت‌گذاری اطلاعیه به عنوان خوانده شده
 * @swagger
 * /notifications/{notificationId}/read:
 *   post:
 *     summary: علامت‌گذاری اطلاعیه به عنوان خوانده شده
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه اطلاعیه
 *     responses:
 *       "200":
 *         description: اطلاعیه با موفقیت خوانده شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "404":
 *         description: اطلاعیه یافت نشد
 */
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

/**
 * علامت‌گذاری همه اطلاعیه‌ها به عنوان خوانده شده
 * @swagger
 * /notifications/read-all:
 *   post:
 *     summary: علامت‌گذاری همه اطلاعیه‌ها به عنوان خوانده شده
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: همه اطلاعیه‌ها با موفقیت خوانده شدند
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 modifiedCount:
 *                   type: integer
 *       "401":
 *         description: دسترسی غیرمجاز
 */
const markAllAsRead = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  res.status(httpStatus.OK).send(result);
});

/**
 * دریافت همه اطلاعیه‌ها (ادمین)
 * @swagger
 * /notifications:
 *   get:
 *     summary: دریافت همه اطلاعیه‌ها
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Notifications]
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
 *         name: type
 *         schema:
 *           type: string
 *           enum: [expiry, payment, system, other]
 *         description: نوع اطلاعیه
 *       - in: query
 *         name: read
 *         schema:
 *           type: boolean
 *         description: وضعیت خوانده شدن
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
 *         description: لیست اطلاعیه‌ها
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notification'
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

/**
 * ارسال اطلاعیه (ادمین)
 * @swagger
 * /notifications/send:
 *   post:
 *     summary: ارسال اطلاعیه
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *               - type
 *             properties:
 *               userId:
 *                 type: string
 *                 description: شناسه کاربر (برای ارسال به یک کاربر خاص)
 *               planId:
 *                 type: string
 *                 description: شناسه پلن (برای ارسال به همه کاربران یک پلن)
 *               title:
 *                 type: string
 *                 description: عنوان اطلاعیه
 *               message:
 *                 type: string
 *                 description: متن اطلاعیه
 *               type:
 *                 type: string
 *                 enum: [expiry, payment, system, other]
 *                 description: نوع اطلاعیه
 *               metadata:
 *                 type: object
 *                 description: متادیتای اطلاعیه
 *               sendSms:
 *                 type: boolean
 *                 description: آیا پیامک هم ارسال شود؟
 *     responses:
 *       "200":
 *         description: اطلاعیه با موفقیت ارسال شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یا پلن یافت نشد
 */
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
