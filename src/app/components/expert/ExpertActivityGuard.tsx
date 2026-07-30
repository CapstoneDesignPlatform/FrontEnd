import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import {
  buildExpertRedirectPath,
  useMockExpertVerificationStatus,
} from "./expertGuardUtils";
import { AsyncStateCard } from "../common/AsyncStateCard";

interface ExpertActivityGuardProps {
  children: ReactNode;
}

export function ExpertActivityGuard({ children }: ExpertActivityGuardProps) {
  const { error, isLoading, location, status } = useMockExpertVerificationStatus();

  if (error) {
    return (
      <AsyncStateCard
        message="전문가 인증 상태를 불러오지 못했습니다. 백엔드 연결 또는 API 모드를 확인해주세요."
        tone="danger"
      />
    );
  }

  if (!status) {
    return isLoading ? (
      <AsyncStateCard message="전문가 인증 상태를 확인하는 중입니다." />
    ) : null;
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
