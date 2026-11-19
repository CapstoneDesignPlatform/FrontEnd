// 백엔드 AnnouncementCreateRequest 계약 (CapstoneDesignPlatform/BackEnd)
// - IndustryTypeEnum, AnnouncementPurposeEnum, BusinessOwnerTypeEnum 값과 일치해야 한다.
// - PurposeDependentFieldsValidator / BusinessOwnerTypeDependentFieldsValidator 규칙을 따른다.
// 현재는 건설업 의뢰만 지원한다. 다른 업종은 백엔드 계약 확정 후 추가한다.

export type BusinessStatus = "corporation" | "individual" | "startup";
export type ConstructionRegistrationStatus = "no" | "yes" | "unsure";
export type ConstructionPurpose = "construction-registration" | "survey-response" | "";
export type ConstructionRegistrationType = "new-registration" | "additional-business" | "";

export interface ConstructionAnnouncementInput {
  businessStatus: BusinessStatus;
  hasExistingBusiness: boolean | null;
  registrationStatus: ConstructionRegistrationStatus;
  constructionPurpose: ConstructionPurpose;
  registrationType: ConstructionRegistrationType;
  /** 화면에서 선택한 진단 대상 업종 이름 (예: "실내건축공사업") */
  targetBusinessLabel: string;
  /** "그 외 진단 목적" 직접 입력값 */
  otherPurpose: string;
  financial: { capital: number; capitalScale: number | null };
}

export interface AnnouncementCreatePayload {
  industry: "CONSTRUCTION";
  purpose: "REQUIRED_LICENSE" | "STATUS_INVESTIGATION" | "ETC";
  businessOwnerType: "CORPORATION" | "INDIVIDUAL" | "STARTUP";
  capital: number;
  capitalScale: number | null;
  category: "NEW" | "ADD" | null;
  requiredLicense: string | null;
  currentIndustryStatus: "CONSTRUCTION_RELATED" | "NON_CONSTRUCTION_RELATED" | "NONE" | null;
  currentIndustryDetail: string | null;
  heldLicense: string | null;
  diagnosisReason: "ETC" | null;
  diagnosisReasonDetail: string | null;
}

export const SUPPORTED_REQUEST_INDUSTRIES = new Set(["construction"]);
export const UNSUPPORTED_INDUSTRY_MESSAGE =
  "현재는 건설업 의뢰만 등록할 수 있습니다. 다른 업종은 준비 중입니다.";

const OWNER_TYPE: Record<BusinessStatus, AnnouncementCreatePayload["businessOwnerType"]> = {
  corporation: "CORPORATION",
  individual: "INDIVIDUAL",
  startup: "STARTUP",
};

function currentIndustryFor(input: ConstructionAnnouncementInput) {
  if (input.businessStatus === "startup") {
    return { status: "NONE" as const, detail: null };
  }
  if (input.registrationStatus === "yes") {
    return { status: "CONSTRUCTION_RELATED" as const, detail: "건설업 등록 보유" };
  }
  if (input.hasExistingBusiness) {
    return {
      status: "NON_CONSTRUCTION_RELATED" as const,
      detail: input.registrationStatus === "unsure"
        ? "운영 중인 사업 있음 (건설업 등록 여부 확인 필요)"
        : "건설업 외 사업 운영 중",
    };
  }
  return { status: "NONE" as const, detail: null };
}

export function buildConstructionAnnouncementPayload(
  input: ConstructionAnnouncementInput,
): AnnouncementCreatePayload {
  const target = input.targetBusinessLabel.trim();
  if (!target) throw new Error("진단 대상 업종을 선택해 주세요.");

  const base = {
    industry: "CONSTRUCTION" as const,
    businessOwnerType: OWNER_TYPE[input.businessStatus],
    capital: input.financial.capital,
    capitalScale: input.businessStatus === "startup" ? null : input.financial.capitalScale,
    category: null,
    requiredLicense: null,
    currentIndustryStatus: null,
    currentIndustryDetail: null,
    heldLicense: null,
    diagnosisReason: null,
    diagnosisReasonDetail: null,
  };

  if (input.businessStatus !== "startup" && base.capitalScale === null) {
    throw new Error("현재 총자산을 입력해 주세요.");
  }

  const otherPurpose = input.otherPurpose.trim();
  const purpose = input.businessStatus === "startup" || input.registrationStatus === "no"
    ? "construction-registration"
    : otherPurpose ? "" : input.constructionPurpose;

  if (purpose === "construction-registration") {
    const category = input.businessStatus === "startup" || input.registrationStatus === "no"
      ? "NEW"
      : input.registrationType === "new-registration"
        ? "NEW"
        : input.registrationType === "additional-business"
          ? "ADD"
          : null;
    if (!category) throw new Error("등록 구분(신규 등록/업종 추가)을 선택해 주세요.");
    const current = currentIndustryFor(input);
    return {
      ...base,
      purpose: "REQUIRED_LICENSE",
      category,
      requiredLicense: target,
      currentIndustryStatus: current.status,
      currentIndustryDetail: current.detail,
    };
  }

  if (purpose === "survey-response") {
    return { ...base, purpose: "STATUS_INVESTIGATION", heldLicense: target };
  }

  if (otherPurpose) {
    return {
      ...base,
      purpose: "ETC",
      diagnosisReason: "ETC",
      diagnosisReasonDetail: `${otherPurpose} (진단 대상 업종: ${target})`,
    };
  }

  throw new Error("진단 목적을 선택하거나 그 외 진단 목적을 입력해 주세요.");
}
