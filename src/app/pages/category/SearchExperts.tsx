import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search, X } from 'lucide-react';
import { ApiError } from '../../../api/apiClient';
import { getPublicExpert, searchPublicExperts } from '../../../api/publicExperts';
import type { ExpertCertificateType, ExpertSearchCategory, PublicExpertDetail, PublicExpertPage } from '../../../api/publicExperts';

function Certificates({ values }: { values: ExpertCertificateType[] }) {
  return values.length ? <div className="flex flex-wrap gap-2">{values.map(value => <Badge key={value.code} variant="secondary">{value.name}</Badge>)}</div> : <span className="text-gray-500">등록된 자격 정보 없음</span>;
}

function ExpertDetail({ id, onClose }: { id: number; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [detail, setDetail] = useState<PublicExpertDetail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setDetail(null);
    getPublicExpert(id, controller.signal).then(value => {
      if (!controller.signal.aborted) setDetail(value);
    }).catch(reason => {
      if (!controller.signal.aborted) setError(reason instanceof ApiError && reason.status === 404
        ? '더 이상 공개되지 않거나 찾을 수 없는 전문가입니다.' : '전문가 정보를 불러오지 못했습니다. 다시 시도해 주세요.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, retry]);

  return <dialog ref={dialog} onCancel={onClose} aria-labelledby="expert-detail-title"
    className="m-auto w-[calc(100%-2rem)] max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border-0 bg-white p-6 shadow-xl backdrop:bg-black/50">
    <div className="flex items-center justify-between gap-4 mb-6">
      <h2 id="expert-detail-title" className="text-xl font-bold">전문가 상세</h2>
      <Button variant="ghost" size="icon" onClick={onClose} aria-label="전문가 상세 닫기"><X className="h-5 w-5" /></Button>
    </div>
    {loading && <p role="status">전문가 정보를 불러오는 중입니다.</p>}
    {error && <div role="alert" className="space-y-3"><p>{error}</p><Button variant="outline" onClick={() => setRetry(value => value + 1)}>다시 시도</Button></div>}
    {detail && <div className="space-y-6">
      <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-sm break-words">
        <dt className="text-gray-500">업체명</dt><dd>{detail.company_name || '미등록'}</dd>
        <dt className="text-gray-500">전문가명</dt><dd>{detail.name || '미등록'}</dd>
        <dt className="text-gray-500">대표자명</dt><dd>{detail.representative_name || '미등록'}</dd>
        <dt className="text-gray-500">연락처</dt><dd>{detail.phone || '미등록'}</dd>
      </dl>
      <section><h3 className="font-semibold mb-2">보유 자격</h3><Certificates values={detail.certificate_types} /></section>
      <section><h3 className="font-semibold mb-2">전문가 소개</h3><p className="whitespace-pre-wrap break-words text-gray-600">{detail.portfolio_description || '등록된 소개가 없습니다.'}</p></section>
    </div>}
  </dialog>;
}

export function SearchExperts() {
  const [category, setCategory] = useState<ExpertSearchCategory>('ALL');
  const [keyword, setKeyword] = useState('');
  const [query, setQuery] = useState({ category: 'ALL' as ExpertSearchCategory, keyword: '', page: 1 });
  const [result, setResult] = useState<PublicExpertPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setResult(null);
    searchPublicExperts(query.category, query.keyword, query.page, controller.signal).then(value => {
      if (!controller.signal.aborted) setResult(value);
    }).catch(() => {
      if (!controller.signal.aborted) setError('전문가 목록을 불러오지 못했습니다. 다시 시도해 주세요.');
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, retry]);

  return <div className="max-w-7xl mx-auto px-6 space-y-6 pb-8">
    <div className="mt-8"><h1 className="text-3xl font-bold mb-2">전문가 검색</h1><p className="text-gray-600">업체명, 대표자명 또는 자격으로 전문가를 찾아보세요.</p></div>
    <Card><CardHeader><CardTitle>검색 조건</CardTitle></CardHeader><CardContent>
      <form className="grid md:grid-cols-[200px_1fr_auto] gap-4 items-end" onSubmit={event => {
        event.preventDefault();
        setQuery({ category, keyword: keyword.trim(), page: 1 });
      }}>
        <div className="space-y-2"><Label htmlFor="expert-category">카테고리</Label>
          <Select value={category} onValueChange={value => setCategory(value as ExpertSearchCategory)}>
            <SelectTrigger id="expert-category"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="ALL">전체</SelectItem><SelectItem value="COMPANY_NAME">업체명</SelectItem><SelectItem value="REPRESENTATIVE_NAME">대표자명</SelectItem><SelectItem value="CERTIFICATE">자격</SelectItem></SelectContent>
          </Select></div>
        <div className="space-y-2"><Label htmlFor="expert-keyword">검색어</Label><Input id="expert-keyword" maxLength={100} value={keyword} onChange={event => setKeyword(event.target.value)} placeholder="검색어를 입력하세요" /></div>
        <Button type="submit"><Search className="w-4 h-4 mr-2" />검색</Button>
      </form>
    </CardContent></Card>
    <Card><CardHeader><CardTitle>전문가 목록</CardTitle>{result && <CardDescription>총 {result.total_count.toLocaleString()}명의 전문가</CardDescription>}</CardHeader>
      <CardContent>
        {loading && <p role="status" className="py-12 text-center text-gray-500">전문가 목록을 불러오는 중입니다.</p>}
        {error && <div role="alert" className="py-8 text-center space-y-3"><p>{error}</p><Button variant="outline" onClick={() => setRetry(value => value + 1)}>다시 시도</Button></div>}
        {result && <><div className="rounded-md border overflow-x-auto"><Table><TableHeader><TableRow><TableHead>업체명</TableHead><TableHead>대표자명</TableHead><TableHead>보유 자격</TableHead><TableHead>상세보기</TableHead></TableRow></TableHeader>
          <TableBody>{result.items.length ? result.items.map(expert => <TableRow key={expert.expert_user_id}>
            <TableCell className="font-medium">{expert.company_name || '미등록'}</TableCell><TableCell>{expert.representative_name || '미등록'}</TableCell>
            <TableCell><Certificates values={expert.certificate_types} /></TableCell>
            <TableCell><Button variant="outline" size="sm" onClick={() => setSelectedId(expert.expert_user_id)} aria-label={`${expert.company_name || expert.representative_name || '전문가'} 상세보기`}>상세보기</Button></TableCell>
          </TableRow>) : <TableRow><TableCell colSpan={4} className="h-32 text-center text-gray-500">검색 결과가 없습니다.</TableCell></TableRow>}</TableBody>
        </Table></div>
        <nav aria-label="전문가 목록 페이지" className="flex items-center justify-center gap-4 mt-5">
          <Button variant="outline" disabled={result.page <= 1} onClick={() => setQuery(value => ({ ...value, page: result.page - 1 }))}>이전</Button>
          <span className="text-sm">{result.page} / {Math.max(1, result.total_pages)} 페이지</span>
          <Button variant="outline" disabled={!result.has_next} onClick={() => setQuery(value => ({ ...value, page: result.page + 1 }))}>다음</Button>
        </nav></>}
      </CardContent>
    </Card>
    {selectedId !== null && <ExpertDetail key={selectedId} id={selectedId} onClose={() => setSelectedId(null)} />}
  </div>;
}
