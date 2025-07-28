import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const LIMIT = 10;

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { auth } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();

  const fetchNotifications = async (pageNum = 1) => {
    try {
      const res = await axios.get(`/api/notifications?page=${pageNum}&limit=${LIMIT}`);
      const newNotifs = res.data.notifications || res.data;
      if (pageNum === 1) {
        setNotifications(newNotifs);
      } else {
        setNotifications((prev) => [...prev, ...newNotifs]);
      }
      setHasMore(newNotifs.length === LIMIT);
    } catch (err) {
      console.error("❌ Failed to fetch notifications:", err);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("❌ Failed to mark as read:", err);
    }
  };

  const deleteNotif = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("🗑️ Notification deleted");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      toast.error("Error deleting notification");
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) await markAsRead(notif._id);
    if (notif.link) navigate(notif.link);
  };

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  useEffect(() => {
    if (!socket || !auth?.user?._id) return;
    socket.emit("join", auth.user._id);

    const handleNewNotification = (notif) => {
      toast.success(notif.message);
      setNotifications((prev) => [notif, ...prev]);
    };

    socket.on("new_notification", handleNewNotification);
    return () => socket.off("new_notification", handleNewNotification);
  }, [socket, auth?.user?._id]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 border-b border-gray-300 dark:border-gray-700 pb-4">
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <span role="img" aria-label="bell">🔔</span> Your Notifications
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View all your alerts & updates
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="mt-16 text-center text-gray-500 dark:text-gray-400">
            <h2 className="text-xl font-medium mb-2">🎉 You’re all caught up!</h2>
            <p>No new notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-5 rounded-xl shadow-md cursor-pointer border flex justify-between items-start gap-4 transition-all ${
                  notif.isRead
                    ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    : "bg-indigo-100 dark:bg-indigo-700/20 border-indigo-300 dark:border-indigo-500 hover:bg-indigo-200 dark:hover:bg-indigo-600/30"
                }`}
              >
                <div className="flex-1">
                  <p className="text-base">{notif.message}</p>
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                    {new Date(notif.createdAt).toLocaleString()}
                  </p>

                  <div className="mt-3 flex gap-4">
                    {!notif.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif._id);
                        }}
                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotif(notif._id);
                      }}
                      className="text-sm text-red-600 hover:underline dark:text-red-400"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <Trash2 className="w-4 h-4 mt-1 text-red-500 hover:text-red-700 dark:hover:text-red-300" />
              </div>
            ))}

            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMore}
                  className="text-blue-600 hover:underline dark:text-blue-400 text-sm"
                >
                  Load more
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
