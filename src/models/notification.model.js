const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["expiry", "payment", "system", "other"],
  },
  read: { type: Boolean, default: false },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" }, // برای اطلاع‌رسانی به خریداران پلن خاص
  metadata: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
