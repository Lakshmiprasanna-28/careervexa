// client/src/pages/PostJob.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  company: yup.string().required("Company is required"),
  location: yup.string().required("Location is required"),
  salary: yup.string().required("Salary is required"),
  description: yup.string().required("Description is required"),
  requirements: yup.string().required("Requirements are required"),
});

export default function PostJob() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/jobs",
        {
          ...data,
          requirements: data.requirements.split(",").map((r) => r.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Job posted successfully!");
      reset();
    } catch {
      toast.error("❌ Failed to post job. Please check server or token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6">
          🚀 Post a New Job
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              {...register("title")}
              placeholder="Job Title"
              className="w-full p-3 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
            />
            <p className="text-red-500 text-sm mt-1">{errors.title?.message}</p>
          </div>

          <div>
            <input
              {...register("company")}
              placeholder="Company Name"
              className="w-full p-3 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
            />
            <p className="text-red-500 text-sm mt-1">{errors.company?.message}</p>
          </div>

          <div>
            <input
              {...register("location")}
              placeholder="Location"
              className="w-full p-3 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
            />
            <p className="text-red-500 text-sm mt-1">{errors.location?.message}</p>
          </div>

          <div>
            <input
              {...register("salary")}
              placeholder="Salary"
              className="w-full p-3 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
            />
            <p className="text-red-500 text-sm mt-1">{errors.salary?.message}</p>
          </div>

          <div>
            <textarea
              {...register("description")}
              placeholder="Job Description"
              className="w-full p-3 border rounded-md h-32 bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
            />
            <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>
          </div>

          <div>
            <input
              {...register("requirements")}
              placeholder="Requirements (comma-separated)"
              className="w-full p-3 border rounded-md bg-white dark:bg-gray-900 text-black dark:text-white border-gray-300 dark:border-gray-700"
            />
            <p className="text-red-500 text-sm mt-1">{errors.requirements?.message}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-md w-full transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "✅ Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
