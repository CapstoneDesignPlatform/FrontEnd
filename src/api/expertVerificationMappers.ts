import type {
  CreateVerificationRequestDto,
  ExpertVerificationStatus,
  ExpertVerificationStatusResponseDto,
  ExpertVerificationStatusVM,
  SubmitExpertVerificationRequest,
  VerificationBusinessLicenseDto,
  VerificationBusinessLicenseVM,
  VerificationCertificateDto,
  VerificationCertificateVM,
} from "../types/expertVerification";

const managementConsultantFrontendLabel = "경영지도사(재무관리)";
const managementConsultantBackendLabel = "경영지도사";

function mapBackendCertificateName(value: string | undefined) {
  return value === managementConsultantBackendLabel
    ? managementConsultantFrontendLabel
    : value;
}

function mapVerificationCertificateDtoToVM(
  certificate: VerificationCertificateDto,
): VerificationCertificateVM {
  const licenseType = mapBackendCertificateName(certificate.certificate_name);
  const issueDate = certificate.issue_date ?? "";
  const expiryDate = certificate.expiry_date ?? certificate.expired_at ?? "";

  return {
    id: certificate.id,
    existing: true,
    licenseType: licenseType ?? "",
    licenseNumber: certificate.license_number ?? certificate.certificate_number ?? "",
    issueDate,
    expiryDate,
    fileId: certificate.file_id,
    holderName: certificate.holder_name ?? certificate.owner_name,
    fileName: certificate.file_name ?? certificate.original_name,
  };
}

function mapVerificationBusinessLicenseDtoToVM(
  businessLicense: VerificationBusinessLicenseDto,
): VerificationBusinessLicenseVM {
  return {
    id: businessLicense.id,
    existing: true,
    businessNumber: businessLicense.business_number,
    ownerName: businessLicense.owner_name ?? businessLicense.representative_name,
    companyName: businessLicense.company_name,
    fileId: businessLicense.file_id,
    fileName: businessLicense.file_name ?? businessLicense.original_name,
  };
}

function mapBackendVerificationStatus(
  request: ExpertVerificationStatusResponseDto["verification_request"],
): ExpertVerificationStatus {
  const status = request.verification_status ?? request.status;
  if (status === "NOT_SUBMITTED") return "NOT_APPLIED";
  if (["NOT_APPLIED", "PENDING", "APPROVED", "REJECTED"].includes(String(status))) {
    return status as ExpertVerificationStatus;
  }
  if (status === true) return "APPROVED";
  // Legacy false does not distinguish pending from rejected. Do not invent a status.
  if (status === false && !request.id && !request.rejected_reason) return "NOT_APPLIED";
  throw new Error("인증 상태를 정확히 확인할 수 없습니다. 서버의 verification_status 응답을 확인해 주세요.");

}

export function mapVerificationStatusDtoToVM(
  dto: ExpertVerificationStatusResponseDto,
): ExpertVerificationStatusVM {
  const request = dto.verification_request;
  const businessLicense =
    request.business_license ?? request.business_registration_info;

  return {
    id: request.id,
    expertProfileId: request.expert_profile_id,
    status: mapBackendVerificationStatus(request),
    licenseType: request.specialty ?? "",
    licenseNumber: request.license_number ?? "",
    issueDate: request.issue_date ?? "",
    companyName: request.company_name ?? "",
    certificates: request.certificates?.map(mapVerificationCertificateDtoToVM),
    businessLicense: businessLicense
      ? mapVerificationBusinessLicenseDtoToVM(businessLicense)
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
    specialty: payload.licenseType,
  };
}
