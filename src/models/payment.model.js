const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  amount: { type: Number, required: true },
  originalAmount: { type: Number, required: true },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  clientRefId: { type: String, required: true, unique: true },
  paymentCode: { type: String },
  paymentRefId: { type: String },
  cardNumber: { type: String },
  cardHashPan: { type: String },
  payedDate: { type: Date },
  status: {
    type: String,
    enum: ["pending", "success", "failed", "canceled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// میدلور بروزرسانی تاریخ ویرایش
paymentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// میدلور بروزرسانی تاریخ ویرایش برای findOneAndUpdate
paymentSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: Date.now() });
});

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
