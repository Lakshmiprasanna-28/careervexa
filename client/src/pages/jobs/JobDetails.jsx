// ✅ Fully Upgraded client/src/pages/jobs/JobDetails.jsx with Full Dark Mode Support

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import {
  Briefcase,
  MapPin,
  IndianRupee,
  ListChecks,
  ArrowLeft,
} from "lucide-react";

export default function JobDetail() {
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`/api/jobs/${id}`);
        setJob(res.data);
      } catch {
        toast.error("❌ Failed to load job details.");
      }
    };
    fetchJob();
  }, [id]);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
        <p className="text-lg animate-pulse">⏳ Loading job details...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Listings
        </button>

        {/* Job Title */}
        <h1 className="text-3xl font-bold mb-2 text-blue-700 dark:text-blue-400 flex items-center gap-2">
          <Briefcase className="w-6 h-6" />
          {job.title}
        </h1>

        {/* Company + Location */}
        <p className="text-lg mb-4 flex items-center gap-2">
          <span className="font-semibold">{job.company}</span>
          <span className="text-sm text-gray-400 dark:text-gray-500">|</span>
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </p>

        {/* Description */}
        <p className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
          {job.description}
        </p>

        {/* Requirements */}
        {job.requirements?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-lg">
              <ListChecks className="w-5 h-5" />
              Requirements
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300 pl-2">
              {job.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Salary */}
        <div className="mb-6 flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
          <IndianRupee className="w-5 h-5 text-green-600" />
          <span>Salary: ₹{job.salary}</span>
        </div>

        {/* Apply Button or Login Prompt */}
        {auth?.role === "seeker" ? (
          <button
            onClick={() => navigate(`/jobs/apply/${job._id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition duration-200"
          >
            🚀 Apply Now
          </button>
        ) : (
          <p className="mt-6 text-blue-600 dark:text-blue-400 text-sm">
            🔒 Please{" "}
            <Link to="/login" className="underline hover:text-blue-700 dark:hover:text-blue-300">
              login
            </Link>{" "}
            to apply for this job.
          </p>
        )}
      </div>
    </section>
  );
}
