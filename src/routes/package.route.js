const express = require("express");
const validate = require("../middlewares/validate");
const { packageValidation } = require("../validations");
const { packageController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Packages
 *   description: مدیریت بسته‌ها
 */

// مسیرهای بسته‌های کاربر جاری
router.route("/me").get(auth, packageController.getMyPackages);

router
  .route("/:packageId")
  .get(
    auth,
    validate(packageValidation.getPackage),
    packageController.getPackage
  );

// مسیرهای ادمین
router
  .route("/")
  .get(auth, admin, packageController.getPackages)
  .post(
    auth,
    admin,
    validate(packageValidation.createManualPackage),
    packageController.createManualPackage
  );

router
  .route("/:packageId/sdk-features")
  .put(
    auth,
    admin,
    validate(packageValidation.updateSdkFeatures),
    packageController.updateSdkFeatures
  );

router
  .route("/:packageId/extend")
  .post(
    auth,
    admin,
    validate(packageValidation.extendPackage),
    packageController.extendPackage
  );

router
  .route("/:packageId/suspend")
  .post(
    auth,
    admin,
    validate(packageValidation.suspendPackage),
    packageController.suspendPackage
  );

router
  .route("/:packageId/reactivate")
  .post(
    auth,
    admin,
    validate(packageValidation.reactivatePackage),
    packageController.reactivatePackage
  );

module.exports = router;
