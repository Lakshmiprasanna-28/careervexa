// === notification.js ===
import express from "express";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/protect.js";
import Notification from "../models/Notification.js";

const router = express.Router();
router.use(protect);

// ✅ Get all notifications
router.get("/", getNotifications);

// ✅ Mark single as read
router.patch("/:id/read", markAsRead);     // old patch version
router.put("/:id/read", markAsRead);       // new: to fix frontend 404

// ✅ Delete a notification
router.delete("/:id", deleteNotification);

// ✅ Get unread count
router.get("/unread/count", async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });
    res.json({ count });
  } catch (error) {
    console.error("❌ Error getting unread count:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ 🔥 Mark ALL as read
router.put("/mark-all-read", async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error marking all as read:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
