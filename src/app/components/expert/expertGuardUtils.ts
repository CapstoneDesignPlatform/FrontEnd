import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getExpertVerificationStatus } from "../../../api/expert";
import type { ExpertVerificationStatus } from "../../../types/expert";

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
  const statusOverride = useMemo(
    () => getStatusFromSearch(location.search),
    [location.search],
  );
  const [status, setStatus] = useState<ExpertVerificationStatus | null>(null);

  useEffect(() => {
    let isMounted = true;

    void getExpertVerificationStatus(statusOverride).then((request) => {
      if (isMounted) {
        setStatus(request.status);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [statusOverride]);

  return { location, status };
}
