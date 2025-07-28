import mongoose from "mongoose";

const messageThreadSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
    ],
    latestMessage: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Message" 
    }
  },
  { timestamps: true }
);

export default mongoose.model("MessageThread", messageThreadSchema);
