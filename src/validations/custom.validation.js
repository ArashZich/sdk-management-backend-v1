const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message("شناسه نامعتبر است");
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("رمز عبور باید حداقل 8 کاراکتر باشد");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message("رمز عبور باید شامل حروف و اعداد باشد");
  }
  return value;
};

const phoneFormat = (value, helpers) => {
  // شماره تلفن ایرانی: 09XXXXXXXXX
  if (!value.match(/^09[0-9]{9}$/)) {
    return helpers.message("فرمت شماره تلفن نامعتبر است");
  }
  return value;
};

module.exports = {
  objectId,
  password,
  phoneFormat,
};
