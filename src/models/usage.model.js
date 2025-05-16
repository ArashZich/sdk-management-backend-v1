const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Package",
    required: true,
  },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  productUid: { type: String }, // شناسه منحصر به فرد محصول
  domain: { type: String }, // دامنه درخواست دهنده
  requestType: {
    type: String,
    required: true,
    enum: ["validate", "apply", "check", "other"],
  },
  ipAddress: { type: String },
  userAgent: { type: String },
  metadata: { type: Object },
  success: { type: Boolean, default: true },
  errorMessage: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Usage = mongoose.model("Usage", usageSchema);

module.exports = Usage;
