// 📁 client/src/pages/Messages.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "../api/axios";
import ChatHeader from "../components/messages/ChatHeader";
import MessageThread from "../components/messages/MessageThread";
import MessageInput from "../components/messages/MessageInput";
import ConversationList from "../components/messages/ConversationList";
import { Loader2, Search, X } from "lucide-react";
import { useChat } from "../context/useChat.jsx";

export default function Messages() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const resultsRef = useRef(null);
  const searchRef = useRef(null);

  const {
    selectedThreadId,
    setSelectedThread,
    setSelectedThreadId,
    setMessages,
  } = useChat(); // Removed fetchThreads (was unused)

  // === SEARCH USERS ===
  const fetchUsers = useCallback(
    async (term = "", pageNum = 1) => {
      if (loading || hasError) return;
      setLoading(true);
      setHasError(false);

      try {
        const url = `/api/users/search?query=${term}&page=${pageNum}&limit=20`;
        const res = await axios.get(url);
        const users = res.data.users || [];

        setSearchResults((prev) =>
          pageNum === 1 ? users : [...prev, ...users]
        );

        setHasMore(users.length >= 20);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
        setHasError(true);
        setHasMore(false);
        if (pageNum === 1) setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasError]
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm.trim()) {
        setPage(1);
        fetchUsers(searchTerm.trim(), 1);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, fetchUsers]);

  useEffect(() => {
    if (page > 1 && !hasError) {
      fetchUsers(searchTerm.trim(), page);
    }
  }, [page, searchTerm, fetchUsers, hasError]);

  const handleScroll = useCallback(() => {
    if (!resultsRef.current || loading || !hasMore || hasError) return;
    const { scrollTop, scrollHeight, clientHeight } = resultsRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore, hasError]);

  useEffect(() => {
    const div = resultsRef.current;
    if (div) div.addEventListener("scroll", handleScroll);
    return () => div && div.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // === START A NEW CONVERSATION ===
  const startConversation = async (user) => {
    try {
      const res = await axios.post("/api/messages/start", {
        receiverId: user._id,
      });
      const thread = res.data?.thread || res.data;

      if (thread) {
        setSelectedThreadId((prevId) => {
          if (prevId !== thread._id) setMessages([]);
          return thread._id;
        });
        setSelectedThread(thread);
        window.dispatchEvent(new Event("refreshThreads"));
      }

      setSearchTerm("");
      setSearchResults([]);
      setShowDropdown(false);
    } catch (err) {
      console.error("❌ Failed to start chat:", err);
    }
  };

  // === CLOSE DROPDOWN WHEN CLICKING OUTSIDE ===
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* === SEARCH BAR === */}
      <div className="relative p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
        <div ref={searchRef} className="flex items-center space-x-2">
          <Search className="text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setHasError(false);
              setShowDropdown(true);
            }}
            placeholder="Search by name or email"
            className="w-full p-2 bg-transparent outline-none text-gray-900 dark:text-white"
          />
          {loading && searchResults.length === 0 ? (
            <Loader2 className="animate-spin text-gray-400" />
          ) : searchTerm ? (
            <X
              className="cursor-pointer text-gray-400"
              onClick={() => {
                setSearchTerm("");
                setSearchResults([]);
                setPage(1);
                setShowDropdown(false);
              }}
            />
          ) : null}
        </div>

        {showDropdown && (
          <div
            ref={resultsRef}
            className="absolute z-10 top-full left-0 right-0 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto mt-2"
          >
            {loading && searchResults.length === 0 && (
              <div className="p-3 text-gray-500 dark:text-gray-400 text-sm">
                Searching...
              </div>
            )}
            {hasError && (
              <div className="p-3 text-red-500 dark:text-red-400 text-sm">
                ⚠️ Failed to load users. Try again later.
              </div>
            )}
            {!loading && !hasError && searchResults.length === 0 && (
              <div className="p-3 text-gray-500 dark:text-gray-400 text-sm">
                No users found.
              </div>
            )}
            {!hasError &&
              searchResults.map((user) => (
                <div
                  key={user._id}
                  onClick={() => startConversation(user)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                      )}`
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
              ))}
            {loading && searchResults.length > 0 && !hasError && (
              <div className="p-3 text-gray-500 dark:text-gray-400 text-center text-sm">
                Loading more...
              </div>
            )}
          </div>
        )}
      </div>

      {/* === MAIN LAYOUT === */}
      <div className="flex h-[calc(100vh-70px)]">
        {/* Left Sidebar - Conversations */}
        <div className="w-[350px] border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <ConversationList
            emptyState={
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <p className="text-gray-500 dark:text-gray-400">
                  No conversations yet.
                </p>
                <button
                  onClick={() => setShowDropdown(true)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Start a Chat
                </button>
              </div>
            }
          />
        </div>

        {/* Right Panel - Messages */}
        <div className="flex flex-col flex-1 bg-white dark:bg-gray-950">
          {selectedThreadId ? (
            <>
              <ChatHeader />
              <MessageThread />
              <MessageInput />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-500 dark:text-gray-400">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
