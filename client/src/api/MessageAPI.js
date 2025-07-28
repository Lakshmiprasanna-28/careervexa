// 📁 client/src/api/messageApi.js
import axios from "axios";

const API = import.meta.env.VITE_API_URL;
console.log("🔗 API Base URL:", API);

// Helper function for API requests with token
const authHeaders = (token, contentType = "application/json") => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": contentType,
});

// ✅ Send message (text or media)
export const sendMessage = async (threadId, formData, token) => {
  try {
    const res = await axios.post(
      `${API}/messages/threads/${threadId}/messages`,
      formData,
      { headers: authHeaders(token, "multipart/form-data") }
    );
    const { message, thread } = res.data || {};
    return thread ? { message, thread } : res.data;
  } catch (error) {
    console.error("❌ Error sending message:", error.response?.data || error);
    throw error;
  }
};

// ✅ Get all threads of logged-in user
export const getThreads = async (userId, token) => {
  try {
    const res = await axios.get(`${API}/messages/threads/${userId}`, {
      headers: authHeaders(token),
    });

    const threads = Array.isArray(res.data) ? res.data : [];

    // Filter and sort threads
    const filteredThreads = threads.filter(
      (thread) =>
        Array.isArray(thread.participants) &&
        thread.participants.some((p) => p._id !== userId)
    );

    return filteredThreads.sort((a, b) => {
      const aTime = new Date(a.latestMessage?.createdAt || 0).getTime();
      const bTime = new Date(b.latestMessage?.createdAt || 0).getTime();
      return bTime - aTime;
    });
  } catch (error) {
    console.error("❌ Error fetching threads:", error.response?.data || error);
    return [];
  }
};

// ✅ Get all messages of a thread
export const getMessages = async (threadId, token) => {
  try {
    const res = await axios.get(
      `${API}/messages/threads/${threadId}/messages`,
      { headers: authHeaders(token) }
    );
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error("❌ Error fetching messages:", error.response?.data || error);
    return [];
  }
};

// ✅ Mark a thread as read
export const markAsRead = async (threadId, token) => {
  try {
    const res = await axios.put(
      `${API}/messages/threads/${threadId}/read`,
      {},
      { headers: authHeaders(token) }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error marking as read:", error.response?.data || error);
    throw error;
  }
};

// ✅ Block a user
export const blockUser = async (userId, token) => {
  try {
    const res = await axios.put(
      `${API}/messages/block/${userId}`,
      {},
      { headers: authHeaders(token) }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error blocking user:", error.response?.data || error);
    throw error;
  }
};

// ✅ Clear all messages from a thread
export const clearChatMessages = async (threadId, token) => {
  try {
    const res = await axios.put(
      `${API}/messages/threads/${threadId}/clear`,
      {},
      { headers: authHeaders(token) }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error clearing chat:", error.response?.data || error);
    throw error;
  }
};

// ✅ Delete selected messages
export const deleteSelectedMessages = async (messageIds, token) => {
  try {
    const res = await axios.post(
      `${API}/messages/delete-many`,
      { messageIds },
      { headers: authHeaders(token) }
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error deleting selected messages:",
      error.response?.data || error
    );
    throw error;
  }
};

// ✅ Delete an entire thread
export const deleteChat = async (threadId, token) => {
  try {
    const res = await axios.delete(`${API}/messages/threads/${threadId}`, {
      headers: authHeaders(token),
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error deleting chat:", error.response?.data || error);
    throw error;
  }
};

// ✅ Search for users
export const searchUsers = async (query, token) => {
  try {
    const res = await axios.get(`${API}/users/search?query=${query}`, {
      headers: authHeaders(token),
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error searching users:", error.response?.data || error);
    return [];
  }
};
