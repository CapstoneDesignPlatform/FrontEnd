export type ExpertVerificationStatus =
  | "NOT_APPLIED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface ExpertVerificationRequest {
  id: number | null;
  expertProfileId?: number;
  status: ExpertVerificationStatus;
  licenseType: string | null;
  licenseNumber: string | null;
  issueDate: string | null;
  companyName: string | null;
  portfolio?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectedReason?: string;
}

export interface ExpertCertificate {
  id: number;
  expertProfileId: number;
  certificateType: string;
  certificateNumber: string;
  issueDate: string;
  fileId?: number;
}

export interface ExpertVerificationFile {
  id: number;
  verificationRequestId: number;
  fileId: number;
  fileName: string;
  fileType: "LICENSE" | "BUSINESS_LICENSE" | "PORTFOLIO" | "ETC";
  uploadedAt: string;
}

export interface FileResource {
  id: number;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  url?: string;
}

export interface VerificationRequestDto {
  id: number | null;
  expert_profile_id?: number;
  status: ExpertVerificationStatus;
  license_type: string | null;
  license_number: string | null;
  issue_date: string | null;
  company_name: string | null;
  portfolio?: string | null;
  certificates?: VerificationCertificateDto[];
  business_license?: VerificationBusinessLicenseDto | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  rejected_reason?: string | null;
}

export interface ExpertVerificationStatusResponseDto {
  verification_request: VerificationRequestDto;
}

export interface VerificationCertificateDto {
  license_type: string;
  license_number: string;
  issue_date: string;
  holder_name?: string;
  file_id?: number;
  file_name?: string;
}

export interface VerificationBusinessLicenseDto {
  business_number?: string;
  owner_name?: string;
  company_name?: string;
  file_id?: number;
  file_name?: string;
}

export interface CreateVerificationRequestDto {
  license_type: string;
  license_number: string;
  issue_date: string;
  company_name: string;
  portfolio?: string;
  certificates?: VerificationCertificateDto[];
  business_license?: VerificationBusinessLicenseDto;
}

export type CreateVerificationResponseDto = ExpertVerificationStatusResponseDto;

export interface ExpertVerificationStatusVM {
  id: number | null;
  expertProfileId?: number;
  status: ExpertVerificationStatus;
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  companyName: string;
  portfolio?: string;
  certificates?: VerificationCertificateVM[];
  businessLicense?: VerificationBusinessLicenseVM;
  submittedAt?: string;
  reviewedAt?: string;
  rejectedReason?: string;
}

export interface VerificationCertificateVM {
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  fileId?: number;
  holderName?: string;
  fileName?: string;
}

export interface VerificationBusinessLicenseVM {
  businessNumber?: string;
  ownerName?: string;
  companyName?: string;
  fileId?: number;
  fileName?: string;
}

export interface SubmitExpertVerificationCertificate {
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  fileId?: number;
  holderName?: string;
  fileName?: string;
}

export interface SubmitExpertVerificationBusinessLicense {
  businessNumber?: string;
  ownerName?: string;
  companyName?: string;
  fileId?: number;
  fileName?: string;
}

export interface SubmitExpertVerificationRequest {
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  companyName: string;
  portfolio?: string;
  certificates?: SubmitExpertVerificationCertificate[];
  businessLicense?: SubmitExpertVerificationBusinessLicense;
}
