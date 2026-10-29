import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { getMyBiddingDetail } from '../../../api/clientAnnouncements';
import { canChooseExpertCandidate, compareBidAmounts } from '../../../api/clientBidRules';
import { announcementStatus, announcementTitle, formatAmount } from '../../../api/clientAnnouncementsModel';
import { formatBidAmountInKorean, parseBidAmount } from '../../utils/bidAmount';
import { useAsyncData } from '../../hooks/useAsyncData';
import { SelectionCancellationNotice } from '../../components/common/SelectionCancellationNotice';
import { BidSummary, QueryFeedback } from './AnnouncementViews';

export function BidList() {
  const { id = '' } = useParams();
  return <BiddingContent key={id} code={id} />;
}

function BiddingContent({ code }: { code: string }) {
  const load = useCallback(() => getMyBiddingDetail(code), [code]);
  const { data: project, error, isLoading, reload } = useAsyncData(load);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  useEffect(() => {
    setSelectedId(null);
    setAmount('');
  }, [project]);

  const bids = [...(project?.bids ?? [])].sort(compareBidAmounts);
  const selected = bids.find(bid => bid.bid_id === selectedId);
  const parsedAmount = parseBidAmount(amount);
  const disabled = isLoading || !!error;

  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between gap-3">
      <h1 className="text-3xl">입찰 전문가 비교</h1>
      <div className="flex gap-2">
        <Button variant="outline" disabled={isLoading} onClick={reload}>새로고침</Button>
        <Button variant="outline" asChild><Link to={`/client/projects/${encodeURIComponent(code)}`}>의뢰 상세</Link></Button>
      </div>
    </div>
    <QueryFeedback loading={isLoading} error={error} retry={reload} />
    {!isLoading && !error && project && <>
      <Card><CardHeader><CardTitle>{announcementTitle(project)}</CardTitle><p className="text-sm text-slate-500">{announcementStatus(project)}</p></CardHeader>
        <CardContent className="space-y-3">
          {((project.status === 'ACTIVE' && project.progress_step === 2) || (project.status === 'CLOSED' && project.progress_step === 3)) && <>
            <p className="text-sm">별도 마감 없이 입찰을 비교하고 전문가와 최종 금액을 선택하세요.</p>
            <p className="text-sm text-slate-500">현재 후보 선택과 금액 확인까지 가능합니다. 선정 확정 기능은 준비 중이며 아직 저장되지 않습니다.</p>
          </>}
          {project.progress_step === 1 && <p>기업 정보를 완성한 후 입찰 상태를 다시 확인해 주세요.</p>}
          {project.status !== 'CANCELLED' && (project.progress_step ?? 0) >= 4 && <p>선정된 전문가 정보를 확인할 수 있습니다.</p>}
          {project.status === 'CANCELLED' && <p>취소된 의뢰는 전문가를 선정할 수 없습니다.</p>}
          <SelectionCancellationNotice project={project} />
        </CardContent>
      </Card>
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{(project.progress_step ?? 0) >= 4 ? '선정 전문가' : '입찰 목록 · 낮은 금액순'}</h2>
        {!bids.length && <p className="text-slate-500">표시할 입찰이 없습니다.</p>}
        {bids.map((bid, index) => <Card key={bid.bid_id ?? index}><CardContent className="space-y-3 pt-6">
          <BidSummary bids={[bid]} />
          {canChooseExpertCandidate(project, bid) && <Button variant={selectedId === bid.bid_id ? 'default' : 'outline'} disabled={disabled} aria-pressed={selectedId === bid.bid_id} onClick={() => {
            setSelectedId(bid.bid_id!);
            setAmount(bid.bid_amount == null ? '' : String(bid.bid_amount));
          }}>{selectedId === bid.bid_id ? '선정 후보로 선택됨' : '이 전문가 선택'}</Button>}
        </CardContent></Card>)}
      </div>
      {selected && canChooseExpertCandidate(project, selected) && <Card><CardHeader><CardTitle>전문가 선정 확정</CardTitle></CardHeader><CardContent className="space-y-4">
        <p>{selected.expert_name || '선택한 전문가'} · 입찰 금액 {formatAmount(selected.bid_amount)}</p>
        <label className="block space-y-2" htmlFor="final-amount"><span>최종 합의 금액 (원)</span>
          <div className="flex flex-wrap items-center gap-3"><Input id="final-amount" className="max-w-sm" inputMode="numeric" value={amount} disabled={disabled} onChange={event => setAmount(event.target.value)} aria-describedby="amount-preview amount-help" /><span id="amount-preview" aria-live="polite" className="text-sm text-slate-500">{formatBidAmountInKorean(amount)}</span></div>
        </label>
        <p id="amount-help" className="text-sm text-slate-500">1원 이상 9,999,999,999,999원 이하의 정수를 숫자로 입력해 주세요. 입력한 금액은 선정 확정 전까지 저장되지 않습니다.</p>
        <p className="text-sm text-slate-500">선정 확정과 이후 선정 취소 기능을 준비하고 있습니다.</p>
        {amount && (parsedAmount === null || parsedAmount <= 0) && <p role="alert" className="text-sm text-red-600">최종 금액을 입력 범위에 맞게 확인해 주세요.</p>}
        <Button disabled>전문가 선정 확정 · 준비 중</Button>
      </CardContent></Card>}
    </>}
  </div>;
}
