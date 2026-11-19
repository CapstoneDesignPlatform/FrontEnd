import { Button } from "../../components/ui/button";
import { ExpertSubmittedDocuments } from '../../components/expert/ExpertSubmittedDocuments';
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ExpertVerificationApprovedCard,
  ExpertVerificationFormCard,
  ExpertVerificationHeader,
  useExpertVerificationForm,
} from "../../components/expert/verification";
import { getStatusFromSearch } from "../../components/expert/expertGuardUtils";

export function ExpertVerificationEdit() {
  return <ExpertVerification editMode />;
}

export function ExpertVerification({ editMode = false }: { editMode?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    verificationRequest,
    loadError,
    isLoading,
    reload,
    submissionNeedsCheck,
    businessLicense,
    canSubmit,
    certificates,
    handleAddCertificate,
    handleDeleteCertificate,
    handleSubmit,
    handleUpdateBusinessLicense,
    handleUpdateCertificate,
    isApproved,
    isPending,
    isSubmitting,
    qualificationType,
    setQualificationType,
    verificationStatus,
  } = useExpertVerificationForm({
    allowPendingDraft: editMode,
    onSubmitted: () => navigate("/expert/verification/status"),
    statusOverride: getStatusFromSearch(location.search),
  });

  if (isLoading || loadError) return <div className="mx-auto max-w-[1071px] space-y-4 rounded-xl border p-6">
    <p role={loadError ? "alert" : "status"}>{loadError ? "인증 정보를 불러오지 못했습니다. 수정 전 최신 상태를 확인해 주세요." : "인증 정보를 불러오는 중입니다."}</p>
    {loadError && <Button variant="outline" onClick={reload}>다시 시도</Button>}
  </div>;

  return (
    <div className="mx-auto max-w-[1071px] space-y-6">
      {editMode ? <div className="space-y-2"><Button asChild variant="outline"><Link to="/expert/verification/status">인증 상태로 돌아가기</Link></Button><h1 className="text-2xl font-semibold">인증 정보 수정</h1><p className="text-sm text-gray-500">신청 정보와 제출 서류를 확인하고 수정하세요.</p></div> : <ExpertVerificationHeader verificationStatus={verificationStatus} />}
      {editMode && isPending && <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">승인 대기 중 정보 수정 저장은 준비 중입니다. 입력값을 편집할 수 있지만 서버에는 저장되지 않으며, 페이지를 나가면 변경 내용이 사라집니다.</div>}

      {verificationRequest && <div className="rounded-xl border bg-white p-6"><ExpertSubmittedDocuments verificationRequest={verificationRequest} /></div>}

      {verificationRequest?.status === "REJECTED" && verificationRequest.rejectedReason && <div className="rounded-xl border border-red-200 bg-red-50 p-4"><h2 className="font-semibold">반려 사유</h2><p className="mt-2 whitespace-pre-wrap">{verificationRequest.rejectedReason}</p></div>}
      {submissionNeedsCheck && !isSubmitting && <div role="status" className="rounded-xl border p-4 space-y-3"><p>신청 접수 여부를 확인한 뒤 다음 작업을 진행해 주세요.</p><Button variant="outline" onClick={reload}>인증 상태 다시 확인</Button><Button asChild variant="outline"><Link to="/expert/verification/status">인증 상태 화면</Link></Button></div>}

      {!isApproved ? (
        <ExpertVerificationFormCard
          businessLicense={businessLicense}
          canSubmit={canSubmit || (editMode && isPending)}
          pendingDraft={editMode && isPending}
          certificates={certificates}
          isPending={isPending && !editMode}
          isSubmitting={isSubmitting}
          qualificationType={qualificationType}
          verificationStatus={verificationStatus}
          onAddCertificate={handleAddCertificate}
          onBusinessLicenseChange={handleUpdateBusinessLicense}
          onCertificateChange={handleUpdateCertificate}
          onCertificateDelete={handleDeleteCertificate}
          onQualificationTypeChange={setQualificationType}
          onSkip={() => navigate("/")}
          onSubmit={handleSubmit}
        />
      ) : null}

      {isApproved ? <ExpertVerificationApprovedCard /> : null}
    </div>
  );
}
