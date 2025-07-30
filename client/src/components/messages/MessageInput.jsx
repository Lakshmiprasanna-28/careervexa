// 📁 client/src/components/messages/MessageInput.jsx
import React, { useState, useRef, useEffect } from "react";
import { sendMessage } from "../../../api/MessageApi";
import { useChat } from "../../context/useChat.jsx";
import EmojiPicker from "./EmojiPicker";
import MediaPreview from "./MediaPreview";
import { Paperclip, Send } from "lucide-react";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const textareaRef = useRef(null);

  const { selectedThread, socket, user, setMessages, setThreads } = useChat();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleSend = async () => {
    if (!selectedThread?._id || (!text.trim() && !media)) return;

    const formData = new FormData();
    formData.append("senderId", user?._id || user?.id);
    if (text.trim()) formData.append("content", text.trim());
    if (media) formData.append("media", media);

    try {
      const token = localStorage.getItem("token");
      const response = await sendMessage(selectedThread._id, formData, token);

      const newMessage = response.message || response;

      const localMessage = {
        ...newMessage,
        _id: newMessage._id || `${Date.now()}-${Math.random()}`,
        sender: user?._id || user?.id,
        createdAt: newMessage.createdAt || new Date().toISOString(),
        threadId: selectedThread._id,
      };

      setMessages((prev) => {
        const exists = prev.some((m) => m._id === localMessage._id);
        return exists ? prev : [...prev, localMessage];
      });

      // ✅ Update sidebar preview immediately
      const previewContent = text.trim() || (media ? "📎 Media file" : "");
      setThreads((prevThreads) => {
        const updated = prevThreads.map((t) =>
          t._id === selectedThread._id
            ? {
                ...t,
                latestMessage: {
                  content: previewContent,
                  createdAt: localMessage.createdAt,
                  sender: {
                    _id: user?._id || user?.id,
                    name: user?.name || "You",
                  },
                },
              }
            : t
        );
        const sorted = [
          updated.find((t) => t._id === selectedThread._id),
          ...updated.filter((t) => t._id !== selectedThread._id),
        ];
        return sorted;
      });

      // 🔁 Socket notify
      if (socket) {
        socket.emit("newMessage", localMessage);
        socket.emit("threadUpdated", { threadId: selectedThread._id });
      }

      setText("");
      setMedia(null);
    } catch (error) {
      console.error("❌ Message send failed:", error);
    }
  };

  const handleTyping = () => {
    if (selectedThread?._id && socket) {
      socket.emit("typing", {
        threadId: selectedThread._id,
        userId: user?._id || user?.id,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setMedia(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`relative border-t p-3 flex items-center gap-3 bg-white dark:bg-gray-950 shadow-inner transition ${dragActive ? "ring-2 ring-blue-400" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <EmojiPicker value={text} onChange={setText} />

      <textarea
        ref={textareaRef}
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleTyping}
        onKeyPress={handleKeyPress}
        rows={1}
      />

      <input
        type="file"
        accept="image/*,video/*,application/pdf"
        onChange={(e) => setMedia(e.target.files[0])}
        className="hidden"
        id="fileUpload"
      />
      <label
        htmlFor="fileUpload"
        className="cursor-pointer text-blue-600 hover:text-blue-700 transition"
        title="Attach file"
      >
        <Paperclip size={20} />
      </label>

      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition-transform active:scale-95"
      >
        <Send size={16} /> Send
      </button>

      {media && (
        <div className="absolute bottom-14 left-3">
          <MediaPreview file={media} onRemove={() => setMedia(null)} />
        </div>
      )}
    </div>
  );
}
