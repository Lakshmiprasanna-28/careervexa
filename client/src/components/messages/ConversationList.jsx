// 📁 client/src/components/messages/ConversationList.jsx
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../../context/useChat";

export default function ConversationList() {
  const { user, threads, fetchThreads, selectedThreadId, setSelectedThreadId } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    fetchThreads();
    const handleRefresh = () => fetchThreads();
    window.addEventListener("refreshThreads", handleRefresh);
    return () => window.removeEventListener("refreshThreads", handleRefresh);
  }, [fetchThreads]);

  const handleClick = (threadId) => {
    if (threadId !== selectedThreadId) {
      setSelectedThreadId(threadId);
      navigate(`/messages/${threadId}`);
    }
  };

  const threadList = useMemo(() => threads, [threads]);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!threadList || threadList.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400 dark:text-gray-500">
        No chats yet
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {threadList.map((thread) => {
        const otherUser = thread.participants?.find(
          (p) => p._id !== user?.id && p._id !== user?._id
        );
        if (!otherUser) return null;

        const unreadCount = thread.unreadCount || 0;
        const lastMsg = thread.latestMessage || thread.lastMessage;

        let lastMessage = "No messages yet";

        if (lastMsg) {
          const isFromYou =
            lastMsg.senderId?._id === user?._id || lastMsg.senderId === user?.id;

          if (lastMsg.content?.trim()) {
            lastMessage = isFromYou
              ? `You: ${lastMsg.content}`
              : lastMsg.content;
          } else if (lastMsg.type === "media") {
            lastMessage = isFromYou ? "You sent a media" : "📎 Media message";
          }
        }

        return (
          <div
            key={thread._id}
            onClick={() => handleClick(thread._id)}
            className={`flex items-center justify-between px-4 py-3 cursor-pointer rounded-lg transition-colors duration-150 ${
              selectedThreadId === thread._id
                ? "bg-blue-100 dark:bg-blue-900"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={
                  otherUser.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    otherUser.name || otherUser.email || "U"
                  )}`
                }
                alt={otherUser.name || "User"}
                className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-700"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                  {otherUser.name || otherUser.email || "Unknown User"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 truncate">
                  {lastMessage}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end ml-2">
              {lastMsg?.createdAt && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">
                  {formatTime(lastMsg.createdAt)}
                </span>
              )}
              {unreadCount > 0 && (
                <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
