import type { VerificationPreviewKind } from "./filePreview";

export interface VerificationCertificateData {
  id: string;
  type: string;
  number: string;
  issueDate: string;
  expiryDate: string;
  name: string;
  file: File | null;
  fileId?: number;
  fileName: string;
  previewKind: VerificationPreviewKind | null;
  previewUrl: string;
}

export interface VerificationBusinessLicenseData {
  businessNumber: string;
  name: string;
  companyName: string;
  file: File | null;
  fileId?: number;
  fileName: string;
  previewKind: VerificationPreviewKind | null;
  previewUrl: string;
}
