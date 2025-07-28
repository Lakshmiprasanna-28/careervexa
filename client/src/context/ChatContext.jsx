import { createContext } from "react";

export const ChatContext = createContext({
  user: null,
  setUser: () => {},

  selectedThreadId: null,
  setSelectedThreadId: () => {},

  selectedThread: null,
  setSelectedThread: () => {},

  messages: [],
  setMessages: () => {},
  addMessageToThread: () => {},

  threads: [],
  setThreads: () => {},

  socket: null,
  setSocket: () => {},

  isTyping: false,
  setIsTyping: () => {},

  onlineUsers: [],
  setOnlineUsers: () => {},

  blockedUsers: [],
  setBlockedUsers: () => {},

  fetchThreads: () => {},
});
