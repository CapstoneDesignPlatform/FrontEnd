import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  buildExpertRedirectPath,
  useMockExpertVerificationStatus,
} from "./expertGuardUtils";

interface ExpertVerificationStatusGuardProps {
  children: ReactNode;
}

export function ExpertVerificationStatusGuard({
  children,
}: ExpertVerificationStatusGuardProps) {
  const { location, status } = useMockExpertVerificationStatus();

  if (!status) {
    return null;
  }

  if (status === "NOT_APPLIED") {
    return (
      <Navigate
        to={buildExpertRedirectPath("/expert/verification/apply", location.search, status)}
        replace
      />
    );
  }

  return <>{children}</>;
}
