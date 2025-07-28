import mongoose from "mongoose";

const messageThreadSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    ],
    lastMessage: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Message" 
    }
  },
  { timestamps: true } // 🔥 updatedAt will be used to sort threads in sidebar
);

export default mongoose.model("MessageThread", messageThreadSchema);
