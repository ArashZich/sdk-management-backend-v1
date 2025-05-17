const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const basicAuth = require("express-basic-auth");
const config = require(".");

/**
 * تنظیمات Swagger
 */
const swaggerConfig = {
  failOnErrors: false, // مهم: اضافه کردن این گزینه
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API سیستم مدیریت SDK آرایش مجازی",
      version: "1.0.0",
      description: "مستندات API سیستم مدیریت SDK آرایش مجازی",
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
  },
  apis: ["src/routes/*.js"],
};

/**
 * ایجاد روتر Swagger با احراز هویت
 */
const setupSwagger = (app) => {
  try {
    // ایجاد مستندات Swagger با مدیریت خطا
    let specs;
    try {
      specs = swaggerJsdoc(swaggerConfig);
    } catch (error) {
      console.error("خطا در ساخت Swagger:", error.message);
      specs = {
        openapi: "3.0.0",
        info: { title: "API", version: "1.0.0" },
        paths: {},
      };
    }

    const router = express.Router();

    // اعمال احراز هویت پایه
    router.use(
      basicAuth({
        users: {
          [process.env.SWAGGER_USER || "admin"]:
            process.env.SWAGGER_PASSWORD ||
            "1e446e0aba3b673493a3fc555cd6ab6695965b0edb572ea7934f61ac541bbf64",
        },
        challenge: true,
        realm: "SDK Management API Documentation",
      })
    );

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
        },
      })
    );

    // ثبت روتر در مسیر /api-docs
    app.use(`/api-docs`, router);

    console.log(
      `📚 مستندات API در آدرس: http://localhost:${config.port}/api-docs`
    );
  } catch (error) {
    console.error("خطا در تنظیم Swagger:", error);
  }
};

module.exports = setupSwagger;
