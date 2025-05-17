const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { productService } = require("../services");
const pick = require("../utils/pick");

const getMyProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["active"]);
  const products = await productService.getUserProducts(req.user._id, filter);
  res.status(httpStatus.OK).send(products);
});

const createProduct = catchAsync(async (req, res) => {
  const productData = {
    ...req.body,
    userId: req.user._id,
  };
  const product = await productService.createProduct(productData);
  res.status(httpStatus.CREATED).send(product);
});

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

const getUserProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["active"]);
  const products = await productService.getUserProducts(
    req.params.userId,
    filter
  );
  res.status(httpStatus.OK).send(products);
});

const createProductForUser = catchAsync(async (req, res) => {
  const productData = {
    ...req.body,
    userId: req.params.userId,
  };
  const product = await productService.createProduct(productData);
  res.status(httpStatus.CREATED).send(product);
});

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
