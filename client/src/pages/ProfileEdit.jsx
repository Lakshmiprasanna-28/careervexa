// === profileEdit.jsx ===
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

import JobSeekerProfileEdit from "./JobSeekerProfileEdit";
import RecruiterProfileEdit from "./RecruiterProfileEdit";
import AdminProfileEdit from "./AdminProfileEdit";

export default function ProfileEdit() {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/login" />;

  if (auth.role === "seeker") return <JobSeekerProfileEdit />;
  if (auth.role === "employer") return <RecruiterProfileEdit />;
  if (auth.role === "admin") return <AdminProfileEdit />;

  return <div className="text-center p-10">Unknown role</div>;
}