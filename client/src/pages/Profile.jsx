// === profile.jsx ===
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

export default function Profile() {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/login" />;

  if (auth.role === "seeker") return <Navigate to="/jobseeker-profile" />;
  if (auth.role === "employer") return <Navigate to="/recruiter-profile" />;
  if (auth.role === "admin") return <Navigate to="/admin-profile" />;

  return <div className="text-center p-10">Unknown role</div>;
}
