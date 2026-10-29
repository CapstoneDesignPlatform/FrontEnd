import type { AdminExpertDetail, AdminExpertCertificate, AdminExpertBusinessInfo } from "./expertApi";

export interface AdminReview {
  detail: AdminExpertDetail;
  certificates: AdminExpertCertificate[];
  business: AdminExpertBusinessInfo;
}
interface ReviewSources {
  getExpertDetail(id: number): Promise<unknown>;
  getExpertCertificates(id: number): Promise<unknown>;
  getExpertBusinessInfo(id: number): Promise<unknown>;
}
const record = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const positiveId = (v: unknown) => typeof v === "number" && Number.isSafeInteger(v) && v > 0;
export function parseReviewUserId(value: string | undefined): number | null {
  if (!value || !/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return positiveId(id) ? id : null;
}
function dataOf(response: unknown): unknown {
  if (!record(response) || response.success !== true || !("data" in response)) throw new Error("심사 조회 실패");
  return response.data;
}
export async function loadAdminReview(userId: number, sources: ReviewSources): Promise<AdminReview> {
  if (!positiveId(userId)) throw new Error("잘못된 사용자 ID");
  const responses = await Promise.all([sources.getExpertDetail(userId), sources.getExpertCertificates(userId), sources.getExpertBusinessInfo(userId)]);
  const [detail, certificates, business] = responses.map(dataOf);
  if (!record(detail) || detail.userId !== userId || !positiveId(detail.expertProfileId) || typeof detail.email !== "string" || !detail.email.trim() || !["NOT_SUBMITTED", "PENDING", "APPROVED", "REJECTED"].includes(String(detail.verificationStatus))) throw new Error("신청자 정보 불일치");
  if (!Array.isArray(certificates) || certificates.some(c => !record(c) || !positiveId(c.certificateId) || !positiveId(c.fileId)) || new Set(certificates.map(c => c.certificateId)).size !== certificates.length) throw new Error("자격증 정보 오류");
  if (!record(business) || !positiveId(business.businessRegistrationInfoId) || !positiveId(business.fileId)) throw new Error("사업자등록 정보 오류");
  return { detail, certificates, business } as unknown as AdminReview;
}
