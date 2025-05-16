const redis = require("redis");
const logger = require("./logger");
const config = require("./index");

let client;

/**
 * اتصال به ردیس
 */
const connectRedis = async () => {
  try {
    client = redis.createClient({
      url: config.redis.url,
    });

    client.on("error", (err) => {
      logger.error(`Redis Error: ${err}`);
    });

    client.on("connect", () => {
      logger.info("Redis connected");
    });

    await client.connect();
    return client;
  } catch (error) {
    logger.error(`Redis connection error: ${error.message}`);
    process.exit(1);
  }
};

/**
 * ذخیره داده در ردیس
 */
const set = async (key, value, expireTime = 3600) => {
  return await client.set(key, JSON.stringify(value), { EX: expireTime });
};

/**
 * دریافت داده از ردیس
 */
const get = async (key) => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

/**
 * حذف داده از ردیس
 */
const del = async (key) => {
  return await client.del(key);
};

module.exports = {
  connectRedis,
  set,
  get,
  del,
};
