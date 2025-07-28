// ✅ Fully Upgraded client/src/pages/Jobs.jsx with complete dark mode and enhanced UI

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Briefcase } from "lucide-react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("❌ Failed to load jobs. Please try again later.");
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-700 dark:text-blue-400">
          💼 Explore Job Opportunities
        </h1>

        {error ? (
          <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-gray-600 dark:text-gray-400 text-center text-lg">
            🚫 No job postings available right now.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition-all p-5"
              >
                <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                  <Briefcase className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  {job.company} — {job.location}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  💰 ₹{job.salary}
                </p>
                <Link
                  to={`/jobs/${job._id}`}
                  className="inline-block text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Details & Apply →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
