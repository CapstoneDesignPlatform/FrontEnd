import type {
  CreateVerificationRequestDto,
  ExpertVerificationStatusResponseDto,
  ExpertVerificationStatusVM,
  SubmitExpertVerificationRequest,
  VerificationBusinessLicenseDto,
  VerificationBusinessLicenseVM,
  VerificationCertificateDto,
  VerificationCertificateVM,
} from "../types/expertVerification";

function mapVerificationCertificateDtoToVM(
  certificate: VerificationCertificateDto,
): VerificationCertificateVM {
  return {
    licenseType: certificate.license_type,
    licenseNumber: certificate.license_number,
    issueDate: certificate.issue_date,
    fileId: certificate.file_id,
    holderName: certificate.holder_name,
    fileName: certificate.file_name,
  };
}

function mapVerificationBusinessLicenseDtoToVM(
  businessLicense: VerificationBusinessLicenseDto,
): VerificationBusinessLicenseVM {
  return {
    businessNumber: businessLicense.business_number,
    ownerName: businessLicense.owner_name,
    companyName: businessLicense.company_name,
    fileId: businessLicense.file_id,
    fileName: businessLicense.file_name,
  };
}

function mapSubmitCertificateToDto(
  certificate: NonNullable<SubmitExpertVerificationRequest["certificates"]>[number],
): VerificationCertificateDto {
  return {
    license_type: certificate.licenseType,
    license_number: certificate.licenseNumber,
    issue_date: certificate.issueDate,
    file_id: certificate.fileId,
    holder_name: certificate.holderName,
    file_name: certificate.fileName,
  };
}

function mapSubmitBusinessLicenseToDto(
  businessLicense: NonNullable<SubmitExpertVerificationRequest["businessLicense"]>,
): VerificationBusinessLicenseDto {
  return {
    business_number: businessLicense.businessNumber,
    owner_name: businessLicense.ownerName,
    company_name: businessLicense.companyName,
    file_id: businessLicense.fileId,
    file_name: businessLicense.fileName,
  };
}

export function mapVerificationStatusDtoToVM(
  dto: ExpertVerificationStatusResponseDto,
): ExpertVerificationStatusVM {
  const request = dto.verification_request;

  return {
    id: request.id,
    expertProfileId: request.expert_profile_id,
    status: request.status,
    licenseType: request.license_type ?? "",
    licenseNumber: request.license_number ?? "",
    issueDate: request.issue_date ?? "",
    companyName: request.company_name ?? "",
    portfolio: request.portfolio ?? undefined,
    certificates: request.certificates?.map(mapVerificationCertificateDtoToVM),
    businessLicense: request.business_license
      ? mapVerificationBusinessLicenseDtoToVM(request.business_license)
      : undefined,
    submittedAt: request.submitted_at ?? undefined,
    reviewedAt: request.reviewed_at ?? undefined,
    rejectedReason: request.rejected_reason ?? undefined,
  };
}

export function mapSubmitVerificationRequestToDto(
  payload: SubmitExpertVerificationRequest,
): CreateVerificationRequestDto {
  return {
    license_type: payload.licenseType,
    license_number: payload.licenseNumber,
    issue_date: payload.issueDate,
    company_name: payload.companyName,
    portfolio: payload.portfolio,
    certificates: payload.certificates?.map(mapSubmitCertificateToDto),
    business_license: payload.businessLicense
      ? mapSubmitBusinessLicenseToDto(payload.businessLicense)
      : undefined,
  };
}
