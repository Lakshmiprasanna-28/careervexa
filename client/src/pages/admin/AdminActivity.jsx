import React, { useEffect, useState } from "react";
import axios from "axios";
import { Activity, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/admin/activity", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch activity logs:", err.message);
      toast.error("Failed to fetch logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to delete all activity logs?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/admin/activity", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLogs([]);
      toast.success("Activity logs cleared successfully!");
    } catch (err) {
      console.error("Error clearing logs:", err.message);
      toast.error("Failed to clear logs.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-purple-700 dark:text-white">
          📊 Platform Activity Logs
        </h1>
        <button
          onClick={handleClearLogs}
          disabled={deleting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow disabled:opacity-50"
        >
          <Trash2 size={18} />
          {deleting ? "Deleting..." : "Delete History"}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-sm">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-lg font-medium text-center text-gray-500 dark:text-gray-400">
            🚫 No activity recorded yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {logs.map((log, idx) => (
              <li
                key={idx}
                className="py-3 flex items-start space-x-3 text-gray-700 dark:text-gray-200"
              >
                <Activity className="text-purple-500 mt-1" size={20} />
                <div>
                  <p className="font-medium">{log.message}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
