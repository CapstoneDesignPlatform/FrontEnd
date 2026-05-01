import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import { getExpertVerificationStatus } from "../../../api/expertVerification";
import { useAsyncData } from "../../hooks/useAsyncData";
import { getDemoExpertVerificationStatus } from "../../demoAccess";
import type { ExpertVerificationStatus } from "../../../types/expertVerification";

const expertVerificationStatuses: ExpertVerificationStatus[] = [
  "NOT_APPLIED",
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export function getStatusFromSearch(search: string): ExpertVerificationStatus | undefined {
  const value = new URLSearchParams(search).get("status");

  return expertVerificationStatuses.includes(value as ExpertVerificationStatus)
    ? (value as ExpertVerificationStatus)
    : undefined;
}

export function buildExpertRedirectPath(
  pathname: string,
  search: string,
  status: ExpertVerificationStatus,
) {
  const params = new URLSearchParams(search);
  params.set("status", status);

  return `${pathname}?${params.toString()}`;
}

export function useMockExpertVerificationStatus() {
  const location = useLocation();
  const statusOverride =
    getStatusFromSearch(location.search) ?? getDemoExpertVerificationStatus();
  const loadVerificationStatus = useCallback(
    () => getExpertVerificationStatus(statusOverride),
    [statusOverride],
  );
  const { data } = useAsyncData(loadVerificationStatus);

  return { location, status: data?.status ?? null };
}
