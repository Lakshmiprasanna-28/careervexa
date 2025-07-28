// client/src/pages/SetPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      return toast.warning("Please fill in both fields.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      await axios.post(
        "/api/auth/set-password",
        { email: auth?.email, newPassword },
        { withCredentials: true }
      );
      toast.success("✅ Password set successfully!");
      navigate("/settings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-blue-600">🔐 Set Your Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Save Password
        </button>
      </form>
    </section>
  );
}
