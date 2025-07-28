import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = system-generated
    },
    type: {
      type: String,
      enum: [
        "user_registered",
        "account_deleted",
        "job_posted",
        "job_deleted",
        "application_submitted",
        "application_status",
        "resume_viewed",
        "message",
        "friend_request",
        "device_login",
        "account_blocked",
        "account_unblocked",
        "admin_delete",
        "site_update",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Notification", notificationSchema);
