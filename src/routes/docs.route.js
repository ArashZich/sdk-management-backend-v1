const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const router = express.Router();

// Swagger تنظیمات
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API سیستم مدیریت SDK آرایش مجازی",
      version: "1.0.0",
      description: "مستندات API سیستم مدیریت SDK آرایش مجازی",
      license: {
        name: "خصوصی",
      },
    },
    servers: [
      {
        url: `/api/v1`,
        description: "سرور اصلی",
      },
    ],
  },
  apis: ["src/routes/*.js", "src/models/*.js"],
};

const specs = swaggerJsdoc(options);

router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

module.exports = router;
