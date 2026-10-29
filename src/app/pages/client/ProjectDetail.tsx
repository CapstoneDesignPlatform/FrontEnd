import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { getMyAnnouncementDetail } from '../../../api/clientAnnouncements';
import { announcementStatus, announcementTitle, formatAmount } from '../../../api/clientAnnouncementsModel';
import { SelectionCancellationNotice } from '../../components/common/SelectionCancellationNotice';
import { RequestProgressCard } from '../../components/common/RequestProgressCard';
import { useAsyncData } from '../../hooks/useAsyncData';
import { BidSummary, QueryFeedback } from './AnnouncementViews';

export function ProjectDetail() {
  const { id = '' } = useParams();
  return <DetailContent key={id} code={id} />;
}

function DetailContent({ code }: { code: string }) {
  const load = useCallback(() => getMyAnnouncementDetail(code), [code]);
  const { data: project, error, isLoading, reload } = useAsyncData(load);
  return <div className="space-y-6"><div className="flex flex-wrap justify-between gap-3"><h1 className="text-3xl">의뢰 상세</h1><div className="flex gap-2"><Button variant="outline" onClick={reload} disabled={isLoading}>새로고침</Button><Button variant="outline" asChild><Link to="/client/projects">목록으로</Link></Button></div></div>
    <QueryFeedback loading={isLoading} error={error} retry={reload} />
    {!isLoading && !error && project && <>
      <RequestProgressCard status={project.status} progressStep={project.progress_step} />
      <Card><CardHeader><Badge variant="outline" className="w-fit">{announcementStatus(project)}</Badge><CardTitle className="leading-relaxed">{announcementTitle(project)}</CardTitle><p className="text-sm text-slate-500 break-all">의뢰 코드: {project.announcement_code} · 등록일: {project.registered_at}</p></CardHeader></Card>
      <div className="grid gap-6 lg:grid-cols-2"><InfoCard title="의뢰 정보" fields={[
        ['업종', project.industry], ['의뢰 목적', project.purpose], ['필요 면허', project.required_license], ['사업자 유형', project.business_owner_type], ['현재 업종', project.current_industry], ['자본 규모', formatAmount(project.capital_scale, '억원')],
      ]} /><InfoCard title="의뢰 기업 정보" fields={[
        ['회사명', project.client_info.company_name], ['사업자등록번호', project.client_info.business_number], ['대표자', project.client_info.representative_name], ['주소', project.client_info.address], ['연락처', project.client_info.contact], ['이메일', project.client_info.email], ['설립일', project.client_info.founded_date], ['자본금', formatAmount(project.client_info.capital, '억원')],
      ]} /></div>
      <Card><CardHeader><CardTitle>입찰·선정 정보</CardTitle></CardHeader><CardContent className="space-y-3"><BidSummary bids={project.bids} /><SelectionCancellationNotice project={project} />{(project.progress_step ?? 0) < 3 && <p className="text-sm text-slate-500">현재 입찰 정보는 아래 입찰 비교·선정 화면에서 확인할 수 있습니다.</p>}<Button asChild><Link to={`/client/projects/${encodeURIComponent(code)}/bids`}>입찰 비교·선정</Link></Button></CardContent></Card>
    </>}
  </div>;
}

function InfoCard({ title, fields }: { title: string; fields: [string, string | null | undefined][] }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><dl className="grid gap-4 sm:grid-cols-2">{fields.map(([label, value]) => <div key={label}><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 break-words">{value || '미제공'}</dd></div>)}</dl></CardContent></Card>;
}
