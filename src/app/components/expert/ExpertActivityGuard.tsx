import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  buildExpertRedirectPath,
  useMockExpertVerificationStatus,
} from "./expertGuardUtils";

interface ExpertActivityGuardProps {
  children: ReactNode;
}

export function ExpertActivityGuard({ children }: ExpertActivityGuardProps) {
  const { location, status } = useMockExpertVerificationStatus();

  if (!status) {
    return null;
  }

  if (status === "APPROVED") {
    return <>{children}</>;
  }

  if (status === "NOT_APPLIED") {
    return (
      <Navigate
        to={buildExpertRedirectPath("/expert/verification/apply", location.search, status)}
        replace
      />
    );
  }

  return (
    <Navigate
      to={buildExpertRedirectPath("/expert/verification/status", location.search, status)}
      replace
    />
  );
}
