import type { AnnouncementBid, AnnouncementSummary } from './clientAnnouncementsModel';

type Stage = Pick<AnnouncementSummary, 'status' | 'progress_step'>;
export function canCloseBidding(project: Stage, bids: AnnouncementBid[]) {
  return project.status === 'ACTIVE' && project.progress_step === 2 && bids.length > 0;
}
export function canSelectExpert(project: Stage, bid: AnnouncementBid) {
  return project.status === 'CLOSED' && project.progress_step === 3 && bid.status === 'PENDING'
    && Number.isSafeInteger(bid.bid_id) && (bid.bid_id ?? 0) > 0;
}
export function compareBidAmounts(a: AnnouncementBid, b: AnnouncementBid) {
  const amount = (bid: AnnouncementBid) => typeof bid.bid_amount === 'number' && Number.isFinite(bid.bid_amount) ? bid.bid_amount : Infinity;
  return amount(a) - amount(b) || (a.bid_id ?? 0) - (b.bid_id ?? 0);
}

// Candidate choice is a local preview, not authorization to call the legacy select API.
export function canChooseExpertCandidate(project: Stage, bid: AnnouncementBid) {
  const reviewing = (project.status === 'ACTIVE' && project.progress_step === 2)
    || (project.status === 'CLOSED' && project.progress_step === 3);
  return reviewing && bid.status === 'PENDING' && Number.isSafeInteger(bid.bid_id) && (bid.bid_id ?? 0) > 0;
}
