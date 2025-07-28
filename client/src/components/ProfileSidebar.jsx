import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  BriefcaseIcon, UserIcon, SettingsIcon,
  BarChartIcon, Users2Icon, FileTextIcon,
  ShieldIcon, ActivityIcon
} from "lucide-react";

const navItems = {
  seeker: [
    { label: "Dashboard", icon: <BarChartIcon size={18} />, path: "/jobseeker-dashboard" },
    { label: "My Profile", icon: <UserIcon size={18} />, path: "/jobseeker-profile" },
    { label: "My Applications", icon: <FileTextIcon size={18} />, path: "/applications" },
    { label: "Settings", icon: <SettingsIcon size={18} />, path: "/settings" },
  ],
  employer: [
    { label: "Dashboard", icon: <BarChartIcon size={18} />, path: "/recruiter-dashboard" },
    { label: "Post Job", icon: <BriefcaseIcon size={18} />, path: "/jobs/post" },
    { label: "Manage Jobs", icon: <FileTextIcon size={18} />, path: "/jobs/my-posts" },
    { label: "Applicants", icon: <Users2Icon size={18} />, path: "/applicants" },
  ],
  admin: [
    { label: "Dashboard", icon: <BarChartIcon size={18} />, path: "/admin-dashboard" },
    { label: "Users", icon: <Users2Icon size={18} />, path: "/admin/users" },
    { label: "Jobs", icon: <FileTextIcon size={18} />, path: "/admin/jobs" },
    { label: "Moderation", icon: <ShieldIcon size={18} />, path: "/admin/moderation" },
    { label: "Activity Logs", icon: <ActivityIcon size={18} />, path: "/admin/activity" },
  ],
};

const ProfileSidebar = () => {
  const { user } = useAuth();
  const { pathname } = useLocation();

  if (!user) return null;

  const role = user.role || "seeker";
  const items = navItems[role] || [];

  return (
    <nav className="p-4 space-y-2 w-full">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 ${
            pathname === item.path
              ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-white font-semibold"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default ProfileSidebar;
