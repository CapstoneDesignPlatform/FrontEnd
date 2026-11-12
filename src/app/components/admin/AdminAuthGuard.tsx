import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { hasAdminSession } from "../../../api/authTokens";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!hasAdminSession()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
