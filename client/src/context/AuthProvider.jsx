// client/src/context/AuthProvider.jsx
import { useState, useEffect, useCallback } from "react";
import AuthContext from "./AuthContext";
import api from "../api/axios"; // ✅ Use custom axios instance

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(null);
  };

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuth(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/api/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAuth({ ...res.data, token });
    } catch (err) {
      console.error("❌ fetchUser failed:", err?.response?.data || err.message);
      if (
        err?.response?.status === 401 ||
        err?.response?.data?.message?.toLowerCase().includes("token")
      ) {
        logout(); // 🔥 auto logout if token is invalid
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, login, logout, loading, setLoading, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
