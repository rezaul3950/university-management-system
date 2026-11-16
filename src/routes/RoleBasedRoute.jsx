import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_HOME } from "@/utils/constants";

export default function RoleBasedRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user?.role] || "/login"} replace />;
  }
  return <Outlet />;
}