export type ExpertVerificationStatus =
  | "NOT_APPLIED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type ExpertVerificationStatusDto =
  | ExpertVerificationStatus
  | "NOT_SUBMITTED"
  | boolean;

export interface ExpertVerificationRequest {
  id: number | null;
  expertProfileId?: number;
  status: ExpertVerificationStatus;
  licenseType: string | null;
  licenseNumber: string | null;
  issueDate: string | null;
  companyName: string | null;
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
  fileType: "LICENSE" | "BUSINESS_LICENSE" | "ETC";
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

export type VerificationFilePurpose = "CERTIFICATE" | "BUSINESS_REGISTRATION";

export interface UploadedFileDto {
  id: number;
  original_name: string;
  stored_name: string;
  mime_type: string;
  size: number;
  purpose: VerificationFilePurpose;
  created_at: string;
}

export interface UploadFileResponseDto {
  file: UploadedFileDto;
}

export interface RegisterCertificateRequestDto {
  certificate_name: string;
  certificate_number: string;
  expiry_date: string;
  issue_date: string;
  owner_name?: string;
  file_id: number;
}

export interface RegisterCertificateResponseDto {
  id: number;
  file_id: number;
  certificate_name: string;
  certificate_type_code: string;
  certificate_number: string;
  issue_date: string;
  expiry_date: string;
  expired_at: string | null;
  owner_name: string | null;
}

export interface RegisterBusinessRegistrationRequestDto {
  file_id: number;
  business_number?: string;
  representative_name?: string;
  company_name?: string;
}

export interface RegisterBusinessRegistrationResponseDto {
  id: number;
  file_id: number;
  business_number: string | null;
  representative_name: string | null;
  company_name: string | null;
}

export interface VerificationRequestDto {
  id: number | null;
  expert_profile_id?: number;
  status: ExpertVerificationStatusDto;
  specialty?: string | null;
  license_number?: string | null;
  issue_date?: string | null;
  company_name?: string | null;
  certificates?: VerificationCertificateDto[];
  business_license?: VerificationBusinessLicenseDto | null;
  business_registration_info?: VerificationBusinessLicenseDto | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  rejected_reason?: string | null;
}

export interface ExpertVerificationStatusResponseDto {
  verification_request: VerificationRequestDto;
}

export interface VerificationCertificateDto {
  license_number?: string;
  certificate_name?: string;
  certificate_number?: string;
  issue_date?: string;
  expiry_date?: string | null;
  expired_at?: string | null;
  holder_name?: string;
  owner_name?: string;
  file_id?: number;
  file_name?: string;
  original_name?: string;
}

export interface VerificationBusinessLicenseDto {
  business_number?: string;
  owner_name?: string;
  representative_name?: string;
  company_name?: string;
  file_id?: number;
  file_name?: string;
  original_name?: string;
}

export interface CreateVerificationRequestDto {
  specialty: string;
}

export interface ExpertVerificationStatusVM {
  id: number | null;
  expertProfileId?: number;
  status: ExpertVerificationStatus;
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  companyName: string;
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
  expiryDate: string;
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
  expiryDate: string;
  file?: File | null;
  fileId?: number;
  holderName?: string;
  fileName?: string;
}

export interface SubmitExpertVerificationBusinessLicense {
  businessNumber?: string;
  file?: File | null;
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
  certificates?: SubmitExpertVerificationCertificate[];
  businessLicense?: SubmitExpertVerificationBusinessLicense;
}
