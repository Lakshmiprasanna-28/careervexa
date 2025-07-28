// === client/src/pages/socket.js ===
import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (token) => {
  if (socket && socket.connected) {
    console.log("✅ Socket already connected:", socket.id);
    return socket;
  }

  socket = io("http://localhost:5000", {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
  socket.on("disconnect", (reason) => console.warn("⚠️ Socket disconnected:", reason));
  socket.on("connect_error", (err) =>
    console.error("🚫 Socket connection error:", err.message)
  );

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("🔌 Socket manually disconnected");
    socket = null;
  }
};

export const getSocket = () => socket;
