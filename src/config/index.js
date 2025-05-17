const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    PORT: Joi.number().default(4000),
    API_VERSION: Joi.string().default("v1"),
    FRONTEND_URL: Joi.string().required().description("Frontend URL"),
    MONGODB_URI: Joi.string().required().description("MongoDB URI"),
    MONGODB_URI_TEST: Joi.string().required().description("MongoDB Test URI"),
    REDIS_URL: Joi.string().required().description("Redis URL"),
    JWT_SECRET: Joi.string().required().description("JWT Secret Key"),
    JWT_ACCESS_EXPIRATION_DAYS: Joi.number()
      .default(7)
      .description("JWT Access Token expiration in days"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("JWT Refresh Token expiration in days"),
    SDK_TOKEN_SECRET: Joi.string()
      .required()
      .description("SDK Token Secret Key"),
    KAVENEGAR_API_KEY: Joi.string().required().description("Kavenegar API Key"),
    PAYPING_API_KEY: Joi.string().required().description("PayPing API Key"),
    PAYMENT_CALLBACK_URL: Joi.string()
      .required()
      .description("Payment Callback URL"),
    SWAGGER_USER: Joi.string().description("Swagger Authentication Username"),
    SWAGGER_PASSWORD: Joi.string().description(
      "Swagger Authentication Password"
    ),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  apiVersion: envVars.API_VERSION,
  frontend: {
    url: envVars.FRONTEND_URL,
  },
  mongoose: {
    url:
      envVars.NODE_ENV === "test"
        ? envVars.MONGODB_URI_TEST
        : envVars.MONGODB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  redis: {
    url: envVars.REDIS_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  sdkToken: {
    secret: envVars.SDK_TOKEN_SECRET,
  },
  kavenegar: {
    apiKey: envVars.KAVENEGAR_API_KEY,
  },
  payping: {
    apiKey: envVars.PAYPING_API_KEY,
    baseUrl: "https://api.payping.ir/v3",
    callbackUrl: envVars.PAYMENT_CALLBACK_URL,
  },
  swagger: {
    username: envVars.SWAGGER_USER || "admin",
    password:
      envVars.SWAGGER_PASSWORD ||
      "1e446e0aba3b673493a3fc555cd6ab6695965b0edb572ea7934f61ac541bbf64",
  },
};
