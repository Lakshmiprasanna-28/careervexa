// ✅ client/src/pages/jobs/JobList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const getJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/jobs/my-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      toast.error("❌ Failed to fetch jobs");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("✅ Job deleted");
      getJobs(); // Refresh after delete
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("❌ Failed to delete job");
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  if (jobs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        📝 You haven’t posted any jobs yet.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-700 dark:text-blue-400">
          📋 Your Job Listings
        </h2>
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {job.company} • {job.location}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    💰 ₹{job.salary}
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
                    {job.description.slice(0, 120)}...
                  </p>

                  <button
                    onClick={() => navigate(`/jobs/${job._id}/applicants`)}
                    className="mt-4 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    👀 View Applicants
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/jobs/edit/${job._id}`)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
