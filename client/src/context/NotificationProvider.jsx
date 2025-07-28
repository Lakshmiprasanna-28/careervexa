// client/src/context/NotificationProvider.jsx
import { useState, useEffect, useCallback } from "react";
import axios from "../api/axios"; // 🧠 use the axios instance
import NotificationContext from "./NotificationContext";
import { useAuth } from "../hooks/useAuth";

export const NotificationProvider = ({ children }) => {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    if (!auth || !auth.token) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setNotifications(res.data || []);
    } catch (err) {
      if (err?.response?.status === 401) {
        console.warn("⚠️ Unauthorized: JWT expired or missing");
      } else {
        console.error("❌ Error fetching notifications:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const markAsRead = async (id) => {
    try {
      await axios.put(
        "/api/notifications/read",
        { id },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("❌ Error marking notification as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <NotificationContext.Provider
      value={{ notifications, loading, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
