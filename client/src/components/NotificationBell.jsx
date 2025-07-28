import React, { useEffect, useState, useRef } from "react";
import { Bell, Trash2 } from "lucide-react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { toast } from "react-hot-toast";

const LIMIT = 6;

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const bellRef = useRef(null);
  const socket = useSocket();
  const navigate = useNavigate();

  const fetchNotifications = async (pageNum = 1) => {
    try {
      const res = await axios.get(`/api/notifications?page=${pageNum}&limit=${LIMIT}`);
      const newNotifs = res.data.notifications || [];

      if (pageNum === 1) {
        setNotifications(newNotifs);
      } else {
        setNotifications((prev) => [...prev, ...newNotifs]);
      }

      setHasMore(newNotifs.length === LIMIT);
      const unread = newNotifs.filter((n) => !n.isRead).length;
      setUnreadCount((prev) => (pageNum === 1 ? unread : prev));
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err.message);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("🗑️ Notification deleted");
    } catch (err) {
      console.error("❌ Delete failed:", err.message);
      toast.error("Error deleting notification");
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("❌ Failed to mark as read:", err.message);
    }
  };

  const handleClickOutside = (e) => {
    if (bellRef.current && !bellRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  const toggleDropdown = () => {
    const openNow = !dropdownOpen;
    setDropdownOpen(openNow);
    if (openNow) fetchNotifications(1);
  };

  useEffect(() => {
    fetchNotifications(1);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notif) => {
      toast.success(notif.message);
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("new_notification", handleNewNotification);
    return () => socket.off("new_notification", handleNewNotification);
  }, [socket]);

  return (
    <div className="relative" ref={bellRef}>
      <button
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
        onClick={toggleDropdown}
        aria-label="Toggle notifications"
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-white" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 text-xs text-white bg-red-600 rounded-full flex items-center justify-center shadow">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 z-20 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
          <div className="p-3 font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700">
            🔔 Notifications
          </div>

          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          ) : (
            <>
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`px-4 py-3 text-sm flex justify-between items-center gap-2 transition hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded ${
                    notif.isRead
                      ? "text-gray-600 dark:text-gray-300"
                      : "font-semibold text-black dark:text-white"
                  }`}
                  onClick={() => {
                    markAsRead(notif._id);
                    if (notif.link) navigate(notif.link);
                  }}
                >
                  <div className="flex-1">{notif.message}</div>
                  <Trash2
                    className="w-4 h-4 text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                  />
                </div>
              ))}

              {hasMore && (
                <div className="text-center py-3 bg-gray-50 dark:bg-gray-800">
                  <button
                    onClick={loadMore}
                    className="text-blue-600 text-sm hover:underline dark:text-blue-400"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
