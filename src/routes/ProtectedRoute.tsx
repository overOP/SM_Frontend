import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import type { Role } from "../types";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const location = useLocation();

  // 1. If user is not logged in at all, send to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If the user's role is NOT authorized for this specific route
  // Example: Admin (role: 'admin') tries to access /teacher (allowed: ['teacher'])
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Send them back to their own dashboard
    return <Navigate to={`/${user.role}`} replace />;
  }

  // 3. If everything is fine, render the child route (the Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;
