/**
 * کانفیگ مربوط به درگاه پرداخت
 */

const config = require("./index");

module.exports = {
  /**
   * تنظیمات PayPing
   */
  payping: {
    // آدرس پایه API
    baseUrl: config.payping.baseUrl || "https://api.payping.ir/v3",

    // توکن API
    token: config.payping.apiKey,

    // آدرس بازگشت پس از پرداخت
    callbackUrl: config.payping.callbackUrl,

    // آدرس صفحه پرداخت
    paymentUrl: (code) => `https://api.payping.ir/v3/pay/gotoipg/${code}`,

    // محدودیت زمانی پرداخت (بر حسب ثانیه)
    timeout: 3600,

    // وضعیت‌های پرداخت
    status: {
      SUCCESS: "success",
      FAILED: "failed",
      PENDING: "pending",
      CANCELED: "canceled",
    },

    // هدرهای درخواست
    getHeaders: () => ({
      Authorization: `Bearer ${config.payping.apiKey}`,
      "Content-Type": "application/json",
    }),
  },

  /**
   * تبدیل مبلغ به تومان (PayPing از تومان استفاده می‌کند)
   * @param {number} rialAmount - مبلغ به ریال
   * @returns {number} - مبلغ به تومان
   */
  rialToToman: (rialAmount) => Math.floor(rialAmount / 10),

  /**
   * تبدیل مبلغ به ریال
   * @param {number} tomanAmount - مبلغ به تومان
   * @returns {number} - مبلغ به ریال
   */
  tomanToRial: (tomanAmount) => tomanAmount * 10,

  /**
   * تولید شناسه یکتا برای پرداخت
   * @returns {string} - شناسه یکتا
   */
  generateUniqueId: () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000000);
    return `${timestamp}${random}`;
  },
};
