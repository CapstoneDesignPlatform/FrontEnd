import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getExpertDetail, getExpertCertificates, getExpertBusinessInfo } from "../../../api/admin/expertApi";
import { loadAdminReview, parseReviewUserId } from "../../../api/admin/adminReview";
import type { AdminReview } from "../../../api/admin/adminReview";

const statusLabels: Record<string, string> = {
  NOT_SUBMITTED: "미신청", PENDING: "승인 대기", APPROVED: "승인 완료", REJECTED: "반려",
};
const display = (value: unknown) => value === null || value === undefined || value === "" ? "미제공" : String(value);

export function AdminExpertApproval() {
  const { id } = useParams();
  const userId = parseReviewUserId(id);
  const [review, setReview] = useState<AdminReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [exporting, setExporting] = useState(false);
  const currentRoute = useRef(id);
  currentRoute.current = id;
  useEffect(() => () => { currentRoute.current = undefined; }, []);

  useEffect(() => {
    let active = true;
    setReview(null);
    setError("");
    setLoading(true);
    if (userId === null) {
      setError("유효하지 않은 전문가 ID입니다.");
      setLoading(false);
      return;
    }
    loadAdminReview(userId, { getExpertDetail, getExpertCertificates, getExpertBusinessInfo })
      .then((data) => { if (active) setReview(data); })
      .catch(() => { if (active) setError("심사 정보를 확인하지 못했습니다. 접근 권한과 신청자 정보를 확인한 뒤 다시 시도해주세요."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId, attempt]);

  const ready = !loading && !error && review?.detail.userId === userId;
  const exportReview = async () => {
    if (!ready || !review || exporting) return;
    const route = id;
    setExporting(true);
    try {
      const XLSX = await import("xlsx");
      if (currentRoute.current !== route) return;
      const wb = XLSX.utils.book_new();
      const { detail, certificates, business } = review;
      const rows = [
        ["항목", "내용"], ["사용자 ID", detail.userId], ["전문가 프로필 ID", detail.expertProfileId],
        ["이메일", detail.email], ["전문분야", display(detail.expertField)],
        ["인증 상태", statusLabels[detail.verificationStatus]], ["프로필 등록일", display(detail.createdAt)],
        ["프로필 수정일", display(detail.updatedAt)], ["상호명", display(business.companyName)],
        ["대표자명", display(business.representativeName)], ["사업자등록번호", display(business.businessNumber)],
        ["사업자등록증 파일 ID", business.fileId],
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), "신청자정보");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
        ["자격증 ID", "파일 ID", "소유자명", "자격증 종류 코드", "자격증 번호", "등록 날짜(issueDate)", "등록일"],
        ...certificates.map(c => [c.certificateId, c.fileId, display(c.ownerName), display(c.certificateTypeCode), display(c.certificateNumber), display(c.issueDate), display(c.createdAt)]),
      ]), "자격증정보");
      XLSX.writeFile(wb, `전문가심사_${detail.userId}.xlsx`);
    } catch {
      toast.error("엑셀 파일을 생성하지 못했습니다.");
    } finally { setExporting(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="ghost" size="sm"><Link to="/admin/experts"><ArrowLeft className="h-4 w-4" />전문가 관리로</Link></Button>
          <h1 className="text-xl font-semibold">전문가 인증 심사</h1>
        </div>
        <Button variant="outline" onClick={exportReview} disabled={!ready || exporting}><Download className="h-4 w-4" />{exporting ? "엑셀 생성 중" : "Excel 다운로드"}</Button>
      </div>
      {error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          {userId !== null && <Button className="mt-3" variant="outline" onClick={() => setAttempt(v => v + 1)}>다시 불러오기</Button>}
        </div>
      ) : !ready ? <p role="status" className="p-4 text-sm text-slate-500">심사 정보를 불러오는 중입니다.</p> : null}
      {ready && review && <>
        <Card>
          <CardHeader><CardTitle>{review.detail.email} · {statusLabels[review.detail.verificationStatus]}</CardTitle></CardHeader>
          <CardContent>
            <InfoRows rows={[
              ["사용자 ID", review.detail.userId], ["전문가 프로필 ID", review.detail.expertProfileId],
              ["이메일", review.detail.email], ["전문분야", review.detail.expertField],
              ["프로필 등록일", review.detail.createdAt], ["프로필 수정일", review.detail.updatedAt],
            ]} />
            <p className="mt-3 text-xs text-slate-500">신청자 이름·연락처·인증 신청일은 현재 제공되지 않습니다. 서류의 소유자명과 대표자명은 아래에 별도로 표시합니다.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>자격증 정보 ({review.certificates.length}건)</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {review.certificates.length === 0 && <p className="text-sm text-amber-700">등록된 자격증이 없습니다. 심사에 필요한 서류를 확인할 수 없습니다.</p>}
            {review.certificates.map(c => <div key={c.certificateId} className="rounded-md border p-3">
              <InfoRows rows={[["자격증 ID", c.certificateId], ["소유자명", c.ownerName], ["종류 코드", c.certificateTypeCode], ["자격증 번호", c.certificateNumber], ["등록 날짜 (issueDate)", c.issueDate], ["등록일", c.createdAt], ["첨부 파일 ID", c.fileId]]} />
              <Button disabled variant="outline" size="sm" className="mt-3">원본 열람 준비 중</Button>
            </div>)}
            <p className="text-xs text-slate-500">날짜는 서버의 issueDate 값입니다. 발급일·유효기간 구분은 확인이 필요합니다.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>사업자등록 정보</CardTitle></CardHeader>
          <CardContent>
            <InfoRows rows={[["상호명", review.business.companyName], ["대표자명", review.business.representativeName], ["사업자등록번호", review.business.businessNumber], ["등록일", review.business.createdAt], ["수정일", review.business.updatedAt], ["첨부 파일 ID", review.business.fileId]]} />
            <Button disabled variant="outline" size="sm" className="mt-3">원본 열람 준비 중</Button>
          </CardContent>
        </Card>
      </>}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p>{ready && review?.detail.verificationStatus !== "PENDING" ? "승인 대기 상태의 신청만 심사할 수 있습니다." : "현재 관리자용 원본 서류 열람을 지원하지 않아 승인·반려를 보류합니다. 서류 확인 기능이 연결된 후 심사할 수 있습니다."}</p>
        <div className="mt-3 flex gap-2"><Button disabled>승인</Button><Button disabled variant="outline">반려</Button></div>
      </div>
    </div>
  );
}

function InfoRows({ rows }: { rows: Array<[string, unknown]> }) {
  return <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">{rows.map(([label, value]) => <div key={label} className="min-w-0"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words text-slate-900">{display(value)}</dd></div>)}</dl>;
}
