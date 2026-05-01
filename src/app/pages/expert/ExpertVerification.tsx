import { useLocation, useNavigate } from "react-router-dom";

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
    businessLicense,
    canSubmit,
    career,
    certificates,
    handleAddCertificate,
    handleDeleteCertificate,
    handleSubmit,
    handleUpdateBusinessLicense,
    handleUpdateCertificate,
    isApproved,
    isPending,
    isSubmitting,
    setCareer,
    verificationStatus,
  } = useExpertVerificationForm({
    onSubmitted: () => navigate("/expert/verification/status?status=PENDING"),
    statusOverride: getStatusFromSearch(location.search),
  });

  return (
    <div className="mx-auto max-w-[1071px] space-y-6">
      <ExpertVerificationHeader verificationStatus={verificationStatus} />

      {!isApproved ? (
        <ExpertVerificationFormCard
          businessLicense={businessLicense}
          canSubmit={canSubmit}
          career={career}
          certificates={certificates}
          isPending={isPending}
          isSubmitting={isSubmitting}
          verificationStatus={verificationStatus}
          onAddCertificate={handleAddCertificate}
          onBusinessLicenseChange={handleUpdateBusinessLicense}
          onCareerChange={setCareer}
          onCertificateChange={handleUpdateCertificate}
          onCertificateDelete={handleDeleteCertificate}
          onSkip={() => navigate("/")}
          onSubmit={handleSubmit}
        />
      ) : null}

      {isApproved ? <ExpertVerificationApprovedCard /> : null}
    </div>
  );
}
