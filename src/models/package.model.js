const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  token: { type: String, required: true },
  sdkFeatures: {
    features: [{ type: String }],
    patterns: { type: Object, default: {} },
    isPremium: { type: Boolean, default: false },
    projectType: { type: String, default: "standard" },
    mediaFeatures: {
      allowedSources: [{ type: String }],
      allowedViews: [{ type: String }],
      comparisonModes: [{ type: String }],
    },
  },
  requestLimit: {
    monthly: { type: Number, required: true },
    remaining: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ["active", "expired", "suspended"],
    default: "active",
  },
  notified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// میدلور بروزرسانی تاریخ ویرایش
packageSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// میدلور بروزرسانی تاریخ ویرایش برای findOneAndUpdate
packageSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: Date.now() });
});

const Package = mongoose.model("Package", packageSchema);

module.exports = Package;
