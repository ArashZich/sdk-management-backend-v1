const express = require("express");
const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");
const { userController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: مدیریت کاربران
 */

// مسیرهای کاربر خود
router
  .route("/me")
  .get(auth, userController.getMe)
  .put(auth, validate(userValidation.updateMe), userController.updateMe);

router
  .route("/me/domains")
  .put(
    auth,
    validate(userValidation.updateDomains),
    userController.updateAllowedDomains
  );

// مسیرهای ادمین
router
  .route("/")
  .get(auth, admin, userController.getUsers)
  .post(
    auth,
    admin,
    validate(userValidation.createUser),
    userController.createUser
  );

router
  .route("/:userId")
  .get(auth, admin, validate(userValidation.getUser), userController.getUser)
  .put(
    auth,
    admin,
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth,
    admin,
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

router
  .route("/:userId/domains")
  .put(
    auth,
    admin,
    validate(userValidation.updateDomains),
    userController.updateUserDomains
  );

module.exports = router;
