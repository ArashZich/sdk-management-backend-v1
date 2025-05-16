const app = require("./app");
const config = require("./config");
const logger = require("./config/logger");
const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");
const { runSeeds } = require("./seeds");

const startServer = async () => {
  try {
    // اتصال به دیتابیس
    await connectDB();

    // اتصال به ردیس
    await connectRedis();

    // اجرای سیدهای اولیه
    if (config.env === "development") {
      await runSeeds();
    }

    // شروع سرور
    const server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
      logger.info(
        `API documentation available at: http://localhost:${config.port}/api/${config.apiVersion}/docs`
      );
    });

    // مدیریت خروج با گریس
    const exitHandler = () => {
      if (server) {
        server.close(() => {
          logger.info("Server closed");
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    const unexpectedErrorHandler = (error) => {
      logger.error(error);
      exitHandler();
    };

    process.on("uncaughtException", unexpectedErrorHandler);
    process.on("unhandledRejection", unexpectedErrorHandler);

    process.on("SIGTERM", () => {
      logger.info("SIGTERM received");
      if (server) {
        server.close();
      }
    });
  } catch (error) {
    logger.error(`Server start error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
