import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

export default function ApplicantsPage() {
  const { auth, loading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const rawRole = auth?.role?.toLowerCase().trim();
  const userRole = rawRole === "employer" ? "recruiter" : rawRole;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("/api/applications", {
          withCredentials: true,
        });
        setApplications(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching applications:", err);
        setError("Failed to load applications.");
      }
    };

    if (!loading) {
      fetchApplications();
    }
  }, [loading]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/applications/${id}/status`,
        { status },
        { withCredentials: true }
      );
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      console.error("❌ Status update failed", err);
      toast.error("Failed to update status");
    }
  };

  const deleteApplication = async (id) => {
    try {
      await axios.delete(`/api/applications/${id}`, {
        withCredentials: true,
      });
      toast.success("Application deleted");
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete application", err);
      toast.error("Delete failed");
    }
  };

  const filteredApps = applications.filter(
    (app) =>
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const base = "inline-block px-3 py-1 text-sm rounded-full font-medium shadow";
    switch (status?.toLowerCase()) {
      case "selected":
        return <span className={`${base} bg-green-100 text-green-800`}>✅ Selected</span>;
      case "rejected":
        return <span className={`${base} bg-red-100 text-red-800`}>❌ Rejected</span>;
      default:
        return <span className={`${base} bg-yellow-100 text-yellow-800`}>⏳ In Process</span>;
    }
  };

  const renderResumeLinks = (resume) => {
    if (!resume || resume === "undefined") return "Not uploaded";

    const isFullUrl = resume.startsWith("http");
    const fileName = resume.split("/").pop();
    const resumeUrl = isFullUrl ? resume : `${baseUrl}${resume}`;
    const downloadUrl = `${baseUrl}/download/${fileName}`;

    return (
      <>
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline mr-2"
        >
          View
        </a>
        |
        <a
          href={downloadUrl}
          className="ml-2 text-green-600 underline"
          rel="noopener noreferrer"
        >
          Download
        </a>
      </>
    );
  };

  if (loading) return <p className="p-4">Loading user info...</p>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-6">📋 Applications You Can View</h2>

      <input
        type="text"
        placeholder="🔍 Search by job title or company"
        className="w-full mb-6 p-2 border rounded bg-gray-50 dark:bg-gray-800 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredApps.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredApps.map((app) => (
            <li
              key={app._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow border"
            >
              <p>
                <strong>Applicant:</strong> {app.applicant?.name} ({app.applicant?.email})
              </p>
              <p>
                <strong>Job:</strong> {app.job?.title} @ {app.job?.company}
              </p>
              <p>
                <strong>Message:</strong> {app.message || "—"}
              </p>
              <p>
                <strong>Resume:</strong> {renderResumeLinks(app.resume)}
              </p>
              <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                {getStatusBadge(app.status)}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => updateStatus(app._id, "Selected")}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Selected
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "Rejected")}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Rejected
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "In Process")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    In Process
                  </button>
                  {["admin", "recruiter"].includes(userRole) && (
                    <button
                      onClick={() => deleteApplication(app._id)}
                      className="bg-gray-700 text-white px-3 py-1 rounded"
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
