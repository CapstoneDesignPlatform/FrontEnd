import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSelectedJob } from '../../../api/selectedJob';
import { announcementTitle, formatAmount } from '../../../api/clientAnnouncementsModel';
import { useAsyncData } from '../../hooks/useAsyncData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { RequestProgressCard } from '../../components/common/RequestProgressCard';


export function SelectedJobManage() {
  const { id = '' } = useParams();
  return <SelectedJobContent key={id} code={id} />;
}

function SelectedJobContent({ code }: { code: string }) {
  const load = useCallback(() => getSelectedJob(code), [code]);
  const { data, error, isLoading, reload } = useAsyncData(load);
  const detail = data?.detail;
  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between gap-3">
      <h1 className="text-2xl font-bold">선정 의뢰 상세</h1>
      <div className="flex gap-2"><Button variant="outline" onClick={reload} disabled={isLoading}>새로고침</Button><Button variant="outline" asChild><Link to="/expert/dashboard">마이페이지로</Link></Button></div>
    </div>
    {isLoading && <p role="status" className="text-slate-500">선정 의뢰 정보를 불러오는 중입니다.</p>}
    {error && <div role="alert" className="space-y-3 rounded-lg border p-4"><p>{error.message}</p><Button variant="outline" onClick={reload}>다시 조회</Button></div>}
    {!isLoading && !error && data && detail && <>
      <RequestProgressCard status={detail.status} progressStep={detail.progress_step} />
      <Card><CardHeader><Badge variant="outline" className="w-fit">{detail.status === 'CANCELLED' ? '취소된 의뢰' : '선정된 의뢰'}</Badge><CardTitle>{announcementTitle(detail)}</CardTitle><p className="break-all text-sm text-slate-500">의뢰 코드 {code} · 등록일 {detail.registered_at}</p></CardHeader>
        <CardContent><dl className="grid gap-4 text-sm sm:grid-cols-2">
          <Field label="업종" value={detail.industry} /><Field label="의뢰 목적" value={detail.purpose} />
          <Field label="필요 면허" value={detail.required_license} /><Field label="사업자 유형" value={detail.business_owner_type} />
          <Field label="현재 업종" value={detail.current_industry} /><Field label="자본 규모" value={formatAmount(detail.capital_scale, '억원')} />
        </dl></CardContent>
      </Card>
      <Card><CardHeader><CardTitle>입찰 및 낙찰 정보</CardTitle></CardHeader><CardContent><dl className="grid gap-4 sm:grid-cols-3">
        <Field label="입찰 일시" value={data.ownBid.submittedAt?.replace('T', ' ')} />
        <Field label="입찰 금액" value={formatAmount(data.ownBid.amount)} />
        <Field label="낙찰 금액 (최종 합의 금액)" value={formatAmount(data.finalAmount)} />
      </dl></CardContent></Card>

      <Card><CardHeader><CardTitle>의뢰 기업 정보</CardTitle></CardHeader><CardContent><dl className="grid gap-4 text-sm sm:grid-cols-2">
        <Field label="회사명" value={detail.client_info.company_name} /><Field label="대표자" value={detail.client_info.representative_name} />
        <Field label="연락처" value={detail.client_info.contact} /><Field label="이메일" value={detail.client_info.email} />
        <Field label="주소" value={detail.client_info.address} /><Field label="자본금" value={formatAmount(detail.client_info.capital, '억원')} />
      </dl></CardContent></Card>
    </>}
  </div>;
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return <div><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium">{value || '미제공'}</dd></div>;
}
