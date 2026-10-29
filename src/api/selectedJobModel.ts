import type { AnnouncementDetail } from './clientAnnouncementsModel';

export function requireSelectedJob(value: unknown, code: string) {
  if (!value || typeof value !== 'object') throw new Error('의뢰 정보를 확인할 수 없습니다.');
  const job = value as Record<string, unknown>;
  const bid = job.my_bid as Record<string, unknown> | null;
  if (job.announcement_code !== code || !bid || typeof bid !== 'object'
    || bid.status !== 'SELECTED' || !Number.isSafeInteger(bid.id) || Number(bid.id) <= 0) {
    throw new Error('본인이 선정된 의뢰만 확인할 수 있습니다.');
  }
  return {
    id: bid.id as number,
    amount: typeof bid.bid_amount === 'number' && Number.isFinite(bid.bid_amount) ? bid.bid_amount : null,
    submittedAt: typeof bid.submitted_at === 'string' ? bid.submitted_at : null,
  };
}

export function matchSelectedJob(detail: AnnouncementDetail, ownBidId: number) {
  const selected = detail.bids.filter(bid => bid.status === 'SELECTED');
  if (selected.length !== 1 || selected[0].bid_id !== ownBidId) {
    throw new Error('선정 정보가 변경되었거나 일치하지 않습니다. 다시 조회해 주세요.');
  }
  const step = detail.progress_step;
  return {
    finalAmount: selected[0].final_amount,
    progressStep: Number.isInteger(step) && step! >= 1 && step! <= 7 ? step! : null,
  };
}
