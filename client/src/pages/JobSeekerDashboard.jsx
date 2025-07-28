import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FileText, Briefcase, UploadCloud, Brain } from "lucide-react";

export default function JobSeekerDashboard() {
  const { auth } = useAuth();

  const card =
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-400">
          Welcome, {auth?.name} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Explore tools, opportunities, and resources built for job seekers like you.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/jobs" className={card}>
            <Briefcase className="text-blue-600 dark:text-blue-400 mb-2" />
            <h3 className="font-semibold">Recommended Jobs</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Browse jobs curated for you</p>
          </Link>

          <Link to="/applications" className={card}>
            <FileText className="text-green-600 dark:text-green-400 mb-2" />
            <h3 className="font-semibold">Track Applications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">See status of your applications</p>
          </Link>

          <Link to="/resume" className={card}>
            <UploadCloud className="text-purple-600 dark:text-purple-400 mb-2" />
            <h3 className="font-semibold">Resume Manager</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Upload or update your resume</p>
          </Link>

          <Link to="/resources/interview" className={card}>
            <Brain className="text-yellow-600 dark:text-yellow-400 mb-2" />
            <h3 className="font-semibold">Mock Interviews</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Practice and prepare</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
