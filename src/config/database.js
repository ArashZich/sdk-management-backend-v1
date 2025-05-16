const mongoose = require("mongoose");
const logger = require("./logger");
const config = require("./index");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      config.mongoose.url,
      config.mongoose.options
    );
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
