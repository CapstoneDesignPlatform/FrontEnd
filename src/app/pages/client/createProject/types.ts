export type ProjectTab = "license" | "periodic" | "survey" | "other";

export type BusinessType = "corporation" | "individual";

export type LicenseBusinessType = BusinessType | "startup";

export type ProjectClassification = "new" | "additional";

export type CurrentIndustryType = "construction" | "nonConstruction" | "none";

export type DiagnosisReason = "capital" | "transfer" | "merger" | "other_manual";

export interface BaseProjectFormData {
  title: string;
  description: string;
  budget: string;
  deadline: string;
  requirements: string;
  location: string;
}

export interface ConstructionLicenseData {
  businessType: LicenseBusinessType;
  classification: ProjectClassification;
  requiredLicense: string;
  currentIndustryType: CurrentIndustryType;
  currentIndustryDetail: string;
  assetScale: string;
}

export interface ConstructionSurveyData {
  businessType: BusinessType;
  currentLicense: string;
  assetScale: string;
}

export interface ConstructionOtherData {
  businessType: BusinessType;
  reason: DiagnosisReason;
  assetScale: string;
}

export interface ElectricalPeriodicData {
  businessType: BusinessType;
  assetScale: string;
}
