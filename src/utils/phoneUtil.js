/**
 * اعتبارسنجی شماره تلفن ایرانی
 * @param {string} phone - شماره تلفن
 * @returns {boolean} - نتیجه اعتبارسنجی
 */
const isValidIranianPhone = (phone) => {
  const phoneRegex = /^09[0-9]{9}$/;
  return phoneRegex.test(phone);
};

/**
 * فرمت کردن شماره تلفن ایرانی
 * @param {string} phone - شماره تلفن
 * @returns {string} - شماره تلفن فرمت شده
 */
const formatIranianPhone = (phone) => {
  if (!phone) return "";

  // حذف کاراکترهای اضافی
  let formattedPhone = phone.replace(/[^\d]/g, "");

  // اضافه کردن پیش‌شماره در صورت نیاز
  if (formattedPhone.length === 10 && formattedPhone.startsWith("9")) {
    formattedPhone = "0" + formattedPhone;
  }

  return formattedPhone;
};

module.exports = {
  isValidIranianPhone,
  formatIranianPhone,
};
