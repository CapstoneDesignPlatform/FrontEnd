import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { ExpertVerificationStatusCard } from "../../components/expert/ExpertVerificationStatusCard";
import { getExpertVerificationStatus } from "../../../api/expertVerification";
import type {
  ExpertVerificationStatus as ExpertVerificationStatusValue,
} from "../../../types/expertVerification";
import { useAsyncData } from "../../hooks/useAsyncData";

const statusValues: ExpertVerificationStatusValue[] = [
  "NOT_APPLIED",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export function ExpertVerificationStatus() {
  const location = useLocation();

  const statusOverride = useMemo(() => {
    const value = new URLSearchParams(location.search).get("status");
    return statusValues.includes(value as ExpertVerificationStatusValue)
      ? (value as ExpertVerificationStatusValue)
      : undefined;
  }, [location.search]);

  const loadVerificationStatus = useCallback(
    () => getExpertVerificationStatus(statusOverride),
    [statusOverride],
  );
  const {
    data: verificationRequest,
    error,
  } = useAsyncData(loadVerificationStatus);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <AsyncStateCard
          className="w-full max-w-md"
          message="인증 상태를 불러오지 못했습니다."
          tone="danger"
        />
      </div>
    );
  }

  if (!verificationRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <AsyncStateCard
          className="w-full max-w-md"
          message="인증 상태를 불러오는 중입니다."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <ExpertVerificationStatusCard verificationRequest={verificationRequest} />
    </div>
  );
}
