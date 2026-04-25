import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ExpertVerificationStatusCard } from "../../components/expert/ExpertVerificationStatusCard";
import { getExpertVerificationStatus } from "../../../api/expert";
import type {
  ExpertVerificationStatusVM,
  ExpertVerificationStatus as ExpertVerificationStatusValue,
} from "../../../types/expert";

const statusValues: ExpertVerificationStatusValue[] = [
  "NOT_APPLIED",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export function ExpertVerificationStatus() {
  const location = useLocation();
  const [verificationRequest, setVerificationRequest] =
    useState<ExpertVerificationStatusVM | null>(null);

  const statusOverride = useMemo(() => {
    const value = new URLSearchParams(location.search).get("status");
    return statusValues.includes(value as ExpertVerificationStatusValue)
      ? (value as ExpertVerificationStatusValue)
      : undefined;
  }, [location.search]);

  useEffect(() => {
    void getExpertVerificationStatus(statusOverride).then(setVerificationRequest);
  }, [statusOverride]);

  if (!verificationRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-sm text-gray-600">인증 상태를 불러오는 중입니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <ExpertVerificationStatusCard verificationRequest={verificationRequest} />
    </div>
  );
}
