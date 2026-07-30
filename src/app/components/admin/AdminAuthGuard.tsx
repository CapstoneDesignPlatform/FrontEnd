import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isAuth = sessionStorage.getItem("admin-auth") === "true";

  if (!isAuth) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
