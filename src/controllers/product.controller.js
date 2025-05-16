const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { productService } = require("../services");
const pick = require("../utils/pick");

/**
 * دریافت محصولات کاربر جاری
 * @swagger
 * /products/me:
 *   get:
 *     summary: دریافت محصولات کاربر جاری
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: وضعیت فعال بودن
 *     responses:
 *       "200":
 *         description: لیست محصولات
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       "401":
 *         description: دسترسی غیرمجاز
 */
const getMyProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["active"]);
  const products = await productService.getUserProducts(req.user._id, filter);
  res.status(httpStatus.OK).send(products);
});

/**
 * ایجاد محصول جدید
 * @swagger
 * /products:
 *   post:
 *     summary: ایجاد محصول جدید
 *     tags: [Products]
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
 *               - type
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               code:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               patterns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               colors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     hexCode:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       "201":
 *         description: محصول با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 */
const createProduct = catchAsync(async (req, res) => {
  const productData = {
    ...req.body,
    userId: req.user._id,
  };
  const product = await productService.createProduct(productData);
  res.status(httpStatus.CREATED).send(product);
});

/**
 * دریافت محصول با شناسه
 * @swagger
 * /products/{productId}:
 *   get:
 *     summary: دریافت محصول با شناسه
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه محصول
 *     responses:
 *       "200":
 *         description: اطلاعات محصول
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "404":
 *         description: محصول یافت نشد
 */
const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "محصول یافت نشد");
  }

  // بررسی مالکیت محصول
  if (
    product.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "شما به این محصول دسترسی ندارید");
  }

  res.status(httpStatus.OK).send(product);
});

/**
 * دریافت محصول با uid
 * @swagger
 * /products/uid/{productUid}:
 *   get:
 *     summary: دریافت محصول با شناسه منحصر به فرد
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productUid
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه منحصر به فرد محصول
 *     responses:
 *       "200":
 *         description: اطلاعات محصول
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "404":
 *         description: محصول یافت نشد
 */
const getProductByUid = catchAsync(async (req, res) => {
  const product = await productService.getUserProductByUid(
    req.params.productUid,
    req.user._id
  );
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "محصول یافت نشد");
  }
  res.status(httpStatus.OK).send(product);
});

/**
 * به‌روزرسانی محصول
 * @swagger
 * /products/{productId}:
 *   put:
 *     summary: به‌روزرسانی محصول
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه محصول
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
 *               type:
 *                 type: string
 *               code:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               patterns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               colors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     hexCode:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: محصول با موفقیت به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: شما به این محصول دسترسی ندارید
 *       "404":
 *         description: محصول یافت نشد
 */
const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "محصول یافت نشد");
  }

  // بررسی مالکیت محصول
  if (
    product.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "شما به این محصول دسترسی ندارید");
  }

  const updatedProduct = await productService.updateProduct(
    req.params.productId,
    req.body
  );
  res.status(httpStatus.OK).send(updatedProduct);
});

/**
 * حذف محصول
 * @swagger
 * /products/{productId}:
 *   delete:
 *     summary: حذف محصول
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه محصول
 *     responses:
 *       "200":
 *         description: محصول با موفقیت حذف شد
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: شما به این محصول دسترسی ندارید
 *       "404":
 *         description: محصول یافت نشد
 */
const deleteProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "محصول یافت نشد");
  }

  // بررسی مالکیت محصول
  if (
    product.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, "شما به این محصول دسترسی ندارید");
  }

  await productService.deleteProduct(req.params.productId);
  res.status(httpStatus.OK).send({ message: "محصول با موفقیت حذف شد" });
});

/**
 * دریافت محصولات کاربر (ادمین)
 * @swagger
 * /products/user/{userId}:
 *   get:
 *     summary: دریافت محصولات کاربر
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: وضعیت فعال بودن
 *     responses:
 *       "200":
 *         description: لیست محصولات
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یافت نشد
 */
const getUserProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["active"]);
  const products = await productService.getUserProducts(
    req.params.userId,
    filter
  );
  res.status(httpStatus.OK).send(products);
});

/**
 * ایجاد محصول برای کاربر (ادمین)
 * @swagger
 * /products/user/{userId}:
 *   post:
 *     summary: ایجاد محصول برای کاربر
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Products]
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
 *               - name
 *               - type
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               code:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               patterns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               colors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     hexCode:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       "201":
 *         description: محصول با موفقیت ایجاد شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: کاربر یافت نشد
 */
const createProductForUser = catchAsync(async (req, res) => {
  const productData = {
    ...req.body,
    userId: req.params.userId,
  };
  const product = await productService.createProduct(productData);
  res.status(httpStatus.CREATED).send(product);
});

/**
 * به‌روزرسانی محصول کاربر (ادمین)
 * @swagger
 * /products/user/{userId}/{productId}:
 *   put:
 *     summary: به‌روزرسانی محصول کاربر
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه محصول
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
 *               type:
 *                 type: string
 *               code:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               patterns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               colors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     hexCode:
 *                       type: string
 *                     imageUrl:
 *                       type: string
 *               active:
 *                 type: boolean
 *     responses:
 *       "200":
 *         description: محصول با موفقیت به‌روزرسانی شد
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       "400":
 *         description: اطلاعات نامعتبر
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: محصول یا کاربر یافت نشد
 */
const updateUserProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "محصول یافت نشد");
  }

  // بررسی مالکیت محصول
  if (product.userId.toString() !== req.params.userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "این محصول متعلق به کاربر دیگری است"
    );
  }

  const updatedProduct = await productService.updateProduct(
    req.params.productId,
    req.body
  );
  res.status(httpStatus.OK).send(updatedProduct);
});

/**
 * حذف محصول کاربر (ادمین)
 * @swagger
 * /products/user/{userId}/{productId}:
 *   delete:
 *     summary: حذف محصول کاربر
 *     description: فقط توسط ادمین قابل دسترسی است.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه کاربر
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: شناسه محصول
 *     responses:
 *       "200":
 *         description: محصول با موفقیت حذف شد
 *       "401":
 *         description: دسترسی غیرمجاز
 *       "403":
 *         description: فقط برای ادمین قابل دسترسی است
 *       "404":
 *         description: محصول یا کاربر یافت نشد
 */
const deleteUserProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "محصول یافت نشد");
  }

  // بررسی مالکیت محصول
  if (product.userId.toString() !== req.params.userId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "این محصول متعلق به کاربر دیگری است"
    );
  }

  await productService.deleteProduct(req.params.productId);
  res.status(httpStatus.OK).send({ message: "محصول با موفقیت حذف شد" });
});

module.exports = {
  getMyProducts,
  createProduct,
  getProduct,
  getProductByUid,
  updateProduct,
  deleteProduct,
  getUserProducts,
  createProductForUser,
  updateUserProduct,
  deleteUserProduct,
};
