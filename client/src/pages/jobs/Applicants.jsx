import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

export default function Applicants() {
  const { jobId } = useParams();
  const { auth, loading } = useAuth();
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");

  const rawRole = auth?.role?.toLowerCase().trim();
  const userRole = rawRole === "employer" ? "recruiter" : rawRole;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`/api/applications/job/${jobId}`);
        setApplicants(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching applicants:", err);
        setError("Could not fetch applicants.");
      }
    };

    if (!loading) {
      fetchApplicants();
    }
  }, [jobId, loading]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/applications/${id}/status`, { status });
      setApplicants((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status } : app))
      );
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      console.error("❌ Status update failed", err);
      toast.error("Status update failed");
    }
  };

  const deleteApplication = async (id) => {
    try {
      await axios.delete(`/api/applications/${id}`);
      setApplicants((prev) => prev.filter((app) => app._id !== id));
      toast.success("Application deleted");
    } catch (err) {
      console.error("❌ Delete failed", err);
      toast.error("Delete failed");
    }
  };

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

  // ✅ Updated to match ApplicantsPage.jsx logic
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-800 dark:text-gray-100">
      <h2 className="text-3xl font-bold mb-6">👥 Applicants for This Job</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : applicants.length === 0 ? (
        <p>No applicants yet.</p>
      ) : (
        <ul className="space-y-4">
          {applicants.map((app) => (
            <li key={app._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow border">
              <p><strong>Applicant:</strong> {app.applicant?.name} ({app.applicant?.email})</p>
              <p><strong>Message:</strong> {app.message || "—"}</p>
              <p><strong>Resume:</strong> {renderResumeLinks(app.resume)}</p>
              <div className="mt-2 flex items-center justify-between flex-wrap gap-2">
                {getStatusBadge(app.status)}
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => updateStatus(app._id, "Selected")} className="bg-green-600 text-white px-3 py-1 rounded">Selected</button>
                  <button onClick={() => updateStatus(app._id, "Rejected")} className="bg-red-600 text-white px-3 py-1 rounded">Rejected</button>
                  <button onClick={() => updateStatus(app._id, "In Process")} className="bg-yellow-500 text-white px-3 py-1 rounded">In Process</button>
                  {["admin", "recruiter"].includes(userRole) && (
                    <button onClick={() => deleteApplication(app._id)} className="bg-gray-700 text-white px-3 py-1 rounded">
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
