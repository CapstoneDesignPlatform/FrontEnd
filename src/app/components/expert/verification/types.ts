import type { VerificationPreviewKind } from "./filePreview";

export interface VerificationCertificateData {
  serverId?: number;
  existing?: boolean;
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
  serverId?: number;
  existing?: boolean;
  businessNumber: string;
  name: string;
  companyName: string;
  file: File | null;
  fileId?: number;
  fileName: string;
  previewKind: VerificationPreviewKind | null;
  previewUrl: string;
}
