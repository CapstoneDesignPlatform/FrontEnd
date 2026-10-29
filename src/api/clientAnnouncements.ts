import { apiClient, ApiError } from './apiClient';
import { getStoredAccessToken } from './authTokens';
import { ownsAnnouncement, parseAnnouncementDetail, parseMyAnnouncements } from './clientAnnouncementsModel';

export async function getMyAnnouncements() {
  if (!getStoredAccessToken()) throw new Error('로그인 후 내 의뢰를 확인해 주세요.');
  try {
    return parseMyAnnouncements(await apiClient.get<unknown>('/announcements/my'));
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      throw new Error('의뢰인 계정으로 다시 로그인한 후 확인해 주세요.');
    }
    throw error;
  }
}

export async function getMyAnnouncementDetail(code: string) {
  const list = await getMyAnnouncements();
  // The public code lookup does not enforce ownership. Check the authenticated list
  // before requesting details; server-side authorization is still required (API-010).
  if (!code || !ownsAnnouncement(list, code)) {
    throw new Error('내 의뢰 목록에서 확인되지 않는 의뢰입니다. 목록에서 다시 선택해 주세요.');
  }
  return parseAnnouncementDetail(await apiClient.get<unknown>(`/announcements/${encodeURIComponent(code)}`), code);
}

export async function getMyBiddingDetail(code: string) {
  const list = await getMyAnnouncements();
  if (!code || !ownsAnnouncement(list, code)) throw new Error('내 의뢰 목록에서 확인되지 않는 의뢰입니다.');
  const detail = parseAnnouncementDetail(await apiClient.get<unknown>(`/announcements/${encodeURIComponent(code)}`), code);
  const current = list.current_announcement;
  // Before closing, only /my exposes bids. Never reuse that list after selection.
  if (detail.progress_step === 2 && current?.announcement_code === code && current.progress_step === 2) {
    return { ...detail, bids: current.bids ?? [] };
  }
  return detail;
}

export async function closeMyAnnouncement(code: string) {
  await apiClient.patch<void>(`/announcements/${encodeURIComponent(code)}/close`);
}

export async function selectMyExpert(code: string, bidId: number, finalAmount: number) {
  if (!Number.isSafeInteger(bidId) || bidId <= 0 || !Number.isSafeInteger(finalAmount) || finalAmount <= 0 || finalAmount > 9_999_999_999_999) {
    throw new Error('전문가와 최종 금액을 확인해 주세요.');
  }
  await apiClient.patch<unknown>(`/announcements/${encodeURIComponent(code)}/bids/${bidId}/select`, {
    body: { final_amount: finalAmount },
  });
}
