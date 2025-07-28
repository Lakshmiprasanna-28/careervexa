import { useContext } from "react";
import { ChatContext } from "./ChatContext";
import { useAuth } from "../hooks/useAuth"; // ✅ Corrected path

export const useChat = () => {
  const context = useContext(ChatContext);
  const { user: authUser } = useAuth(); // fallback user from auth

  if (!context) {
    throw new Error("❌ useChat must be used within a ChatProvider");
  }

  return {
    ...context,
    user: context.user || authUser || null,
  };
};
