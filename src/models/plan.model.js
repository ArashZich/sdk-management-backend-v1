const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // تعداد روز
  features: [{ type: String }],
  allowedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  requestLimit: {
    monthly: { type: Number, required: true }, // مقدار -1 برای بی‌نهایت
    total: { type: Number }, // مقدار -1 برای بی‌نهایت
  },
  defaultSdkFeatures: {
    features: [{ type: String }],
    patterns: { type: Object, default: {} },
    mediaFeatures: {
      allowedSources: [{ type: String }],
      allowedViews: [{ type: String }],
      comparisonModes: [{ type: String }],
    },
  },
  active: { type: Boolean, default: true },
  specialOffer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// میدلور بروزرسانی تاریخ ویرایش
planSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// میدلور بروزرسانی تاریخ ویرایش برای findOneAndUpdate
planSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: Date.now() });
});

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
