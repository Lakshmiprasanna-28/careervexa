// client/src/context/SocketContext.jsx
import { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { auth } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (auth?.user?._id && token) {
      socketRef.current = io("http://localhost:5000", {
        auth: { token },
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => {
        console.log("📡 Socket Connected:", socketRef.current.id);
      });

      // Optional: Save to global for debugging
      window.socket = socketRef.current;

      return () => {
        socketRef.current.disconnect();
        console.log("❌ Socket Disconnected");
      };
    }
  }, [auth?.user?._id]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
