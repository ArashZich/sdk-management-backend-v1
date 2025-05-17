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

/**
 * ورود با OTP
 * @swagger
 * /auth/login/otp:
 *   post:
 *     summary: درخواست کد تایید و ورود با OTP
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: شماره تلفن کاربر
 *                 example: "09123456789"
 *     responses:
 *       "200":
 *         description: کد تایید با موفقیت ارسال شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: string
 *       "400":
 *         description: شماره تلفن نامعتبر است
 */
router.post(
  "/login/otp",
  validate(authValidation.loginWithOtp),
  authController.loginWithOtp
);

/**
 * تأیید OTP
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: تایید کد OTP و دریافت توکن
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - code
 *             properties:
 *               phone:
 *                 type: string
 *                 description: شماره تلفن کاربر
 *                 example: "09123456789"
 *               code:
 *                 type: string
 *                 description: کد تایید
 *                 example: "12345"
 *     responses:
 *       "200":
 *         description: کد تایید صحیح است
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 tokens:
 *                   type: object
 *       "400":
 *         description: کد تایید نامعتبر است
 */
router.post(
  "/verify-otp",
  validate(authValidation.verifyOtp),
  authController.verifyOtp
);

/**
 * نوسازی توکن
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: نوسازی توکن دسترسی
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: توکن بازیابی
 *     responses:
 *       "200":
 *         description: توکن جدید تولید شد
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tokens:
 *                   type: object
 *       "401":
 *         description: توکن نامعتبر است
 */
router.post(
  "/refresh-token",
  validate(authValidation.refreshToken),
  authController.refreshToken
);

/**
 * خروج
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: خروج از سیستم
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "204":
 *         description: خروج موفقیت‌آمیز
 */
router.post("/logout", auth, authController.logout);

/**
 * ورود با OAuth
 * @swagger
 * /auth/oauth:
 *   post:
 *     summary: ورود با OAuth
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oauthProvider
 *               - oauthId
 *               - token
 *             properties:
 *               oauthProvider:
 *                 type: string
 *                 description: نام سرویس‌دهنده OAuth
 *                 example: "divar"
 *               oauthId:
 *                 type: string
 *                 description: شناسه کاربر در سرویس OAuth
 *               token:
 *                 type: string
 *                 description: توکن OAuth
 *               name:
 *                 type: string
 *                 description: نام کاربر
 *               email:
 *                 type: string
 *                 description: ایمیل کاربر
 *               phone:
 *                 type: string
 *                 description: شماره تلفن کاربر
 *     responses:
 *       "200":
 *         description: ورود موفقیت‌آمیز
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                 tokens:
 *                   type: object
 *       "401":
 *         description: احراز هویت ناموفق
 */
router.post(
  "/oauth",
  validate(authValidation.loginWithOAuth),
  authController.loginWithOAuth
);

module.exports = router;
