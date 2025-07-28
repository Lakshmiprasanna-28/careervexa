// client/src/components/LoggedInNavbar.jsx

import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { DarkModeContext } from "../context/DarkModeContext";
import NotificationBell from "./NotificationBell"; // 🔔 Imported here
import axios from "axios";
import { toast } from "react-toastify";

export default function LoggedInNavbar() {
  const { auth, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [userName, setUserName] = useState("User");

  const clientAdminWhitelist = [
    "thotalakshmiprasanna825@gmail.com",
    "pavanmuddars@gmail.com",
    "brilligo28@gmail.com",
  ];

  const isWhitelistedAdmin =
    auth?.email && clientAdminWhitelist.includes(auth.email.toLowerCase());

  const canSwitchToAdmin = auth?.role === "admin" || isWhitelistedAdmin;

  const dashboardLink =
    auth?.role === "employer"
      ? "/recruiter-dashboard"
      : auth?.role === "admin"
      ? "/admin-dashboard"
      : "/jobseeker-dashboard";

  const profileLink =
    auth?.role === "employer"
      ? "/recruiter-profile"
      : auth?.role === "admin"
      ? "/admin-profile"
      : "/jobseeker-profile";

  useEffect(() => {
    if (auth?.name) {
      const formatName = (name) =>
        name
          .split(" ")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join(" ");
      setUserName(formatName(auth.name));
    }
  }, [auth]);

  const handleLogout = () => {
    logout(); // Toast and redirect already handled inside logout
  };

  const handleRoleSwitch = async (newRole) => {
    try {
      await axios.put(
        "/api/profile",
        { role: newRole },
        { withCredentials: true }
      );
      toast.success(`✅ Switched to ${newRole}`);
      window.location.reload();
    } catch {
      toast.error("❌ Failed to switch role");
    }
  };

  return (
    <header className="bg-blue-600 dark:bg-gray-800 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/home" className="text-2xl font-bold tracking-tight">
          💼 Careervexa
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link to="/jobs" className="hover:underline hover:text-blue-200">Jobs</Link>
          <Link to="/companies" className="hover:underline hover:text-blue-200">Companies</Link>
          <Link to="/blog" className="hover:underline hover:text-blue-200">Blog</Link>
          <Link to={dashboardLink} className="hover:underline hover:text-blue-200">Dashboard</Link>
          <Link to="/messages" className="hover:underline hover:text-blue-200">Messages</Link>

          {/* 🔔 Notification Bell */}
          <NotificationBell />

          {/* 👤 User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 font-medium"
            >
              👤 {userName} <span className="text-xs">▼</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 text-black dark:text-white border rounded-md shadow-md z-50 text-sm">
                <Link to={profileLink} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  View Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Settings
                </Link>
                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                <button
                  onClick={() => setShowRoles((prev) => !prev)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Switch Role
                </button>
                {showRoles && (
                  <>
                    <button
                      onClick={() => handleRoleSwitch("seeker")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Job Seeker
                    </button>
                    <button
                      onClick={() => handleRoleSwitch("employer")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Recruiter
                    </button>
                    {canSwitchToAdmin && (
                      <button
                        onClick={() => handleRoleSwitch("admin")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Admin
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 italic">
                  To switch GitHub or Google account, please logout from GitHub/Google first.
                </div>
              </div>
            )}
          </div>

          {/* 🌙 Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-xl hover:text-yellow-200 dark:hover:text-blue-400"
            title="Toggle Dark Mode"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </nav>
      </div>
    </header>
  );
}
