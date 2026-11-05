import type { ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  buildExpertRedirectPath,
  useMockExpertVerificationStatus,
} from "./expertGuardUtils";
import { ApiError } from "../../../api/apiClient";
import { Button } from "../ui/button";
import { AsyncStateCard } from "../common/AsyncStateCard";

interface ExpertActivityGuardProps {
  children: ReactNode;
}

export function ExpertActivityGuard({ children }: ExpertActivityGuardProps) {
  const { error, isLoading, reload, location, status } = useMockExpertVerificationStatus();

  if (error) {
    const httpStatus = error instanceof ApiError ? error.status : null;
    const message = httpStatus === 401
      ? "로그인이 만료되었거나 인증되지 않았습니다. 다시 로그인해 주세요."
      : httpStatus === 403
        ? "전문가 인증 상태를 조회할 권한이 없습니다. 전문가 계정으로 로그인했는지 확인해 주세요."
        : httpStatus !== null
          ? `전문가 인증 상태 조회에 실패했습니다. (HTTP ${httpStatus}) ${error.message}`
          : "전문가 인증 상태를 확인하지 못했습니다. 연결 상태를 확인하고 다시 조회해 주세요.";
    return (
      <AsyncStateCard
        message={message}
        action={<div className="flex justify-center gap-2"><Button variant="outline" onClick={reload}>다시 조회</Button>{(httpStatus === 401 || httpStatus === 403) && <Button asChild><Link to="/login?next=/expert/dashboard">로그인</Link></Button>}</div>}
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
