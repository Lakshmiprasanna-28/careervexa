// === client/src/pages/LoggedInHome.jsx ===
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  Briefcase,
  MessageSquare,
  Bell,
  GaugeCircle,
} from "lucide-react";

export default function LoggedInHome() {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("seeker");

  useEffect(() => {
    if (!auth) return;

    const formatName = (name) =>
      name
        .split(" ")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");

    const fullName = auth.name
      ? formatName(auth.name)
      : formatName(auth.email?.split("@")[0] || "User");

    setUserName(fullName);
    setUserRole(auth.role || "seeker");
  }, [auth]);

  const prettyRole =
    userRole === "admin"
      ? "Admin"
      : userRole === "employer"
      ? "Recruiter"
      : "Job Seeker";

  const cardStyle =
    "flex items-center gap-4 p-4 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700";

  const handleDashboardNavigation = () => {
    switch (userRole) {
      case "admin":
        navigate("/admin-dashboard");
        break;
      case "employer":
        navigate("/recruiter-dashboard");
        break;
      default:
        navigate("/jobseeker-dashboard");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2">
            👋 Welcome back, <span className="text-blue-600">{userName}</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            You are logged in as <strong>{prettyRole}</strong>. Let’s make your next move count!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={cardStyle} onClick={handleDashboardNavigation}>
            <GaugeCircle className="text-blue-600" size={28} />
            <div>
              <h3 className="font-semibold">Dashboard</h3>
              <p className="text-sm text-gray-500">Manage your activity</p>
            </div>
          </div>

          <div className={cardStyle} onClick={() => navigate("/messages")}>
            <MessageSquare className="text-green-600" size={28} />
            <div>
              <h3 className="font-semibold">Messages</h3>
              <p className="text-sm text-gray-500">Talk to candidates or recruiters</p>
            </div>
          </div>

          <div className={cardStyle} onClick={() => navigate("/notifications")}>
            <Bell className="text-yellow-600" size={28} />
            <div>
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-sm text-gray-500">View all your alerts & updates</p>
            </div>
          </div>

          <div className={cardStyle} onClick={() => navigate("/jobs")}>
            <Briefcase className="text-purple-600" size={28} />
            <div>
              <h3 className="font-semibold">Browse Jobs</h3>
              <p className="text-sm text-gray-500">Find the perfect fit</p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-gray-400 dark:text-gray-500">
          🚀 Let’s build your future — one opportunity at a time.
        </div>
      </div>
    </Layout>
  );
}
