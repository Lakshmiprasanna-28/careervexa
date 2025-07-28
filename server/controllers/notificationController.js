import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

// 🔔 Create notification
export const createNotification = async ({
  recipientId,
  senderId = null,
  type,
  message,
  metadata = {},
  sendEmailFlag = true,
  io,
}) => {
  const recipient = await User.findById(recipientId);
  if (!recipient) throw new Error("Recipient not found");

  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    message,
    metadata,
  });

  if (io) {
    io.to(recipientId.toString()).emit("new_notification", notification);
  }

  if (sendEmailFlag && recipient.notificationSettings?.email) {
    await sendEmail({
      to: recipient.email,
      subject: `CareerVexa Notification: ${type}`,
      text: message,
    });
  }

  return notification;
};

// ✅ Get notifications (pagination via query param ?page=1)
export const getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notification.countDocuments({ recipient: req.user._id });

    res.json({
      notifications,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get notifications" });
  }
};

// ✅ Mark single notification as read
export const markAsRead = async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

// ✅ Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};

// ✅ Delete single notification
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete" });
  }
};
