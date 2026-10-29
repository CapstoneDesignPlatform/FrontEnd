import { apiClient } from './apiClient';
import { parseAnnouncementDetail } from './clientAnnouncementsModel';
import { matchSelectedJob, requireSelectedJob } from './selectedJobModel';

export async function getSelectedJob(code: string) {
  if (!code.trim()) throw new Error('의뢰 코드가 필요합니다.');
  const path = encodeURIComponent(code);
  const ownBid = requireSelectedJob(await apiClient.get<unknown>(`/expert/job-posts/${path}`), code);
  // Verify the authenticated expert's bid before reading the shared detail endpoint.
  // A server-enforced selected-expert detail contract is requested in API-012.
  const detail = parseAnnouncementDetail(await apiClient.get<unknown>(`/announcements/${path}`), code);
  const selected = matchSelectedJob(detail, ownBid.id);
  return { detail, ownBid, ...selected };
}
