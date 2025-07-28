// === server/utils/sendNotification.js ===
import Notification from "../models/Notification.js";

let ioInstance;

export const setSocketIOInstance = (io) => {
  ioInstance = io;
};

// 🧠 Dynamic link generator based on type
const generateNotificationLink = (type, metadata = {}) => {
  switch (type) {
    case "new_message":
      return `/messages/${metadata.chatId}`;
    case "job_applied":
    case "application_status":
      return `/my-applications`;
    case "new_applicant":
      return `/jobs/${metadata.jobId}/applicants`;
    case "job_approved":
    case "job_rejected":
    case "job_updated":
      return `/jobs/${metadata.jobId}`;
    case "account_update":
      return `/profile`;
    case "admin_alert":
      return `/admin/notifications`;
    case "system_announcement":
      return `/notifications`;
    default:
      return `/notifications`; // fallback
  }
};

export const createNotification = async ({
  senderId = null,
  receiverId,
  type,
  content,
  link = null,
  metadata = {},
}) => {
  if (!receiverId || !type || !content) {
    console.warn("🚨 Missing required fields for notification");
    return;
  }

  const finalLink = link || generateNotificationLink(type, metadata);

  const notification = new Notification({
    recipient: receiverId,
    sender: senderId || null,
    type,
    message: content,
    link: finalLink,
    metadata,
    isRead: false,
  });

  try {
    await notification.save();
    if (ioInstance) {
      ioInstance.to(receiverId.toString()).emit("new_notification", notification);
    }
  } catch (err) {
    console.error("❌ Failed to create notification:", err.message);
  }
};

export const sendNotification = async (userId, payload) => {
  if (!userId || !payload || typeof payload !== "object") {
    console.warn("⚠️ Invalid payload or userId in sendNotification");
    return;
  }

  const { type, message, senderId, metadata = {}, link = null } = payload;

  await createNotification({
    senderId,
    receiverId: userId,
    type,
    content: message,
    link, // optional, will fallback if not provided
    metadata,
  });
};
