const express = require("express");
const validate = require("../middlewares/validate");
const { authValidation } = require("../validations");
const { authController } = require("../controllers");
const { auth } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: مدیریت احراز هویت و دسترسی
 */

router.post(
  "/login/otp",
  validate(authValidation.loginWithOtp),
  authController.loginWithOtp
);

router.post(
  "/verify-otp",
  validate(authValidation.verifyOtp),
  authController.verifyOtp
);

router.post(
  "/refresh-token",
  validate(authValidation.refreshToken),
  authController.refreshToken
);

router.post("/logout", auth, authController.logout);

router.post(
  "/oauth",
  validate(authValidation.loginWithOAuth),
  authController.loginWithOAuth
);

module.exports = router;
