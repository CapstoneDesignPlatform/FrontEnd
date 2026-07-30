import type { SubmitExpertVerificationRequest } from "../../../../types/expertVerification";
import type {
  VerificationBusinessLicenseData,
  VerificationCertificateData,
} from "./types";
import { QUALIFICATION_CERTIFICATE_REQUIREMENTS } from "./verificationConstants";

interface ExpertVerificationFormValues {
  businessLicense: VerificationBusinessLicenseData;
  certificates: VerificationCertificateData[];
  qualificationType: string;
}

export function isCertificateStarted(
  certificate: VerificationCertificateData,
) {
  return Boolean(
    certificate.file ||
      certificate.fileId ||
      certificate.type.trim() ||
      certificate.number.trim() ||
      certificate.issueDate ||
      certificate.expiryDate ||
      certificate.name.trim(),
  );
}

export function validateExpertVerificationForm({
  businessLicense,
  certificates,
  qualificationType,
}: ExpertVerificationFormValues) {
  const primaryCertificate = certificates[0];
  const normalizedQualificationType = qualificationType.trim();
  const qualificationRequirement =
    QUALIFICATION_CERTIFICATE_REQUIREMENTS[normalizedQualificationType];

  if (!normalizedQualificationType) {
    return "자격 종류를 선택해주세요.";
  }

  if (!qualificationRequirement) {
    return "지원하지 않는 자격 종류입니다. 다시 선택해주세요.";
  }

  if (!primaryCertificate?.file && !primaryCertificate?.fileId) {
    return "등록증을 업로드해주세요.";
  }

  if (!businessLicense.file && !businessLicense.fileId) {
    return "사업자 등록증을 업로드해주세요.";
  }

  if (!primaryCertificate.type.trim()) {
    return "자격증 종류를 선택해주세요.";
  }

  if (!primaryCertificate.number.trim()) {
    return "등록번호를 입력해주세요.";
  }

  if (!primaryCertificate.issueDate) {
    return "발급일을 입력해주세요.";
  }

  if (!primaryCertificate.expiryDate) {
    return "유효기간을 입력해주세요.";
  }

  if (!primaryCertificate.name.trim()) {
    return "등록증 성명을 입력해주세요.";
  }

  if (!businessLicense.businessNumber.trim()) {
    return "사업자 번호를 입력해주세요.";
  }

  if (!businessLicense.name.trim()) {
    return "사업자등록증 대표자명을 입력해주세요.";
  }

  if (!businessLicense.companyName.trim()) {
    return "상호를 입력해주세요.";
  }

  const startedCertificates = certificates.filter(isCertificateStarted);
  const incompleteCertificate = certificates.find(
    (certificate) =>
      isCertificateStarted(certificate) &&
      ((!certificate.file && !certificate.fileId) ||
        !certificate.type.trim() ||
        !certificate.number.trim() ||
        !certificate.issueDate ||
        !certificate.expiryDate ||
        !certificate.name.trim()),
  );

  if (incompleteCertificate) {
    return "추가된 등록증의 필수 정보를 모두 입력해주세요.";
  }

  const matchingCertificateCount = startedCertificates.filter(
    (certificate) =>
      certificate.type.trim() === qualificationRequirement.certificateType,
  ).length;

  if (matchingCertificateCount < qualificationRequirement.minCount) {
    return qualificationRequirement.message;
  }

  return null;
}

export function buildSubmitVerificationPayload({
  businessLicense,
  certificates,
  qualificationType,
}: ExpertVerificationFormValues): SubmitExpertVerificationRequest {
  const primaryCertificate = certificates[0];

  if (!primaryCertificate) {
    throw new Error("At least one certificate is required to submit verification.");
  }

  return {
    licenseType: qualificationType,
    licenseNumber: primaryCertificate.number,
    issueDate: primaryCertificate.issueDate,
    companyName: businessLicense.companyName,
    certificates: certificates
      .filter(isCertificateStarted)
      .map((certificate) => ({
        licenseType: certificate.type,
        licenseNumber: certificate.number,
        issueDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        file: certificate.file,
        fileId: certificate.fileId,
        holderName: certificate.name || undefined,
        fileName: certificate.fileName || undefined,
      })),
    businessLicense: {
      businessNumber: businessLicense.businessNumber || undefined,
      file: businessLicense.file,
      ownerName: businessLicense.name || undefined,
      companyName: businessLicense.companyName || undefined,
      fileId: businessLicense.fileId,
      fileName: businessLicense.fileName || undefined,
    },
  };
}
