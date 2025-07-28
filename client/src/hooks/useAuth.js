// === client/src/hooks/useAuth.js ===
import { useContext, useCallback } from "react";
import AuthContext from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext"; // ✅ Added this
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useAuth() {
  const { auth, setAuth, loading, setLoading } = useContext(AuthContext);
  const { setUser } = useContext(ChatContext); // ✅ Add this to sync with ChatProvider
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    console.log("🚪 Logging out...");
    try {
      await axios.get("/api/auth/logout", { withCredentials: true });
    } catch (error) {
      console.warn("⚠️ Logout failed:", error.message);
    } finally {
      setAuth(null);
      setUser(null); // ✅ clear chat context on logout too
      localStorage.removeItem("user"); // ✅ clear localStorage user
      toast.success("✅ Logged out");
      navigate("/");
    }
  }, [setAuth, navigate, setUser]);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🌐 Fetching user...");

      const res = await axios.get("/api/user/me", {
        withCredentials: true,
      });

      // ✅ Fix: Check if the token is nested inside or needs to be added manually
      const token = localStorage.getItem("token"); // Try pulling from localStorage (if saved during login)
      const userData = {
        id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        token: token || res.data.token, // ✅ fallback logic
      };

      setAuth(userData);
      setUser(userData); // ✅ update ChatProvider
      localStorage.setItem("user", JSON.stringify(userData)); // ✅ store user for page refresh
      console.log("✅ User fetched & stored:", userData);
    } catch (error) {
      console.error("❌ Fetch failed:", error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [logout, setAuth, setUser, setLoading]);

  const login = async () => {
    console.log("🔐 Logging in...");
    await fetchUser();
  };

  const updateAuth = (userData) => {
    console.log("🔄 Updating auth context");
    setAuth(userData);
    setUser(userData); // ✅ sync with ChatProvider
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return {
    auth,
    setAuth,
    login,
    logout,
    loading,
    setLoading,
    fetchUser,
    updateAuth,
  };
}
