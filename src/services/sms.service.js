const Kavenegar = require("kavenegar");
const config = require("../config");
const logger = require("../config/logger");

/**
 * کلاس سرویس پیامک کاوه‌نگار
 */
class SmsService {
  constructor() {
    this.sender = config.kavenegar.sender;
    this.client = Kavenegar.KavenegarApi({
      apikey: config.kavenegar.apiKey,
    });
  }

  /**
   * ارسال پیامک
   * @param {string} receptor - شماره گیرنده
   * @param {string} message - متن پیام
   * @returns {Promise}
   */
  async sendSMS(receptor, message) {
    return new Promise((resolve, reject) => {
      this.client.Send(
        {
          message,
          sender: this.sender,
          receptor,
        },
        (err, res) => {
          if (err) {
            logger.error(`خطا در ارسال پیامک: ${err.message}`);
            return reject(err);
          }

          logger.info(`پیامک با موفقیت به ${receptor} ارسال شد`);
          resolve(res);
        }
      );
    });
  }

  /**
   * ارسال کد تأیید
   * @param {string} receptor - شماره گیرنده
   * @param {string} code - کد تأیید
   * @returns {Promise}
   */
  async sendVerificationCode(receptor, code) {
    // در محیط توسعه فقط نمایش در کنسول
    if (process.env.NODE_ENV === "development") {
      logger.info(`[DEV MODE] کد تأیید برای ${receptor}: ${code}`);
      return { result: true };
    }

    return new Promise((resolve, reject) => {
      this.client.VerifyLookup(
        {
          receptor,
          token: code,
          template: "verify",
        },
        (err, res) => {
          if (err) {
            logger.error(`خطا در ارسال کد تأیید: ${err.message}`);
            return reject(err);
          }

          logger.info(`کد تأیید با موفقیت به ${receptor} ارسال شد`);
          resolve(res);
        }
      );
    });
  }

  /**
   * ارسال اطلاعیه انقضا
   * @param {string} receptor - شماره گیرنده
   * @param {string} days - تعداد روزهای باقیمانده
   * @param {string} planName - نام پلن
   * @returns {Promise}
   */
  async sendExpiryNotification(receptor, days, planName) {
    return new Promise((resolve, reject) => {
      this.client.VerifyLookup(
        {
          receptor,
          token: days,
          token2: planName,
          template: "expiry",
        },
        (err, res) => {
          if (err) {
            logger.error(`خطا در ارسال اطلاعیه انقضا: ${err.message}`);
            return reject(err);
          }

          logger.info(`اطلاعیه انقضا با موفقیت به ${receptor} ارسال شد`);
          resolve(res);
        }
      );
    });
  }
}

module.exports = new SmsService();
