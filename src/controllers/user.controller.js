const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const pick = require("../utils/pick");

/**
 * دریافت پروفایل خود
 * @swagger
 * /users/me:
 *   get:
 *     summary: دریافت پروفایل خود
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: پروفایل کاربر
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
const getMe = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.user._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }
  res.status(httpStatus.OK).send(user);
});

/**
 * به‌روزرسانی پروفایل خود
 * @swagger
 * /users/me:
 *   put:
 *     summary: به‌روزرسانی پروفایل خود
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               company:
 *                 type: string
 *               userType:
 *                 type: string
 *                 enum: [real, legal]
 *               nationalId:
 *                 type: string
 *               notificationSettings:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: boolean
 *                   sms:
 *                     type: boolean
 *     responses:
 *       "200":
 *         description: پروفایل به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "400":
 *         description: اطلاعات نامعتبر
 */
const updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.user._id, req.body);
  res.status(httpStatus.OK).send(user);
});

/**
 * به‌روزرسانی دامنه‌های مجاز
 * @swagger
 * /users/me/domains:
 *   put:
 *     summary: به‌روزرسانی دامنه‌های مجاز
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - domains
 *             properties:
 *               domains:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       "200":
 *         description: دامنه‌ها به‌روزرسانی شدند
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
const updateAllowedDomains = catchAsync(async (req, res) => {
  const { domains } = req.body;
  const user = await userService.updateUserDomains(req.user._id, domains);
  res.status(httpStatus.OK).send(user);
});

/**
 * دریافت همه کاربران (ادمین)
 * @swagger
 * /users:
 *   get:
 *     summary: دریافت همه کاربران
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: نام کاربر
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: شماره تلفن
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: نقش کاربر
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
 *         description: لیست کاربران
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
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
const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "phone", "role"]);
  const options = pick(req.query, ["limit", "page", "sortBy", "populate"]);
  const users = await userService.queryUsers(filter, options);
  res.status(httpStatus.OK).send(users);
});

/**
 * دریافت کاربر با شناسه (ادمین)
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: دریافت کاربر با شناسه
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     responses:
 *       "200":
 *         description: اطلاعات کاربر
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یافت نشد
 */
const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "کاربر یافت نشد");
  }
  res.status(httpStatus.OK).send(user);
});

/**
 * ایجاد کاربر جدید (ادمین)
 * @swagger
 * /users:
 *   post:
 *     summary: ایجاد کاربر جدید
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Users]
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
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               company:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               userType:
 *                 type: string
 *                 enum: [real, legal]
 *               nationalId:
 *                 type: string
 *               allowedDomains:
 *                 type: array
 *                 items:
 *                   type: string
 *               notificationSettings:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: boolean
 *                   sms:
 *                     type: boolean
 *     responses:
 *       "201":
 *         description: کاربر با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 */
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

/**
 * به‌روزرسانی کاربر (ادمین)
 * @swagger
 * /users/{userId}:
 *   put:
 *     summary: به‌روزرسانی کاربر
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               company:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *               userType:
 *                 type: string
 *                 enum: [real, legal]
 *               nationalId:
 *                 type: string
 *               notificationSettings:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: boolean
 *                   sms:
 *                     type: boolean
 *     responses:
 *       "200":
 *         description: کاربر با موفقیت به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یافت نشد
 */
const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.userId, req.body);
  res.status(httpStatus.OK).send(user);
});

/**
 * به‌روزرسانی دامنه‌های مجاز کاربر (ادمین)
 * @swagger
 * /users/{userId}/domains:
 *   put:
 *     summary: به‌روزرسانی دامنه‌های مجاز کاربر
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - domains
 *             properties:
 *               domains:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       "200":
 *         description: دامنه‌ها با موفقیت به‌روزرسانی شدند
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یافت نشد
 */
const updateUserDomains = catchAsync(async (req, res) => {
  const { domains } = req.body;
  const user = await userService.updateUserDomains(req.params.userId, domains);
  res.status(httpStatus.OK).send(user);
});

/**
 * حذف کاربر (ادمین)
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: حذف کاربر
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *     responses:
 *       "200":
 *         description: کاربر با موفقیت حذف شد
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یافت نشد
 */
const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.userId);
  res.status(httpStatus.OK).send({ message: "کاربر با موفقیت حذف شد" });
});

module.exports = {
  getMe,
  updateMe,
  updateAllowedDomains,
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserDomains,
  deleteUser,
};
