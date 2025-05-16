const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const config = require("./config");
const logger = require("./config/logger");
const morgan = require("morgan");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const routes = require("./routes");
const setupCronJobs = require("./crons");

const app = express();

// تنظیم Morgan برای لاگ کردن درخواست‌ها
if (config.env !== "test") {
  app.use(
    morgan("dev", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// میدلورهای پایه
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// کورس
app.use(cors());

// مسیرهای API
app.use(`/api/${config.apiVersion}`, routes);

// مسیر سلامتی
app.get("/health", (req, res) => {
  res.status(200).send({ status: "ok" });
});

// مدیریت مسیرهای ناموجود
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "مسیر مورد نظر یافت نشد"));
});

// تبدیل ارورها
app.use(errorConverter);

// میدلور مدیریت خطا
app.use(errorHandler);

// تنظیم وظایف زمان‌بندی شده
if (config.env !== "test") {
  setupCronJobs();
}

module.exports = app;
