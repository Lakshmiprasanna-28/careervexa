// 📁 server/routes/messageRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import {
  getMessages,
  getThreads,
  sendMessage,
  startConversation,
  markThreadAsRead,
  deleteThread,
  clearMessages,
  deleteSelectedMessages,
  blockUser,
} from "../controllers/messageController.js";

const router = express.Router();

// 📩 Messaging
router.post("/start", protect, startConversation); // 🔥 Create thread or return existing
router.get("/threads/:userId", protect, getThreads); // 💬 Get user's threads
router.get("/threads/:threadId/messages", protect, getMessages); // 📜 Load messages

router.post("/threads/:threadId/messages", protect, upload.single("media"), sendMessage); // 📤 Send message with optional media
router.put("/threads/:threadId/read", protect, markThreadAsRead); // ✅ Mark as read

// 🛠️ Thread actions
router.delete("/threads/:threadId", protect, deleteThread); // ❌ Delete thread
router.delete("/clear/:threadId", protect, clearMessages);
router.put("/threads/:threadId/clear", protect, clearMessages); // 🧹 Clear messages in thread
router.post("/messages/delete-many", protect, deleteSelectedMessages); // ❌ Bulk delete

// 🚫 Blocking
router.put("/block/:userId", protect, blockUser); // 🔒 Block user from chatting

export default router;
