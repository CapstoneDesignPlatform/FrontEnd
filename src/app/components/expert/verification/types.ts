export interface VerificationCertificateData {
  id: string;
  type: string;
  number: string;
  issueDate: string;
  name: string;
  file: File | null;
  previewUrl: string;
}

export interface VerificationBusinessLicenseData {
  businessNumber: string;
  name: string;
  companyName: string;
  file: File | null;
  previewUrl: string;
}

export interface VerificationCareerData {
  companyName: string;
  portfolio: string;
}
