const mongoose = require("mongoose");
const { isValidIranianPhone } = require("../utils/phoneUtil");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: isValidIranianPhone,
      message: (props) => `${props.value} یک شماره تلفن معتبر نیست`,
    },
  },
  email: { type: String, trim: true, lowercase: true },
  company: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  verified: { type: Boolean, default: false },
  userType: { type: String, enum: ["real", "legal"] },
  nationalId: { type: String },
  otp: {
    code: { type: String },
    expiresAt: { type: Date },
  },
  refreshToken: { type: String },
  oauthProvider: { type: String },
  oauthId: { type: String },
  notificationSettings: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
  },
  allowedDomains: [{ type: String }], // دامنه‌های مجاز برای SDK
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// میدلور بروزرسانی تاریخ ویرایش
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// میدلور بروزرسانی تاریخ ویرایش برای findOneAndUpdate
userSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: Date.now() });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
