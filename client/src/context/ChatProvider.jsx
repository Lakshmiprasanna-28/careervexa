// === client/src/context/ChatProvider.jsx ===
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChatContext } from "./ChatContext";
import { connectSocket, getSocket } from "../pages/socket";
import { getThreads, markAsRead } from "../api/MessageApi";
import { useLocation } from "react-router-dom";

const ChatProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const didInitRef = useRef(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const savedThreadId = localStorage.getItem("selectedThreadId");
    const onMessagesRoot = location.pathname === "/messages";
    if (savedThreadId && !onMessagesRoot) {
      setSelectedThreadId(savedThreadId);
    } else {
      setSelectedThreadId(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (selectedThreadId) {
      localStorage.setItem("selectedThreadId", selectedThreadId);
    } else {
      localStorage.removeItem("selectedThreadId");
    }
  }, [selectedThreadId]);

  const fetchThreads = useCallback(async () => {
    if (!user?.token || !user?.id) return;
    try {
      const fetchedThreads = await getThreads(user.id, user.token);
      setThreads((prevThreads) => {
        const mergedThreads = fetchedThreads.map((t) => {
          const existing = prevThreads.find((x) => x._id === t._id);
          return {
            ...t,
            lastMessage: t.lastMessage ?? existing?.lastMessage ?? t.messages?.slice(-1)[0] ?? null,
          };
        });

        return mergedThreads.sort((a, b) => {
          const aTime = new Date(a.lastMessage?.createdAt || 0).getTime();
          const bTime = new Date(b.lastMessage?.createdAt || 0).getTime();
          return bTime - aTime;
        });
      });

      if (selectedThreadId) {
        const match = fetchedThreads.find((t) => t._id === selectedThreadId);
        if (match) setSelectedThread((prev) => ({ ...prev, ...match }));
        else {
          setSelectedThreadId(null);
          setSelectedThread(null);
        }
      }
    } catch (err) {
      console.error("❌ Failed to fetch threads:", err);
    }
  }, [user?.token, user?.id, selectedThreadId]);

  const updateThreadPreview = useCallback(
    (threadId, message) => {
      setThreads((prevThreads) => {
        const existingThread = prevThreads.find((t) => t._id === threadId);
        if (!existingThread) return prevThreads;

        const updatedThread = { ...existingThread, lastMessage: message };
        const remainingThreads = prevThreads.filter((t) => t._id !== threadId);
        return [updatedThread, ...remainingThreads];
      });

      if (selectedThreadId === threadId) {
        setSelectedThread((prev) => ({ ...prev, lastMessage: message }));
      }
    },
    [selectedThreadId]
  );

  useEffect(() => {
    if (!user?.token || didInitRef.current) return;
    didInitRef.current = true;

    let activeSocket = getSocket();
    if (!activeSocket) activeSocket = connectSocket(user.token);
    setSocket(activeSocket);

    activeSocket.on("threadUpdated", fetchThreads);

    activeSocket.on("newMessage", (message) => {
      if (message.threadId === selectedThreadId) {
        setMessages((prev) =>
          prev.some((m) => m._id === message._id) ? prev : [...prev, message]
        );
        markAsRead(selectedThreadId, user.token);
      }
      updateThreadPreview(message.threadId, message);
    });

    activeSocket.on("messageStatusUpdated", ({ messageId, isDelivered, isRead }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId
            ? { ...msg, isDelivered: isDelivered ?? msg.isDelivered, isRead: isRead ?? msg.isRead }
            : msg
        )
      );
    });

    fetchThreads();

    return () => {
      activeSocket.off("threadUpdated", fetchThreads);
      activeSocket.off("newMessage");
      activeSocket.off("messageStatusUpdated");
    };
  }, [user?.token, fetchThreads, selectedThreadId, updateThreadPreview]);

  useEffect(() => {
    if (selectedThreadId && threads.length > 0) {
      const match = threads.find((t) => t._id === selectedThreadId);
      setSelectedThread(match || null);
    }
  }, [selectedThreadId, threads]);

  const addMessageToThread = (message) => {
    setMessages((prev) =>
      prev.some((m) => m._id === message._id) ? prev : [...prev, message]
    );
    updateThreadPreview(message.threadId, message);
  };

  const sendMessageAndUpdateSidebar = (message) => {
    setMessages((prev) => [...prev, message]);
    updateThreadPreview(message.threadId, message);
  };

  const clearCurrentChat = () => {
    setMessages([]);
    setThreads((prevThreads) =>
      prevThreads.map((t) =>
        t._id === selectedThreadId ? { ...t, lastMessage: null } : t
      )
    );
    if (selectedThread) {
      setSelectedThread((prev) => ({ ...prev, lastMessage: null }));
    }
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedThreadId,
        setSelectedThreadId,
        selectedThread,
        setSelectedThread,
        messages,
        setMessages,
        addMessageToThread,
        sendMessageAndUpdateSidebar,
        threads,
        setThreads,
        socket,
        setSocket,
        isTyping,
        setIsTyping,
        onlineUsers,
        setOnlineUsers,
        blockedUsers,
        setBlockedUsers,
        fetchThreads,
        clearCurrentChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
