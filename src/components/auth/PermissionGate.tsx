import { useContext, type ReactNode } from "react";
import { AuthContext } from "../../context/AuthContext";

interface PermissionGateProps {
  permission: "super-admin-only";
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback = <span className="text-slate-400">Hidden</span>,
}: PermissionGateProps) {
  const auth = useContext(AuthContext);
  const isSuperAdmin =
    auth?.user?.role === "admin" &&
    auth.user.email.toLowerCase() === "admin@edumanage.com";
  if (permission === "super-admin-only" && !isSuperAdmin) return <>{fallback}</>;
  return <>{children}</>;
}
