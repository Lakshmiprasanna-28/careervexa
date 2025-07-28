// client/src/hooks/useNotifications.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const socket = io("http://localhost:5000", {
      auth: { userId },
    });

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("/api/notifications", { withCredentials: true });
        setNotifications(res.data);
        setHasUnread(res.data.some((n) => !n.isRead));
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };

    fetchNotifications();

    socket.on("new_notification", (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setHasUnread(true);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`, {}, { withCredentials: true });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setHasUnread(notifications.some((n) => !n.isRead));
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`, { withCredentials: true });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Error deleting notification", err);
    }
  };

  return {
    notifications,
    hasUnread,
    markAsRead,
    deleteNotification,
  };
};
