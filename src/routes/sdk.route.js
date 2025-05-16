const express = require("express");
const validate = require("../middlewares/validate");
const { sdkValidation } = require("../validations");
const { sdkController } = require("../controllers");
const sdkAuth = require("../middlewares/sdkAuth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SDK
 *   description: دسترسی‌های SDK
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     sdkAuth:
 *       type: apiKey
 *       in: header
 *       name: x-sdk-token
 */

// مسیرهای عمومی SDK
router
  .route("/validate")
  .post(validate(sdkValidation.validateToken), sdkController.validateToken);

// مسیرهای SDK با توکن
router.route("/products").get(sdkAuth, sdkController.getProducts);

router
  .route("/products/:productUid")
  .get(sdkAuth, sdkController.getProductForSDK);

router
  .route("/apply")
  .post(
    sdkAuth,
    validate(sdkValidation.applyMakeup),
    sdkController.applyMakeup
  );

router.route("/status").get(sdkAuth, sdkController.getStatus);

module.exports = router;
