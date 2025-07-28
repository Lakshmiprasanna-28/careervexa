import React from "react";
import { TrendingUp, Briefcase, Users, CheckCircle, XCircle } from "lucide-react";

export default function HiringTracker() {
  const stats = [
    { label: "Total Jobs Posted", value: 12, icon: <Briefcase className="text-blue-600" /> },
    { label: "Total Applicants", value: 68, icon: <Users className="text-green-600" /> },
    { label: "Selected Candidates", value: 8, icon: <CheckCircle className="text-purple-600" /> },
    { label: "Rejected Candidates", value: 14, icon: <XCircle className="text-red-600" /> },
  ];

  return (
    <div className="min-h-screen px-6 py-10 bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
            <TrendingUp size={28} /> Hiring Tracker
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor your entire recruitment funnel — track job listings, applications, interview
            outcomes, and final selections. Stay informed and make data-driven hiring decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border dark:border-gray-700 p-5 rounded-xl shadow flex flex-col items-start"
            >
              <div className="mb-2">{stat.icon}</div>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow border dark:border-gray-700 mt-6">
          <h2 className="text-xl font-semibold mb-3">📈 Insights (Coming Soon)</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            You'll be able to visualize funnel conversion rates, average time-to-hire, stage drop-offs,
            and key recruitment KPIs. Consider integrating with analytics tools like Chart.js or Recharts.
          </p>
        </div>
      </div>
    </div>
  );
}
