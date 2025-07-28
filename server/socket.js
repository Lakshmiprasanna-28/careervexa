// === server/socket.js ===
import jwt from "jsonwebtoken";
import Message from "./models/message.js";
import MessageThread from "./models/messageThread.js";

let ioInstance = null;
export const getIO = () => ioInstance;

const connectedUsers = new Set(); // 🧠 Track unique authenticated users

const configureSocket = (io) => {
  ioInstance = io;

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      return next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user?.id;
    const userName = socket.user?.name;
    const userRole = socket.user?.role;

    if (!userId) return socket.disconnect(true);

    console.log(`⚡ User connected: ${userId}`);
    socket.join(userId);

    // ✅ Log authenticated user only once
    if (!connectedUsers.has(userId)) {
      console.log(`✅ Authenticated: ${userName} → Role: ${userRole}`);
      connectedUsers.add(userId);
    }

    socket.on("joinThread", (threadId) => {
      if (threadId) {
        console.log(`🧵 ${userId} joined thread: ${threadId}`);
        socket.join(threadId);
      }
    });

    socket.on("leaveThread", (threadId) => {
      if (threadId) {
        console.log(`👋 ${userId} left thread: ${threadId}`);
        socket.leave(threadId);
      }
    });

    // ✅ Handle "messageDelivered" tick
    socket.on("messageDelivered", async ({ messageId }) => {
      if (!messageId) return;
      try {
        await Message.findByIdAndUpdate(messageId, { isDelivered: true });
        const updatedMessage = await Message.findById(messageId)
          .populate("senderId", "name email avatar");

        io.to(updatedMessage.senderId._id.toString()).emit("messageStatusUpdated", {
          messageId,
          isDelivered: true
        });
      } catch (err) {
        console.error("❌ Error updating delivery status:", err);
      }
    });

    // ✅ Handle "messageRead" tick
    socket.on("messageRead", async ({ messageId }) => {
      if (!messageId) return;
      try {
        await Message.findByIdAndUpdate(messageId, { isRead: true });
        const updatedMessage = await Message.findById(messageId)
          .populate("senderId", "name email avatar");

        io.to(updatedMessage.senderId._id.toString()).emit("messageStatusUpdated", {
          messageId,
          isRead: true
        });
      } catch (err) {
        console.error("❌ Error updating read status:", err);
      }
    });

    socket.on("sendMessage", async (data) => {
      const { threadId, message, receiverId } = data || {};
      if (!message || (!threadId && !receiverId)) return;

      try {
        let thread = null;

        if (threadId) {
          thread = await MessageThread.findById(threadId);
        } else if (receiverId) {
          thread = await MessageThread.findOne({
            participants: { $all: [userId, receiverId] },
          });

          if (!thread) {
            thread = new MessageThread({
              participants: [userId, receiverId],
              lastMessage: {
                content: message.content,
                type: message.type || "text",
              },
            });
            await thread.save();
          }
        }

        if (!thread) return;

        const newMessage = new Message({
          threadId: thread._id,
          senderId: userId,
          content: message.content,
          type: message.type || "text",
        });
        await newMessage.save();

        thread.lastMessage = newMessage._id;
        thread.updatedAt = new Date();
        await thread.save();

        const populatedMessage = await Message.findById(newMessage._id)
          .populate("senderId", "name email avatar");

        io.to(thread._id.toString()).emit("receiveMessage", {
          userId,
          message: populatedMessage,
          threadId: thread._id,
          timestamp: new Date(),
        });

        thread.participants.forEach((participant) => {
          const participantId = participant._id?.toString?.() || participant.toString();
          io.to(participantId).emit("threadUpdated", {
            threadId: thread._id,
          });
        });
      } catch (err) {
        console.error("❌ Error in sendMessage:", err);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`👋 User disconnected: ${userId}. Reason: ${reason}`);
      connectedUsers.delete(userId); // 🔄 Allow fresh log next time
    });

    socket.on("error", (err) => {
      console.error(`❌ Socket error for ${userId}:`, err.message);
    });
  });
};

export default configureSocket;
