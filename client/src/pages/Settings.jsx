import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function Settings() {
  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedDarkMode);
    if (storedDarkMode) document.documentElement.classList.add("dark");
  }, []);

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/user/settings",
        { emailNotifications, smsNotifications, darkMode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("darkMode", darkMode);
      toast.success("Settings saved successfully!");

      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings.");
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action is permanent!"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      toast.success("Account deleted. Goodbye! 👋");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account.");
    }
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold">⚙️ Settings</h1>

        {/* Notifications */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">🔔 Notifications</h2>
          <div className="flex items-center justify-between">
            <label>Email Notifications</label>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              className="w-5 h-5"
            />
          </div>
          <div className="flex items-center justify-between">
            <label>SMS Notifications</label>
            <input
              type="checkbox"
              checked={smsNotifications}
              onChange={() => setSmsNotifications(!smsNotifications)}
              className="w-5 h-5"
            />
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold">🌗 Appearance</h2>
          <div className="flex items-center justify-between">
            <label>Dark Mode</label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => {
                const updated = !darkMode;
                setDarkMode(updated);
                document.documentElement.classList.toggle("dark", updated);
              }}
              className="w-5 h-5"
            />
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-300">⚠️ Danger Zone</h2>
          <p className="text-sm text-red-600 dark:text-red-400">
            This action is irreversible. Your account and all associated data will be permanently deleted.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Delete My Account
          </button>
        </div>

        <button
          onClick={handleSaveSettings}
          className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded"
        >
          Save Settings
        </button>
      </div>
    </section>
  );
}
