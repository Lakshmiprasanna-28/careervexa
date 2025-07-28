import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageThread",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, default: "" }, // Text content
    media: { type: String, default: null }, // Media URL (optional)
    type: { type: String, enum: ["text", "media"], default: "text" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isDelivered: { type: Boolean, default: false }, // ✅ Added
    isRead: { type: Boolean, default: false },       // ✅ Added
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
