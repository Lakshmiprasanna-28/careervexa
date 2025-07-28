import React from "react";
import { CalendarClock, User, Mail } from "lucide-react";

export default function ScheduleInterviews() {
  return (
    <div className="min-h-screen px-6 py-10 bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <CalendarClock size={28} /> Schedule Interviews
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and organize candidate interviews with efficiency and clarity. Use this page to
            plan, schedule, and communicate interview logistics.
          </p>
        </div>

        {/* Placeholder Table/List */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 border dark:border-gray-700 space-y-4">
          <h2 className="text-xl font-semibold">📅 Upcoming Interviews</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            (This is a placeholder – integrate calendar, scheduling APIs, and meeting links here.)
          </p>

          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 text-sm">
            <p className="mb-2"><User className="inline mr-1 text-blue-500" /> <strong>Candidate:</strong> Jane Doe</p>
            <p className="mb-2"><Mail className="inline mr-1 text-green-500" /> <strong>Email:</strong> jane.doe@example.com</p>
            <p><strong>Scheduled On:</strong> Monday, July 22nd at 3:00 PM IST</p>
            <p><strong>Role:</strong> Frontend Developer</p>
            <p><strong>Mode:</strong> Google Meet (🔗 Coming Soon)</p>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 text-center pt-6 border-t border-gray-300 dark:border-gray-700">
          Future features: calendar integrations (Google, Outlook), real-time rescheduling, interview notes, reminders, and more.
        </div>
      </div>
    </div>
  );
}
