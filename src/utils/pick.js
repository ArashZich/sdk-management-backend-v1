/**
 * انتخاب فیلدهای مشخص شده از یک شیء
 * @param {Object} object - شیء منبع
 * @param {string[]} keys - کلیدهای مورد نظر
 * @returns {Object} - شیء جدید با فیلدهای انتخاب شده
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = pick;
