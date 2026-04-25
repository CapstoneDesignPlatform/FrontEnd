import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  buildExpertRedirectPath,
  useMockExpertVerificationStatus,
} from "./expertGuardUtils";

interface ExpertVerificationApplyGuardProps {
  children: ReactNode;
}

export function ExpertVerificationApplyGuard({
  children,
}: ExpertVerificationApplyGuardProps) {
  const { location, status } = useMockExpertVerificationStatus();

  if (!status) {
    return null;
  }

  if (status === "NOT_APPLIED" || status === "REJECTED") {
    return <>{children}</>;
  }

  if (status === "PENDING") {
    return (
      <Navigate
        to={buildExpertRedirectPath("/expert/verification/status", location.search, status)}
        replace
      />
    );
  }

  return (
    <Navigate
      to={buildExpertRedirectPath("/expert/jobs", location.search, status)}
      replace
    />
  );
}
