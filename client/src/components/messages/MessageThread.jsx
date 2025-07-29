// 📁 client/src/components/messages/MessageThread.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { getMessages, markAsRead } from "../api/MessageApi";
import { useChat } from "../../context/useChat.jsx";
import MessageBubble from "./MessageBubble";
import ScrollToBottom from "./ScrollToBottom";
import TypingIndicator from "./TypingIndicator";

export default function MessageThread() {
  const { selectedThread, socket, user, messages, setMessages } = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const isAutoScroll = useRef(true);

  // === Fetch messages when thread changes ===
  const fetchThreadMessages = useCallback(async () => {
    if (!selectedThread?._id || !user?.token) return;
    try {
      const res = await getMessages(selectedThread._id, user.token);
      const msgs = Array.isArray(res) ? res : res.messages || [];

      setMessages((prev) => {
        if (
          prev.length &&
          prev[prev.length - 1]?._id === msgs[msgs.length - 1]?._id
        ) {
          return prev;
        }
        return msgs;
      });

      await markAsRead(selectedThread._id, user.token);
    } catch (err) {
      console.error("❌ Error loading messages:", err.response?.data || err.message);
    }
  }, [selectedThread?._id, user?.token, setMessages]);

  useEffect(() => {
    if (selectedThread?._id) fetchThreadMessages();
  }, [selectedThread?._id, fetchThreadMessages]);

  // === Socket listeners ===
  useEffect(() => {
    if (!socket || !selectedThread?._id) return;

    const handleNewMessage = (message) => {
      if (message.threadId === selectedThread._id) {
        setMessages((prev) =>
          prev.some((m) => m._id === message._id) ? prev : [...prev, message]
        );
        markAsRead(selectedThread._id, user.token).catch(() => {});
      }
    };

    const handleTyping = (data) => {
      if (data.threadId === selectedThread._id && data.userId !== user._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
    };
  }, [socket, selectedThread?._id, user?._id, user?.token, setMessages]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    isAutoScroll.current = scrollHeight - clientHeight - scrollTop < 50;
  };

  useEffect(() => {
    if (isAutoScroll.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedThread) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto bg-white p-4 relative dark:bg-gray-900"
      onScroll={handleScroll}
    >
      <div className="space-y-3 pb-20">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={msg._id || `msg-${index}`} message={msg} />
          ))
        )}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <ScrollToBottom />
    </div>
  );
}
