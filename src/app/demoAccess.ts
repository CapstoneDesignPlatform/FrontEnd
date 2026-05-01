import type { ExpertVerificationStatus } from "../types/expertVerification";

const DEMO_EXPERT_VERIFICATION_STATUS_KEY =
  "serviceplatform.demoExpertVerificationStatus";

function getSessionStorage() {
  return typeof window === "undefined" ? null : window.sessionStorage;
}

export function grantDemoExpertApproval() {
  getSessionStorage()?.setItem(
    DEMO_EXPERT_VERIFICATION_STATUS_KEY,
    "APPROVED",
  );
}

export function clearDemoExpertApproval() {
  getSessionStorage()?.removeItem(DEMO_EXPERT_VERIFICATION_STATUS_KEY);
}

export function getDemoExpertVerificationStatus(): ExpertVerificationStatus | undefined {
  const status = getSessionStorage()?.getItem(DEMO_EXPERT_VERIFICATION_STATUS_KEY);

  return status === "APPROVED" ? status : undefined;
}
