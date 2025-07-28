// === AdminJobs.jsx ===
import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Briefcase } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch jobs:", err.message);
      }
    };

    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/admin/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (err) {
      console.error("❌ Error deleting job:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3 text-pink-600 dark:text-pink-400">
        <Briefcase size={28} /> Manage Jobs
      </h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow hover:shadow-lg transition duration-200"
            >
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">{job.title}</h2>
              <p className="text-gray-800 dark:text-gray-300 font-medium">{job.companyName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">📍 Location: {job.location}</p>
              {job.salary && <p className="text-sm text-gray-600 dark:text-gray-400">💰 Salary: {job.salary}</p>}
              {job.description && <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{job.description}</p>}

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
