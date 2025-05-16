const httpStatus = require("http-status");
const { Product } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * ایجاد محصول جدید
 * @param {Object} productData - اطلاعات محصول
 * @returns {Promise<Product>}
 */
const createProduct = async (productData) => {
  // بررسی وجود کد تکراری
  const existingProduct = await Product.findOne({
    userId: productData.userId,
    code: productData.code,
  });

  if (existingProduct) {
    throw new ApiError(httpStatus.BAD_REQUEST, "کد محصول تکراری است");
  }

  return Product.create(productData);
};

/**
 * دریافت محصول با شناسه
 * @param {ObjectId} id - شناسه محصول
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * دریافت محصول با uid
 * @param {string} uid - شناسه منحصر به فرد محصول
 * @returns {Promise<Product>}
 */
const getProductByUid = async (uid) => {
  return Product.findOne({ uid });
};

/**
 * دریافت محصول کاربر با uid
 * @param {string} uid - شناسه منحصر به فرد محصول
 * @param {ObjectId} userId - شناسه کاربر
 * @returns {Promise<Product>}
 */
const getUserProductByUid = async (uid, userId) => {
  return Product.findOne({ uid, userId, active: true });
};

/**
 * دریافت همه محصولات کاربر
 * @param {ObjectId} userId - شناسه کاربر
 * @param {Object} filter - فیلترهای اضافی
 * @returns {Promise<Array>}
 */
const getUserProducts = async (userId, filter = {}) => {
  const combinedFilter = { userId, ...filter };
  return Product.find(combinedFilter).sort({ createdAt: -1 });
};

/**
 * به‌روزرسانی محصول
 * @param {ObjectId} productId - شناسه محصول
 * @param {Object} updateData - اطلاعات به‌روزرسانی
 * @returns {Promise<Product>}
 */
const updateProduct = async (productId, updateData) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "محصول یافت نشد");
  }

  // بررسی کد تکراری
  if (updateData.code && updateData.code !== product.code) {
    const existingProduct = await Product.findOne({
      userId: product.userId,
      code: updateData.code,
      _id: { $ne: productId },
    });

    if (existingProduct) {
      throw new ApiError(httpStatus.BAD_REQUEST, "کد محصول تکراری است");
    }
  }

  Object.assign(product, updateData);
  await product.save();
  return product;
};

/**
 * حذف محصول
 * @param {ObjectId} productId - شناسه محصول
 * @returns {Promise<Product>}
 */
const deleteProduct = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "محصول یافت نشد");
  }

  await product.remove();
  return product;
};

/**
 * فعال‌سازی یا غیرفعال‌سازی محصول
 * @param {ObjectId} productId - شناسه محصول
 * @param {boolean} active - وضعیت فعال‌سازی
 * @returns {Promise<Product>}
 */
const toggleProductStatus = async (productId, active) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "محصول یافت نشد");
  }

  product.active = active;
  await product.save();
  return product;
};

module.exports = {
  createProduct,
  getProductById,
  getProductByUid,
  getUserProductByUid,
  getUserProducts,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
};
