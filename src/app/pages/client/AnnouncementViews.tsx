import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { getMyAnnouncements } from '../../../api/clientAnnouncements';
import { announcementStatus, announcementTitle, formatAmount } from '../../../api/clientAnnouncementsModel';
import type { AnnouncementBid, AnnouncementSummary } from '../../../api/clientAnnouncementsModel';
import { RequestProgressCard } from '../../components/common/RequestProgressCard';
import { useAsyncData } from '../../hooks/useAsyncData';

export function QueryFeedback({ loading, error, retry }: { loading: boolean; error: Error | null; retry: () => void }) {
  if (loading) return <p role="status" className="py-8 text-slate-500">의뢰 정보를 불러오는 중입니다.</p>;
  if (error) return <div role="alert" className="space-y-3 rounded-lg border p-5"><p>{error.message}</p><div className="flex gap-2"><Button variant="outline" onClick={retry}>다시 조회</Button><Button variant="outline" asChild><Link to="/login">로그인</Link></Button></div></div>;
  return null;
}

export function BidSummary({ bids }: { bids: AnnouncementBid[] }) {
  if (!bids.length) return <p className="text-sm text-slate-500">표시할 입찰 정보가 없습니다.</p>;
  return <div className="space-y-3">{bids.map((bid, index) => <div key={bid.bid_id ?? index} className="rounded-lg border p-4 text-sm">
    <div className="flex flex-wrap items-center gap-2"><strong>{bid.expert_name || '이름 미제공'}</strong><span className="text-slate-500">{bid.business_name || '업체명 미제공'}</span><Badge variant="outline">{{ PENDING: '대기', SELECTED: '선정', REJECTED: '미선정' }[bid.status ?? bid.result ?? ''] ?? '상태 확인 필요'}</Badge></div>
    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2"><span>입찰 금액: {formatAmount(bid.bid_amount)}</span><span>최종 금액: {formatAmount(bid.final_amount)}</span></div>
    {(bid.status === 'SELECTED' || bid.result === 'SELECTED') && (bid.phone || bid.email) && <p className="mt-2 break-all text-slate-600">연락처: {[bid.phone, bid.email].filter(Boolean).join(' · ')}</p>}
  </div>)}</div>;
}

export function SummaryCard({ project, current = false }: { project: AnnouncementSummary; current?: boolean }) {
  const code = project.announcement_code;
  return <Card><CardHeader><div className="flex flex-wrap items-center gap-2"><Badge variant="outline">{announcementStatus(project)}</Badge><span className="text-sm text-slate-500">등록일 {project.registered_at}</span></div><CardTitle className="leading-relaxed">{announcementTitle(project)}</CardTitle></CardHeader>
    <CardContent className="space-y-4"><dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-slate-500">사업자 유형</dt><dd>{project.business_owner_type}</dd></div><div><dt className="text-slate-500">자본 규모</dt><dd>{formatAmount(project.capital_scale, '억원')}</dd></div></dl>
      <details><summary className="cursor-pointer text-sm font-medium">{current ? '입찰·선정 정보' : '선정 전문가 정보'}</summary><div className="mt-3"><BidSummary bids={current ? project.bids ?? [] : project.selected_bid ? [project.selected_bid] : []} /></div></details>
      {code && current && <Button asChild><Link to={`/client/projects/${encodeURIComponent(code)}/bids`}>입찰 비교·선정</Link></Button>}
      {code ? <Button variant="outline" asChild><Link to={`/client/projects/${encodeURIComponent(code)}`}>상세보기</Link></Button> : <p className="text-sm text-slate-500">상세 조회는 준비 중입니다. 현재는 위 요약 정보를 확인할 수 있습니다.</p>}
    </CardContent></Card>;
}

export function MyAnnouncementsView({ mode }: { mode: 'list' | 'mypage' }) {
  const { data, error, isLoading, reload } = useAsyncData(getMyAnnouncements);
  const current = data?.current_announcement;
  const past = data?.past_announcements ?? [];
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl">{mode === 'list' ? '내 의뢰 목록' : '마이페이지'}</h1><p className="mt-2 text-slate-500">등록한 의뢰와 진행 현황을 확인하세요.</p></div><div className="flex gap-2"><Button variant="outline" onClick={reload} disabled={isLoading}>새로고침</Button><Button asChild><Link to="/client/create-project">새 의뢰 작성</Link></Button></div></div>
    <QueryFeedback loading={isLoading} error={error} retry={reload} />
    {!isLoading && !error && data && <>{current && <RequestProgressCard status={current.status} progressStep={current.progress_step} />}<section className="space-y-3"><h2 className="text-xl font-semibold">현재 의뢰</h2>{current ? <SummaryCard project={current} current /> : <p className="rounded-lg border p-6 text-slate-500">현재 진행 중인 의뢰가 없습니다.</p>}</section><section className="space-y-3"><h2 className="text-xl font-semibold">이전 의뢰</h2>{past.length ? past.map(project => <SummaryCard key={project.id} project={project} />) : <p className="text-slate-500">이전 의뢰가 없습니다.</p>}</section></>}
  </div>;
}
