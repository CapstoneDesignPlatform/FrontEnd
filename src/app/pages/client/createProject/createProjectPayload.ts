import type { JobPostType } from "../../../../types/expert";
import { industryLabels } from "./createProjectConfig";
import type {
  BaseProjectFormData,
  BusinessType,
  ConstructionLicenseData,
  ConstructionOtherData,
  ConstructionSurveyData,
  CurrentIndustryType,
  DiagnosisReason,
  ElectricalPeriodicData,
  LicenseBusinessType,
  ProjectClassification,
  ProjectTab,
} from "./types";

const tabJobTypes: Record<ProjectTab, JobPostType> = {
  license: "필요 면허",
  periodic: "주기적 신고",
  survey: "실태 조사",
  other: "기타",
};

interface CreateProjectBasePayload {
  budget?: number;
  deadline?: string;
  description?: string;
  location?: string;
  requirements?: string;
  title?: string;
}

export type CreateProjectDetailPayload =
  | {
      assetScale?: number;
      businessType: LicenseBusinessType;
      classification: ProjectClassification;
      currentIndustry?: string;
      currentIndustryType: CurrentIndustryType;
      requiredLicense: string;
      type: "license";
    }
  | {
      assetScale?: number;
      businessType: BusinessType;
      type: "periodic";
    }
  | {
      assetScale?: number;
      businessType: BusinessType;
      currentLicense: string;
      type: "survey";
    }
  | {
      assetScale?: number;
      businessType: BusinessType;
      reason: DiagnosisReason;
      type: "other";
    }
  | {
      type: "base";
    };

export interface CreateProjectPayload {
  base: CreateProjectBasePayload;
  detail: CreateProjectDetailPayload;
  industry: string;
  industryLabel: string;
  jobType: JobPostType;
}

export interface BuildCreateProjectPayloadInput {
  activeTab: ProjectTab;
  constructionLicenseData: ConstructionLicenseData;
  constructionOtherData: ConstructionOtherData;
  constructionSurveyData: ConstructionSurveyData;
  electricalPeriodicData: ElectricalPeriodicData;
  formData: BaseProjectFormData;
  industry: string;
}

function cleanText(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

function parseOptionalNumber(value: string) {
  if (!value.trim()) return undefined;

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function buildBasePayload(formData: BaseProjectFormData): CreateProjectBasePayload {
  return {
    budget: parseOptionalNumber(formData.budget),
    deadline: cleanText(formData.deadline),
    description: cleanText(formData.description),
    location: cleanText(formData.location),
    requirements: cleanText(formData.requirements),
    title: cleanText(formData.title),
  };
}

function buildLicenseDetailPayload(
  data: ConstructionLicenseData,
): CreateProjectDetailPayload {
  return {
    assetScale: parseOptionalNumber(data.assetScale),
    businessType: data.businessType,
    classification: data.classification,
    currentIndustry:
      data.currentIndustryType === "none"
        ? undefined
        : cleanText(data.currentIndustryDetail),
    currentIndustryType: data.currentIndustryType,
    requiredLicense: data.requiredLicense.trim(),
    type: "license",
  };
}

function buildPeriodicDetailPayload(
  data: ElectricalPeriodicData,
): CreateProjectDetailPayload {
  return {
    assetScale: parseOptionalNumber(data.assetScale),
    businessType: data.businessType,
    type: "periodic",
  };
}

function buildSurveyDetailPayload(
  data: ConstructionSurveyData,
): CreateProjectDetailPayload {
  return {
    assetScale: parseOptionalNumber(data.assetScale),
    businessType: data.businessType,
    currentLicense: data.currentLicense.trim(),
    type: "survey",
  };
}

function buildOtherDetailPayload(
  data: ConstructionOtherData,
): CreateProjectDetailPayload {
  return {
    assetScale: parseOptionalNumber(data.assetScale),
    businessType: data.businessType,
    reason: data.reason,
    type: "other",
  };
}

function buildDetailPayload({
  activeTab,
  constructionLicenseData,
  constructionOtherData,
  constructionSurveyData,
  electricalPeriodicData,
}: BuildCreateProjectPayloadInput): CreateProjectDetailPayload {
  switch (activeTab) {
    case "license":
      return buildLicenseDetailPayload(constructionLicenseData);
    case "periodic":
      return buildPeriodicDetailPayload(electricalPeriodicData);
    case "survey":
      return buildSurveyDetailPayload(constructionSurveyData);
    case "other":
      return buildOtherDetailPayload(constructionOtherData);
    default:
      return { type: "base" };
  }
}

export function buildCreateProjectPayload(
  input: BuildCreateProjectPayloadInput,
): CreateProjectPayload {
  return {
    base: buildBasePayload(input.formData),
    detail: buildDetailPayload(input),
    industry: input.industry,
    industryLabel: industryLabels[input.industry] ?? input.industry,
    jobType: tabJobTypes[input.activeTab],
  };
}
