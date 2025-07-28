import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const baseUrl = "http://localhost:5000";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/applications/mine`, {
          withCredentials: true,
        });
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;

    try {
      await axios.delete(`${baseUrl}/api/applications/${id}`, {
        withCredentials: true,
      });
      toast.success("Application deleted");
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      toast.error("Failed to delete application");
      console.error(err);
    }
  };

  const renderResumeLinks = (resumePath) => {
    if (!resumePath || resumePath === "undefined" || typeof resumePath !== "string") {
      return "Not uploaded";
    }

    const isFullUrl = resumePath.startsWith("http");
    const fileName = resumePath.split("/").pop();
    const resumeUrl = isFullUrl ? resumePath : `${baseUrl}${resumePath}`;
    const downloadUrl = `${baseUrl}/api/applications/download/${encodeURIComponent(fileName)}`;

    return (
      <div className="flex items-center justify-center gap-2">
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 underline"
        >
          View
        </a>
        <span className="text-gray-400">|</span>
        <a
          href={downloadUrl}
          className="text-green-600 dark:text-green-400 underline"
          rel="noopener noreferrer"
        >
          Download
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all">
      <h1 className="text-3xl font-bold mb-6 text-center">My Applications</h1>
      {applications.length === 0 ? (
        <p className="text-center text-lg">No applications found.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="w-full table-auto">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-4 text-left font-semibold">Job Title</th>
                <th className="p-4 text-left font-semibold">Company</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Resume</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <td className="p-4">{app.job?.title || "N/A"}</td>
                  <td className="p-4">{app.job?.company || "N/A"}</td>
                  <td className="p-4">{app.status}</td>
                  <td className="p-4">{renderResumeLinks(app.resume)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(app._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-all"
                      title="Delete Application"
                    >
                      <Trash2 className="w-5 h-5" />
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
