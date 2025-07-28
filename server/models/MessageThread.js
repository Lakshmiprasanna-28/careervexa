import mongoose from "mongoose";

const messageThreadSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

// ✅ Prevent OverwriteModelError by checking if model already exists
const MessageThread =
  mongoose.models.MessageThread || mongoose.model("MessageThread", messageThreadSchema);

export default MessageThread;
