import type { SubmitExpertVerificationRequest } from "../../../../types/expertVerification";
import type {
  VerificationBusinessLicenseData,
  VerificationCareerData,
  VerificationCertificateData,
} from "./types";

interface ExpertVerificationFormValues {
  businessLicense: VerificationBusinessLicenseData;
  career: VerificationCareerData;
  certificates: VerificationCertificateData[];
}

export function isCertificateStarted(
  certificate: VerificationCertificateData,
) {
  return Boolean(
    certificate.file ||
      certificate.type.trim() ||
      certificate.number.trim() ||
      certificate.issueDate ||
      certificate.name.trim(),
  );
}

export function validateExpertVerificationForm({
  businessLicense,
  career,
  certificates,
}: ExpertVerificationFormValues) {
  const primaryCertificate = certificates[0];

  if (!primaryCertificate?.file) {
    return "대표 자격증 사본을 업로드해주세요.";
  }

  if (!businessLicense.file) {
    return "사업자 등록증을 업로드해주세요.";
  }

  if (!primaryCertificate.type.trim()) {
    return "대표 자격증 종류를 입력해주세요.";
  }

  if (!primaryCertificate.number.trim()) {
    return "대표 자격증 번호를 입력해주세요.";
  }

  if (!primaryCertificate.issueDate) {
    return "대표 자격증 발급일을 입력해주세요.";
  }

  if (!career.companyName.trim()) {
    return "업체명을 입력해주세요.";
  }

  const incompleteCertificate = certificates.find(
    (certificate) =>
      isCertificateStarted(certificate) &&
      (!certificate.file ||
        !certificate.type.trim() ||
        !certificate.number.trim() ||
        !certificate.issueDate),
  );

  if (incompleteCertificate) {
    return "추가된 자격증의 필수 정보를 모두 입력해주세요.";
  }

  return null;
}

export function buildSubmitVerificationPayload({
  businessLicense,
  career,
  certificates,
}: ExpertVerificationFormValues): SubmitExpertVerificationRequest {
  const primaryCertificate = certificates[0];

  if (!primaryCertificate) {
    throw new Error("At least one certificate is required to submit verification.");
  }

  return {
    licenseType: primaryCertificate.type,
    licenseNumber: primaryCertificate.number,
    issueDate: primaryCertificate.issueDate,
    companyName: career.companyName,
    portfolio: career.portfolio,
    certificates: certificates
      .filter(isCertificateStarted)
      .map((certificate) => ({
        licenseType: certificate.type,
        licenseNumber: certificate.number,
        issueDate: certificate.issueDate,
        fileId: certificate.fileId,
        holderName: certificate.name || undefined,
        fileName: certificate.fileName || undefined,
      })),
    businessLicense: {
      businessNumber: businessLicense.businessNumber || undefined,
      ownerName: businessLicense.name || undefined,
      companyName: businessLicense.companyName || undefined,
      fileId: businessLicense.fileId,
      fileName: businessLicense.fileName || undefined,
    },
  };
}
