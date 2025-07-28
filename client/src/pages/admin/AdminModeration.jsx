import React from "react";
import { Ban, AlertTriangle, ShieldCheck, Trash2 } from "lucide-react";

export default function AdminModeration() {
  return (
    <div className="min-h-screen px-6 py-10 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-yellow-600 dark:text-white">
          🛡️ Content Moderation Tools
        </h1>

        <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
          Admins can take actions against reported or suspicious content here. Features like <strong>warning</strong>, <strong>banning</strong>, and <strong>deleting content</strong> are being built.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Warn User */}
          <div className="p-5 bg-white dark:bg-gray-800 border border-yellow-400 dark:border-yellow-500 rounded-xl shadow hover:shadow-lg transition-all">
            <AlertTriangle className="text-yellow-500 w-6 h-6 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              Warn User
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Send a caution to users involved in inappropriate or suspicious activity.
            </p>
          </div>

          {/* Ban User */}
          <div className="p-5 bg-white dark:bg-gray-800 border border-red-400 dark:border-red-500 rounded-xl shadow hover:shadow-lg transition-all">
            <Ban className="text-red-500 w-6 h-6 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              Ban User
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Permanently block users who violate policies or abuse the system.
            </p>
          </div>

          {/* Delete Content */}
          <div className="p-5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow hover:shadow-lg transition-all">
            <Trash2 className="text-gray-600 dark:text-gray-300 w-6 h-6 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
              Delete Content
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Remove flagged job posts, comments, or other inappropriate content.
            </p>
          </div>
        </div>

        {/* Development Notice */}
        <div className="mt-10 p-5 bg-yellow-50 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 rounded-lg flex items-start gap-3">
          <ShieldCheck className="text-yellow-500 w-6 h-6 mt-1" />
          <p className="text-gray-700 dark:text-yellow-100 text-base">
            Moderation features are currently under development. Soon, admins will be able to take real action on reported items with proper audit trails.
          </p>
        </div>
      </div>
    </div>
  );
}
