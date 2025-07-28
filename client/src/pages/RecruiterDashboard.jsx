// client/src/pages/RecruiterDashboard.jsx
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Users,
  CalendarClock,
  TrendingUp,
} from "lucide-react";
import JobList from "./jobs/JobList";

export default function RecruiterDashboard() {
  const { auth } = useAuth();

  const card =
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-400">
          Hello, {auth?.name} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Manage your hiring pipeline, track listings, and discover top talent.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/jobs/post" className={card}>
            <Briefcase className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Post Jobs</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create new job listings
            </p>
          </Link>

          <Link to="/applicants" className={card}>
            <Users className="text-green-600 mb-2" />
            <h3 className="font-semibold">View Applicants</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              See who’s applied
            </p>
          </Link>

          <Link to="/schedule-interviews" className={card}>
            <CalendarClock className="text-purple-600 mb-2" />
            <h3 className="font-semibold">Schedule Interviews</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage interviews
            </p>
          </Link>

          <Link to="/track-hiring" className={card}>
            <TrendingUp className="text-yellow-600 mb-2" />
            <h3 className="font-semibold">Hiring Tracker</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track progress & outcomes
            </p>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">📝 Your Posted Jobs</h2>
          <JobList />
        </div>
      </div>
    </div>
  );
}
