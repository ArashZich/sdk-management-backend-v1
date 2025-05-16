const express = require("express");
const validate = require("../middlewares/validate");
const { planValidation } = require("../validations");
const { planController } = require("../controllers");
const { auth, admin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: مدیریت پلن‌ها
 */

// مسیرهای عمومی
router.route("/public").get(planController.getPublicPlans);

// مسیرهای با احراز هویت
router
  .route("/")
  .get(auth, planController.getPlans)
  .post(
    auth,
    admin,
    validate(planValidation.createPlan),
    planController.createPlan
  );

router
  .route("/:planId")
  .get(auth, validate(planValidation.getPlan), planController.getPlan)
  .put(
    auth,
    admin,
    validate(planValidation.updatePlan),
    planController.updatePlan
  )
  .delete(
    auth,
    admin,
    validate(planValidation.deletePlan),
    planController.deletePlan
  );

module.exports = router;
