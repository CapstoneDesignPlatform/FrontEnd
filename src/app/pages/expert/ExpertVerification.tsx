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

  return (
    <div className="mx-auto max-w-[1071px] space-y-6">
      <ExpertVerificationHeader verificationStatus={verificationStatus} />

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
