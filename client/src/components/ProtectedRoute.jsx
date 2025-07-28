import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div className="p-10 text-center text-gray-500">Loading profile...</div>;
  if (!auth) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(auth.role)) return <Navigate to="/home" replace />;

  return element;
};

export default ProtectedRoute;
