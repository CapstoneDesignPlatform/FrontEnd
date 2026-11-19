import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../ui/button';
import { getStoredAccessToken } from '../../../api/authTokens';
import { shouldUseMockApi } from '../../../api/apiMode';
import { fetchExpertFile } from '../../../api/expertFileDownload';
import type { ExpertVerificationStatusVM } from '../../../types/expertVerification';

function DocumentDownload({ fileId, label, filename }: { fileId?: number; label: string; filename?: string }) {
  const active = useRef<AbortController | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => { active.current?.abort(); active.current = null; }, []);
  const available = !shouldUseMockApi && Number.isSafeInteger(fileId) && (fileId ?? 0) > 0;
  async function download() {
    if (!available || active.current) return;
    const controller = new AbortController();
    active.current = controller;
    setBusy(true);
    setError('');
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const { blob, filename: originalName } = await fetchExpertFile(fileId!, getStoredAccessToken(), controller.signal, import.meta.env.VITE_API_BASE_URL ?? '/api');
      if (controller.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Give the browser time to consume the download before releasing its Blob URL.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (reason) {
      if (active.current === controller) setError(controller.signal.aborted
        ? '다운로드 응답이 지연되고 있습니다. 다시 시도해 주세요.'
        : reason instanceof Error ? reason.message : '다운로드하지 못했습니다. 다시 시도해 주세요.');
    } finally {
      clearTimeout(timer);
      if (active.current === controller) { active.current = null; setBusy(false); }
    }
  }
  return <li className="rounded-lg border p-3 space-y-2">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0"><p className="text-sm font-medium">{label}</p>{filename && <p className="text-xs text-gray-500 break-all">{filename}</p>}</div>
      <Button type="button" variant="outline" size="sm" disabled={!available || busy} onClick={() => void download()} aria-label={`${label} 다운로드`}>
        <Download className="h-4 w-4 mr-2" />{busy ? '다운로드 중…' : '다운로드'}
      </Button>
    </div>
    {!available && <p className="text-xs text-gray-500">{shouldUseMockApi ? '데모 서류는 다운로드할 수 없습니다.' : '다운로드할 파일 정보가 없습니다.'}</p>}
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
  </li>;
}

export function ExpertSubmittedDocuments({ verificationRequest }: { verificationRequest: ExpertVerificationStatusVM }) {
  const certificates = verificationRequest.certificates ?? [];
  const business = verificationRequest.businessLicense;
  return <section aria-label="본인 제출 서류" className="space-y-3">
    <h3 className="font-semibold text-gray-900">본인 제출 서류</h3>
    {!certificates.length && !business ? <p className="text-sm text-gray-500">등록된 서류가 없습니다.</p> : <ul className="space-y-2">
      {certificates.map((certificate, index) => <DocumentDownload key={`${certificate.fileId}-${index}`} fileId={certificate.fileId} label={`자격증 ${index + 1}${certificate.licenseType ? ` · ${certificate.licenseType}` : ''}`} filename={certificate.fileName} />)}
      {business && <DocumentDownload key={`business-${business.fileId}`} fileId={business.fileId} label="사업자등록증" filename={business.fileName} />}
    </ul>}
  </section>;
}
