const axios = require("axios");
const config = require("../config");
const logger = require("../config/logger");

/**
 * کلاس سرویس پرداخت PayPing
 */
class PaymentService {
  constructor() {
    this.baseUrl = config.payping.baseUrl;
    this.token = config.payping.token;
  }

  /**
   * ایجاد درخواست پرداخت
   * @param {Object} paymentData - اطلاعات پرداخت
   * @returns {Promise<Object>}
   */
  async createPayment(paymentData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/pay`,
        {
          amount: paymentData.amount,
          returnUrl: paymentData.returnUrl,
          payerIdentity: paymentData.payerIdentity,
          payerName: paymentData.payerName,
          description: paymentData.description,
          clientRefId: paymentData.clientRefId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        paymentCode: response.data.paymentCode,
        url: response.data.url,
      };
    } catch (error) {
      logger.error(`خطا در ایجاد درخواست پرداخت: ${error.message}`);
      throw new Error(
        error.response?.data?.message || "خطا در ایجاد درخواست پرداخت"
      );
    }
  }

  /**
   * تأیید پرداخت
   * @param {number} paymentRefId - شناسه ارجاع پرداخت
   * @returns {Promise<Object>}
   */
  async verifyPayment(paymentRefId) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/pay/verify`,
        {
          paymentRefId: Number(paymentRefId),
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error(`خطا در تأیید پرداخت: ${error.message}`);
      throw new Error(error.response?.data?.message || "خطا در تأیید پرداخت");
    }
  }
}

module.exports = new PaymentService();
