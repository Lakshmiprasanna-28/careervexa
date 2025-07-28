import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { title, company, location, salary, description, requirements } = res.data;
        setJob(res.data);
        setValue("title", title);
        setValue("company", company);
        setValue("location", location);
        setValue("salary", salary);
        setValue("description", description);
        setValue("requirements", requirements?.join(", "));
      } catch (err) {
        console.error("Failed to fetch job:", err);
        toast.error("❌ Failed to load job details");
      }
    };

    fetchJob();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/jobs/${id}`,
        {
          ...data,
          requirements: data.requirements
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Job updated successfully!");
      navigate("/jobs/my-posts");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("❌ Failed to update job");
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300">
        Loading job details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10 text-gray-800 dark:text-gray-200">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 dark:text-blue-400">
          ✏️ Edit Job Posting
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            {...register("title")}
            placeholder="Job Title"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white"
          />
          <input
            {...register("company")}
            placeholder="Company Name"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white"
          />
          <input
            {...register("location")}
            placeholder="Location"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white"
          />
          <input
            {...register("salary")}
            placeholder="Salary"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white"
          />
          <textarea
            {...register("description")}
            placeholder="Job Description"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md h-32 bg-white dark:bg-gray-900 text-black dark:text-white"
          />
          <input
            {...register("requirements")}
            placeholder="Requirements (comma-separated)"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white"
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            ✅ Update Job
          </button>
        </form>
      </div>
    </div>
  );
}
