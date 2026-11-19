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

export function ExpertVerification() {
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
    onSubmitted: () => navigate("/expert/verification/status"),
    statusOverride: getStatusFromSearch(location.search),
  });

  if (isLoading || loadError) return <div className="mx-auto max-w-[1071px] space-y-4 rounded-xl border p-6">
    <p role={loadError ? "alert" : "status"}>{loadError ? "인증 정보를 불러오지 못했습니다. 수정 전 최신 상태를 확인해 주세요." : "인증 정보를 불러오는 중입니다."}</p>
    {loadError && <Button variant="outline" onClick={reload}>다시 시도</Button>}
  </div>;

  return (
    <div className="mx-auto max-w-[1071px] space-y-6">
      <ExpertVerificationHeader verificationStatus={verificationStatus} />

      {verificationRequest && <div className="rounded-xl border bg-white p-6"><ExpertSubmittedDocuments verificationRequest={verificationRequest} /></div>}

      {verificationRequest?.status === "REJECTED" && verificationRequest.rejectedReason && <div className="rounded-xl border border-red-200 bg-red-50 p-4"><h2 className="font-semibold">반려 사유</h2><p className="mt-2 whitespace-pre-wrap">{verificationRequest.rejectedReason}</p></div>}
      {submissionNeedsCheck && !isSubmitting && <div role="status" className="rounded-xl border p-4 space-y-3"><p>신청 접수 여부를 확인한 뒤 다음 작업을 진행해 주세요.</p><Button variant="outline" onClick={reload}>인증 상태 다시 확인</Button><Button asChild variant="outline"><Link to="/expert/verification/status">인증 상태 화면</Link></Button></div>}

      {!isApproved ? (
        <ExpertVerificationFormCard
          businessLicense={businessLicense}
          canSubmit={canSubmit}
          certificates={certificates}
          isPending={isPending}
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
