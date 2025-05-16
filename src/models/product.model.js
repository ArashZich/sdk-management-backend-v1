const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const productSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true },
  code: { type: String, required: true },
  uid: { type: String, required: true, unique: true }, // شناسه منحصر به فرد کوتاه
  thumbnail: { type: String },
  patterns: [
    {
      name: { type: String, required: true },
      code: { type: String, required: true },
      imageUrl: { type: String },
    },
  ],
  colors: [
    {
      name: { type: String, required: true },
      hexCode: { type: String, required: true },
      imageUrl: { type: String },
    },
  ],
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// میدلور تولید uid
productSchema.pre("save", async function (next) {
  if (!this.uid) {
    this.uid = nanoid(8);
  }
  this.updatedAt = Date.now();
  next();
});

// میدلور بروزرسانی تاریخ ویرایش برای findOneAndUpdate
productSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: Date.now() });
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
