// client/src/pages/AdminDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Shield,
  BarChart,
  FileText,
  Activity,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function AdminDashboard() {
  const { auth } = useAuth();

  const card =
    "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow hover:shadow-lg transition cursor-pointer";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-400">
          Welcome, {auth?.name} 🛡️
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Manage users, monitor activity, and oversee platform operations.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/applicants" className={card}>
            <Users className="text-green-600 mb-2" />
            <h3 className="font-semibold">Applicants</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View, edit, delete applications
            </p>
          </Link>

          <Link to="/admin/users" className={card}>
            <Shield className="text-red-600 mb-2" />
            <h3 className="font-semibold">Manage Users</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              View, block, or promote accounts
            </p>
          </Link>

          <Link to="/admin/jobs" className={card}>
            <Briefcase className="text-blue-600 mb-2" />
            <h3 className="font-semibold">Jobs Overview</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review, edit or remove listings
            </p>
          </Link>

          <Link to="/admin/analytics" className={card}>
            <BarChart className="text-purple-600 mb-2" />
            <h3 className="font-semibold">Analytics</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track user and job metrics
            </p>
          </Link>

          <Link to="/admin/moderation" className={card}>
            <FileText className="text-yellow-600 mb-2" />
            <h3 className="font-semibold">Moderation</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Handle flags and reports
            </p>
          </Link>

          <Link to="/admin/activity" className={card}>
            <Activity className="text-orange-600 mb-2" />
            <h3 className="font-semibold">Recent Activity</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monitor admin logs and actions
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
