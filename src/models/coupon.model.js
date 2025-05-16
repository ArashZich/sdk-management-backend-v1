const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String },
  percent: { type: Number, required: true, min: 1, max: 100 },
  maxAmount: { type: Number, required: true, min: 0 },
  maxUsage: { type: Number, required: true, min: 1 },
  usedCount: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  forPlans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Plan" }], // برای پلن‌های خاص
  forUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // برای کاربران خاص
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// میدلور بروزرسانی تاریخ ویرایش
couponSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// میدلور بروزرسانی تاریخ ویرایش برای findOneAndUpdate
couponSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: Date.now() });
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
