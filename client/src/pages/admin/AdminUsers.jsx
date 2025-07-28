import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import {
  FaUserShield,
  FaUserTie,
  FaUser,
  FaLock,
  FaUnlock,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
} from "react-icons/fa";

export default function AdminUsers() {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    if (!auth?.token) {
      toast.error("You must be logged in as an admin");
      return;
    }

    try {
      const res = await axios.get("/api/admin/users", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleBlock = async (id, shouldBlock) => {
    try {
      await axios.patch(
        `/api/admin/users/${id}/block`,
        { block: shouldBlock },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      toast.success(`User ${shouldBlock ? "blocked" : "unblocked"} successfully`);
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  const promoteUser = async (id) => {
    try {
      await axios.patch(
        `/api/admin/users/${id}/promote`,
        {},
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      toast.success("User role updated successfully");
      fetchUsers();
    } catch {
      toast.error("Promote/demote failed");
    }
  };

  const deleteUser = async (id, nameOrEmail) => {
    const confirmed = window.confirm(`Are you sure you want to delete user: ${nameOrEmail}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        🧑‍💼 Admin Panel - Users
      </h1>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No users found.</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-300 dark:border-gray-700">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user._id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-4">{idx + 1}</td>
                  <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                    {user.name || "—"}
                  </td>
                  <td className="p-4 text-blue-600 dark:text-blue-300">
                    {user.email}
                  </td>
                  <td className="p-4 capitalize">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-white"
                          : user.role === "recruiter"
                          ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-white"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-white"
                      }`}
                    >
                      {user.role === "admin" && <FaUserShield />}
                      {user.role === "recruiter" && <FaUserTie />}
                      {user.role === "jobseeker" && <FaUser />}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 dark:text-gray-400">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-4 flex flex-wrap gap-2 items-center">
                    {user.role === "admin" ? (
                      <button
                        onClick={() => promoteUser(user._id)}
                        className="bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700 transition flex items-center gap-1"
                      >
                        <FaArrowDown /> Demote
                      </button>
                    ) : (
                      <button
                        onClick={() => promoteUser(user._id)}
                        className="bg-indigo-600 text-white px-2 py-1 rounded text-xs hover:bg-indigo-700 transition flex items-center gap-1"
                      >
                        <FaArrowUp /> Promote
                      </button>
                    )}
                    <button
                      onClick={() => toggleBlock(user._id, !user.isBlocked)}
                      className={`${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      } text-white px-2 py-1 rounded text-xs transition flex items-center gap-1`}
                    >
                      {user.isBlocked ? (
                        <>
                          <FaUnlock /> Unblock
                        </>
                      ) : (
                        <>
                          <FaLock /> Block
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteUser(user._id, user.email || user.name || "this user")}
                      className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded text-xs transition flex items-center gap-1"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
