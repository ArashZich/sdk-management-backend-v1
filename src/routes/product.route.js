const express = require("express");
const validate = require("../middlewares/validate");
const { productValidation } = require("../validations");
const { productController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: مدیریت محصولات
 */

// مسیرهای محصولات کاربر جاری
router.route("/me").get(auth, productController.getMyProducts);

router
  .route("/")
  .post(
    auth,
    validate(productValidation.createProduct),
    productController.createProduct
  );

router
  .route("/:productId")
  .get(
    auth,
    validate(productValidation.getProduct),
    productController.getProduct
  )
  .put(
    auth,
    validate(productValidation.updateProduct),
    productController.updateProduct
  )
  .delete(
    auth,
    validate(productValidation.deleteProduct),
    productController.deleteProduct
  );

router.route("/uid/:productUid").get(auth, productController.getProductByUid);

// مسیرهای ادمین
router
  .route("/user/:userId")
  .get(auth, admin, productController.getUserProducts)
  .post(
    auth,
    admin,
    validate(productValidation.createProduct),
    productController.createProductForUser
  );

router
  .route("/user/:userId/:productId")
  .put(
    auth,
    admin,
    validate(productValidation.updateProduct),
    productController.updateUserProduct
  )
  .delete(
    auth,
    admin,
    validate(productValidation.deleteProduct),
    productController.deleteUserProduct
  );

module.exports = router;
