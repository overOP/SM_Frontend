import { useContext, type ReactNode } from "react";
import { AuthContext } from "../../context/AuthContext";
import type { Role } from "../../types";

interface RoleGuardProps {
  role: Role;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ role, children, fallback = null }: RoleGuardProps) {
  const auth = useContext(AuthContext);
  if (auth?.user?.role !== role) return <>{fallback}</>;
  return <>{children}</>;
}
