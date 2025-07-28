import Message from "../models/message.js";
import MessageThread from "../models/messageThread.js";
import User from "../models/User.js";
import { uploadToCloudinary } from "../middleware/uploadMiddleware.js";
import { getIO } from "../socket.js";

// 🎯 Start or return an existing conversation
export const startConversation = async (req, res) => {
  const { receiverId } = req.body;
  const currentUserId = req.user._id;

  if (!receiverId) return res.status(400).json({ error: "Receiver ID is required" });

  try {
    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ error: "Receiver not found" });

    let thread = await MessageThread.findOne({
      participants: { $all: [currentUserId, receiverId], $size: 2 },
    }).populate("participants", "name email avatar");

    if (!thread) {
      thread = await MessageThread.create({ participants: [currentUserId, receiverId] });
      thread = await thread.populate("participants", "name email avatar");
    }

    thread.updatedAt = new Date();
    await thread.save();

    const io = getIO();
    if (io) {
      thread.participants.forEach((participant) => {
        io.to(participant._id.toString()).emit("threadUpdated", { threadId: thread._id });
      });
    }

    return res.status(200).json({ thread });
  } catch (err) {
    console.error("❌ Error starting conversation:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✉️ Send a message
export const sendMessage = async (req, res) => {
  const { threadId } = req.params;
  const { content, senderId } = req.body;

  if (!threadId || !senderId || (!content && !req.file)) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    let mediaUrl = null;
    let type = "text";

    if (req.file) {
      const resourceType = req.file.mimetype.startsWith("video")
        ? "video"
        : req.file.mimetype.startsWith("image")
        ? "image"
        : "auto";

      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname,
        "messages",
        resourceType
      );

      if (uploadResult) {
        mediaUrl = uploadResult.url;
        type = "media";
      }
    }

    const message = await Message.create({
      threadId,
      senderId,
      content: content || "",
      media: mediaUrl,
      type,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "name email avatar");

    const thread = await MessageThread.findByIdAndUpdate(
      threadId,
      { $set: { updatedAt: new Date(), lastMessage: message._id } },
      { new: true }
    ).populate("participants", "name email avatar");

    const io = getIO();
    if (io) {
      io.to(threadId).emit("newMessage", populatedMessage);
      thread.participants.forEach((participant) => {
        io.to(participant._id.toString()).emit("threadUpdated", { threadId: thread._id });
      });
    }

    return res.status(201).json(populatedMessage);
  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 📩 Get all messages in a thread
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ threadId: req.params.threadId })
      .populate("senderId", "name email avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🧵 Get all threads for a user (with lastMessage)
export const getThreads = async (req, res) => {
  try {
    const threads = await MessageThread.find({ participants: req.params.userId })
      .sort({ updatedAt: -1 })
      .populate("participants", "name email avatar")
      .populate({
        path: "lastMessage",
        select: "content type senderId createdAt",
        populate: {
          path: "senderId",
          select: "name email avatar",
        },
      });

    res.status(200).json(threads);
  } catch (err) {
    console.error("❌ Error fetching threads:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Mark thread as read
export const markThreadAsRead = async (req, res) => {
  const { threadId } = req.params;
  const userId = req.user._id;

  try {
    await Message.updateMany(
      { threadId, readBy: { $ne: userId } },
      { $addToSet: { readBy: userId } }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error marking as read:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🗑️ Delete a chat thread
export const deleteThread = async (req, res) => {
  const { threadId } = req.params;

  try {
    await Message.deleteMany({ threadId });
    await MessageThread.findByIdAndDelete(threadId);
    res.status(200).json({ success: true, message: "Chat deleted" });
  } catch (err) {
    console.error("❌ Error deleting chat:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🧹 Clear all messages in thread
export const clearMessages = async (req, res) => {
  const { threadId } = req.params;

  try {
    await Message.deleteMany({ threadId });
    await MessageThread.findByIdAndUpdate(threadId, { $unset: { lastMessage: "" } });
    res.status(200).json({ success: true, message: "Messages cleared" });
  } catch (err) {
    console.error("❌ Error clearing messages:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ❌ Delete selected messages
export const deleteSelectedMessages = async (req, res) => {
  const { messageIds } = req.body;

  if (!Array.isArray(messageIds) || messageIds.length === 0) {
    return res.status(400).json({ error: "messageIds array is required" });
  }

  try {
    await Message.deleteMany({ _id: { $in: messageIds } });
    res.status(200).json({ success: true, message: "Selected messages deleted" });
  } catch (err) {
    console.error("❌ Error deleting selected messages:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🚫 Block a user
export const blockUser = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user._id;

  try {
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { blockedUsers: userId },
    });

    res.status(200).json({ success: true, message: "User blocked" });
  } catch (err) {
    console.error("❌ Error blocking user:", err);
    res.status(500).json({ error: "Server error" });
  }
};
