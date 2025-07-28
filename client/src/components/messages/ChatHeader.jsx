// 📁 client/src/components/messages/ChatHeader.jsx
import React, { useMemo, useState } from "react";
import { useChat } from "../../context/useChat.jsx";
import { EllipsisVertical } from "lucide-react";
import toast from "react-hot-toast";
import {
  blockUser,
  clearChatMessages,
  deleteChat
} from "../../api/messageApi.js";

function ChatHeaderComponent() {
  const {
    selectedThread,
    user,
    setSelectedThread,
    fetchThreads,
    setMessages
  } = useChat();
  const [showMenu, setShowMenu] = useState(false);

  const otherUser = useMemo(() => {
    return selectedThread?.participants?.find(
      (p) => p._id !== user?.id && p._id !== user?._id
    );
  }, [selectedThread, user]);

  const handleBlockUser = async () => {
    try {
      if (!otherUser?._id) return;
      await blockUser(otherUser._id, user.token);
      toast.success("🚫 User blocked successfully");
      setShowMenu(false);
    } catch (err) {
      console.error("Block error:", err);
      toast.error("Failed to block user");
    }
  };

  const handleDeleteChat = async () => {
    try {
      await deleteChat(selectedThread._id, user.token);
      setSelectedThread(null);
      await fetchThreads();
      toast.success("🗑️ Chat deleted");
      setShowMenu(false);
    } catch (err) {
      console.error("Delete chat error:", err);
      toast.error("Failed to delete chat");
    }
  };

  const handleClearChat = async () => {
    try {
      await clearChatMessages(selectedThread._id, user.token);
      setMessages([]);
      toast.success("🧹 Chat cleared");
      setShowMenu(false);
    } catch (err) {
      console.error("Clear chat error:", err);
      toast.error("Failed to clear chat");
    }
  };

  const handleCopyEmail = () => {
    if (otherUser?.email) {
      navigator.clipboard.writeText(otherUser.email);
      toast.success("📋 Email copied to clipboard");
    }
    setShowMenu(false);
  };

  if (!selectedThread) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-white dark:bg-gray-950 dark:border-gray-700 shadow-sm relative">
      <div className="flex items-center gap-3">
        <img
          src={
            otherUser?.avatar ||
            `https://ui-avatars.com/api/?name=${otherUser?.name || otherUser?.email || "U"}`
          }
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {otherUser?.name || otherUser?.email || "Unknown User"}
          </div>
          <div className="text-xs text-green-500">● Online</div>
        </div>
      </div>

      <div className="relative">
        <button
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <EllipsisVertical size={20} className="text-gray-600 dark:text-gray-300" />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded shadow z-50 overflow-hidden">
            <button
              onClick={handleBlockUser}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🚫 Block User
            </button>
            <button
              onClick={handleDeleteChat}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🗑️ Delete Chat
            </button>
            <button
              onClick={handleClearChat}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              🧹 Clear Chat
            </button>
            <button
              onClick={handleCopyEmail}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              📋 Copy Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(ChatHeaderComponent);
