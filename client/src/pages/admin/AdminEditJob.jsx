// ✅ AdminEditJob.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminEditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    salary: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/admin/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const job = res.data;
        setFormData({
          title: job.title || "",
          companyName: job.companyName || "",
          location: job.location || "",
          salary: job.salary || "",
          description: job.description || "",
        });
      } catch (err) {
        console.error("❌ Failed to fetch job:", err.message);
        toast.error("Job not found or unauthorized");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/admin/jobs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("✅ Job updated successfully!");
      navigate("/admin/jobs");
    } catch (err) {
      console.error("❌ Failed to update job:", err.message);
      toast.error("Failed to update job.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <p>Loading job data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-pink-600 dark:text-pink-400">
        📝 Edit Job
      </h1>

      <form
        onSubmit={handleUpdate}
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto space-y-5"
      >
        <div>
          <label className="block mb-1 font-medium">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Salary</label>
          <input
            type="text"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded"
        >
          Update Job
        </button>
      </form>
    </div>
  );
}
