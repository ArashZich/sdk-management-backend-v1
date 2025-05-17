const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const basicAuth = require("express-basic-auth");
const config = require(".");

/**
 * تنظیمات Swagger
 */
const swaggerConfig = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API سیستم مدیریت SDK آرایش مجازی",
      version: "1.0.0",
      description: "مستندات API سیستم مدیریت SDK آرایش مجازی",
      license: {
        name: "خصوصی",
      },
      contact: {
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: `/api/${config.apiVersion}`,
        description: "سرور اصلی",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        sdkAuth: {
          type: "apiKey",
          in: "header",
          name: "x-sdk-token",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["src/routes/*.js", "src/models/*.js", "src/controllers/*.js"],
};

// ایجاد مستندات Swagger
const specs = swaggerJsdoc(swaggerConfig);

/**
 * تنظیمات احراز هویت برای دسترسی به Swagger
 */
const swaggerAuth = {
  users: {
    [process.env.SWAGGER_USER || "admin"]:
      process.env.SWAGGER_PASSWORD ||
      "1e446e0aba3b673493a3fc555cd6ab6695965b0edb572ea7934f61ac541bbf64",
  },
  challenge: true,
  realm: "SDK Management API Documentation",
};

/**
 * ایجاد روتر Swagger با احراز هویت
 */
const setupSwagger = (app) => {
  const router = express.Router();

  // اعمال احراز هویت پایه
  router.use(basicAuth(swaggerAuth));

  // تنظیم Swagger UI
  router.use(
    "/",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "مستندات API آرایش مجازی",
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "none",
        filter: true,
        displayRequestDuration: true,
      },
    })
  );

  // افزودن مسیر JSON برای مستندات
  router.get("/json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  // ثبت روتر در مسیر /api/{version}/docs
  app.use(`/api/${config.apiVersion}/docs`, router);

  // لاگ برای دسترسی به مستندات
  console.log(
    `📚 مستندات API در آدرس: http://localhost:${config.port}/api/${config.apiVersion}/docs`
  );
};

module.exports = setupSwagger;
