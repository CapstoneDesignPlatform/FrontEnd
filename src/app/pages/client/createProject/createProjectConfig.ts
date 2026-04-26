import type {
  BaseProjectFormData,
  ConstructionLicenseData,
  ConstructionOtherData,
  ConstructionSurveyData,
  ElectricalPeriodicData,
  ProjectTab,
} from "./types";

export const industryLabels: Record<string, string> = {
  construction: "건설업",
  electrical: "전기공사업",
  information: "정보통신공사업",
  fire: "소방시설공사업",
  pharmaceutical: "의약품도매상",
  other: "기타",
};

export const industries = [
  { label: "건설업", value: "construction" },
  { label: "전기공사업", value: "electrical" },
  { label: "정보통신공사업", value: "information" },
  { label: "소방시설공사업", value: "fire" },
  { label: "의약품도매상", value: "pharmaceutical" },
  { label: "기타", value: "other" },
];

export const supportedDetailIndustries = new Set(Object.keys(industryLabels));

export const projectTabLabels: Record<ProjectTab, string> = {
  license: "필요 면허",
  periodic: "주기적 신고",
  survey: "실태 조사",
  other: "기타",
};

export const tabGuides: Record<ProjectTab, { title: string; items: string[] }> = {
  license: {
    title: "필요 면허 공고 가이드",
    items: [
      "사업자 유형과 신규/추가 여부를 정확히 선택해주세요",
      "필요한 면허의 정확한 명칭과 종류를 기재해주세요",
      "현재 운영 중인 업종이 있다면 상세히 입력해주세요",
      "자산 규모는 면허 심사에 중요한 요소이므로 정확히 입력해주세요",
    ],
  },
  periodic: {
    title: "주기적 신고 공고 가이드",
    items: [
      "사업자 유형을 정확히 선택해주세요",
      "자산 규모를 정확히 입력해주세요",
    ],
  },
  survey: {
    title: "실태 조사 공고 가이드",
    items: [
      "사업자 유형을 정확히 선택해주세요",
      "현재 보유하고 있는 면허를 정확히 입력해주세요",
      "자산 규모는 실태 조사에 필요한 정보이므로 정확히 입력해주세요",
    ],
  },
  other: {
    title: "기타 서비스 공고 가이드",
    items: [
      "사업자 유형을 정확히 선택해주세요",
      "진단이 필요한 사유를 선택해주세요 (자본금 변동, 양도, 합병)",
      "자산 규모를 정확히 입력해주세요",
    ],
  },
};

export const initialBaseProjectFormData: BaseProjectFormData = {
  title: "",
  description: "",
  budget: "",
  deadline: "",
  requirements: "",
  location: "",
};

export const initialConstructionLicenseData: ConstructionLicenseData = {
  businessType: "corporation",
  classification: "new",
  requiredLicense: "",
  currentIndustryType: "none",
  currentIndustryDetail: "",
  assetScale: "",
};

export const initialConstructionSurveyData: ConstructionSurveyData = {
  businessType: "corporation",
  currentLicense: "",
  assetScale: "",
};

export const initialConstructionOtherData: ConstructionOtherData = {
  businessType: "corporation",
  reason: "capital",
  assetScale: "",
};

export const initialElectricalPeriodicData: ElectricalPeriodicData = {
  businessType: "corporation",
  assetScale: "",
};

export function getVisibleTabs(industry: string): ProjectTab[] {
  return industry === "electrical"
    ? ["license", "periodic", "survey", "other"]
    : ["license", "survey", "other"];
}

export function isSupportedDetailIndustry(industry: string) {
  return supportedDetailIndustries.has(industry);
}
