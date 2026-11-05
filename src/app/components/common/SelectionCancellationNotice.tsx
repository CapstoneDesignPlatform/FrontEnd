import type { AnnouncementSummary } from '../../../api/clientAnnouncementsModel';
import { Button } from '../ui/button';

export function SelectionCancellationNotice({ project }: {
  project: Pick<AnnouncementSummary, 'status' | 'progress_step' | 'bids'>;
}) {
  const selected = project.bids?.some(bid => bid.status === 'SELECTED');
  if (!selected || project.status === 'CANCELLED' || project.progress_step === 7) return null;
  return <div className="space-y-2 rounded-lg border p-4">
    <p className="text-sm">전문가 변경이 필요하신가요?</p>
    <p className="text-sm text-slate-500">의뢰를 유지하면서 현재 전문가 선정을 취소하고 다른 전문가를 선택하는 기능을 준비하고 있습니다. 지금은 선정이 취소되지 않습니다.</p>
    <Button variant="outline" disabled>전문가 선정 취소 · 준비 중</Button>
  </div>;
}
