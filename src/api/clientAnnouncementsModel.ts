export interface AnnouncementBid {
  bid_id?: number;
  expert_name: string | null;
  business_name: string | null;
  bid_amount: number | null;
  final_amount: number | null;
  status?: string;
  result?: string;
  phone?: string | null;
  email?: string | null;
}

export interface AnnouncementSummary {
  id: number;
  announcement_code?: string;
  registered_at: string;
  industry: string;
  purpose: string;
  business_owner_type: string;
  required_license: string | null;
  capital_scale: number | null;
  status: string;
  progress_step?: number;
  progress_step_label?: string;
  bids?: AnnouncementBid[];
  selected_bid?: AnnouncementBid | null;
}

export interface MyAnnouncements {
  current_announcement: AnnouncementSummary | null;
  past_announcements: AnnouncementSummary[];
}

export interface AnnouncementDetail extends Omit<AnnouncementSummary, 'id'> {
  announcement_code: string;
  current_industry: string | null;
  bids: AnnouncementBid[];
  client_info: {
    company_name: string | null;
    business_number: string | null;
    representative_name: string | null;
    address: string | null;
    email: string | null;
    contact: string | null;
    founded_date: string | null;
    capital: number | null;
  };
}

const steps = ['필요 정보 등록', '입찰 검토', '전문가 선택', '진단시작', '협회 경유', '작성 완료 및 발송', '수령'];
export const progressSteps = steps;

export function announcementStatus(project: Pick<AnnouncementSummary, 'status' | 'progress_step'>) {
  if (project.status === 'CANCELLED') return '취소';
  if (!['ACTIVE', 'CLOSED'].includes(project.status)) return '상태 확인 필요';
  if (project.progress_step === 7) return '완료';
  if (project.progress_step !== undefined && project.progress_step >= 4 && project.progress_step <= 6) return '진행 중';
  if (project.progress_step === 3) return '전문가 선택';
  return project.status === 'ACTIVE' ? '입찰 중' : '마감';
}

export function announcementTitle(project: Pick<AnnouncementSummary, 'industry' | 'purpose' | 'required_license'>) {
  return [project.industry, project.purpose, project.required_license].filter(Boolean).join(' · ') || '의뢰';
}

export function formatAmount(value: number | null | undefined, unit = '원') {
  return typeof value === 'number' && Number.isFinite(value) ? `${value.toLocaleString('ko-KR')}${unit}` : '미제공';
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function nullableText(value: unknown) {
  return value == null || typeof value === 'string';
}
function validBid(value: unknown) {
  return record(value)
    && ['expert_name', 'business_name', 'phone', 'email', 'status', 'result'].every(key => nullableText(value[key]))
    && ['bid_amount', 'final_amount'].every(key => value[key] === null || (typeof value[key] === 'number' && Number.isFinite(value[key])));
}
function validSummary(value: unknown) {
  return record(value) && typeof value.id === 'number' && ['registered_at', 'industry', 'purpose', 'business_owner_type', 'status'].every(key => typeof value[key] === 'string')
    && nullableText(value.announcement_code) && nullableText(value.required_license)
    && (value.bids === undefined || (Array.isArray(value.bids) && value.bids.every(validBid)))
    && (value.selected_bid == null || validBid(value.selected_bid));
}
export function parseMyAnnouncements(value: unknown): MyAnnouncements {
  if (!record(value) || !Array.isArray(value.past_announcements) || !value.past_announcements.every(validSummary)
    || (value.current_announcement !== null && (!validSummary(value.current_announcement) || !record(value.current_announcement)
      || typeof value.current_announcement.announcement_code !== 'string' || !value.current_announcement.announcement_code.trim()
      || !Array.isArray(value.current_announcement.bids)))) {
    throw new Error('의뢰 목록 응답 형식을 확인할 수 없습니다. 다시 조회해 주세요.');
  }
  return value as unknown as MyAnnouncements;
}

export function ownsAnnouncement(list: MyAnnouncements, code: string) {
  return [list.current_announcement, ...list.past_announcements].some(project => project?.announcement_code === code);
}

export function parseAnnouncementDetail(value: unknown, code: string): AnnouncementDetail {
  if (!record(value) || value.announcement_code !== code || !record(value.client_info)
    || !['company_name', 'business_number', 'representative_name', 'address', 'email', 'contact', 'founded_date'].every(key => nullableText((value.client_info as Record<string, unknown>)[key]))
    || !nullableText(value.required_license) || !nullableText(value.current_industry)
    || !Array.isArray(value.bids) || !value.bids.every(validBid)
    || !['registered_at', 'industry', 'purpose', 'business_owner_type', 'status'].every(key => typeof value[key] === 'string')) {
    throw new Error('의뢰 상세 응답 형식을 확인할 수 없습니다. 다시 조회해 주세요.');
  }
  return value as unknown as AnnouncementDetail;
}
