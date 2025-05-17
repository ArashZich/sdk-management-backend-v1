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
    throw error;
  }
};

/**
 * دریافت کلاینت ردیس
 */
const getClient = () => {
  // اگر کلاینت وجود نداشت، سعی کنید آن را ایجاد کنید
  if (!client) {
    logger.info("Redis client not initialized, initializing now...");
    return connectRedis().then(() => client);
  }
  return client;
};

/**
 * ذخیره داده در ردیس
 */
const set = async (key, value, expireTime = 3600) => {
  const redisClient = await getClient();
  return redisClient.set(key, JSON.stringify(value), { EX: expireTime });
};

/**
 * دریافت داده از ردیس
 */
const get = async (key) => {
  const redisClient = await getClient();
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

/**
 * حذف داده از ردیس
 */
const del = async (key) => {
  const redisClient = await getClient();
  return redisClient.del(key);
};

// اطمینان از اتصال اولیه
connectRedis()
  .then(() => {
    logger.info("Redis client initialized automatically on module load");
  })
  .catch((err) => {
    logger.error(`Failed to initialize Redis client: ${err.message}`);
  });

module.exports = {
  connectRedis,
  getClient,
  set,
  get,
  del,
};
