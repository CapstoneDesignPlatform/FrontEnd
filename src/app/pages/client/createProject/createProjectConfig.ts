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
  { label: "건설", value: "construction" },
  { label: "전기공사", value: "electrical" },
  { label: "정보통신", value: "information" },
  { label: "소방", value: "fire" },
  { label: "산림", value: "forestry" },
  { label: "의약품", value: "pharmaceutical" },
  { label: "국가유산", value: "national-heritage" },
  { label: "기타", value: "other" },
];

export const generalConstructionBusinesses = [
  { label: "토목공사업", value: "civil-engineering", keywords: [] },
  { label: "건축공사업", value: "architecture", keywords: [] },
  { label: "토목건축공사업", value: "civil-architecture", keywords: [] },
  { label: "산업환경설비공사업", value: "industrial-environment", keywords: [] },
  { label: "조경공사업", value: "landscaping", keywords: [] },
];

export const specialtyConstructionBusinesses = [
  { label: "지반조성·포장공사업", value: "ground-paving", keywords: [] },
  { label: "실내건축공사업", value: "interior-architecture", keywords: ["인테리어", "실내"] },
  { label: "금속·창호·지붕·건축물조립공사업", value: "metal-window-roof-assembly", keywords: ["창호"] },
  { label: "도장·습식·방수·석공사업", value: "painting-waterproof-stone", keywords: [] },
  { label: "조경식재·시설물공사업", value: "landscape-planting-facilities", keywords: [] },
  { label: "철근·콘크리트공사업", value: "reinforced-concrete", keywords: ["철콘", "철근"] },
  { label: "구조물해체·비계공사업", value: "structure-demolition-scaffolding", keywords: ["철거", "해체"] },
  { label: "상·하수도설비공사업", value: "water-sewage-equipment", keywords: ["상수도", "하수도", "상하수도"] },
  { label: "철도·궤도공사업", value: "railway-track", keywords: [] },
  { label: "철강구조물공사업", value: "steel-structure", keywords: [] },
  { label: "수중·준설공사업", value: "underwater-dredging", keywords: [] },
  { label: "승강기·삭도공사업", value: "elevator-cableway", keywords: [] },
  { label: "기계설비·가스공사업", value: "mechanical-gas", keywords: [] },
  { label: "가스·난방공사업", value: "gas-heating", keywords: [] },
];

export const supportedDetailIndustries = new Set(Object.keys(industryLabels));

export const projectTabLabels: Record<ProjectTab, string> = {
  license: "필요 면허",
  periodic: "주기적 신고",
  survey: "실태 조사",
  other: "기타",
};

export const fieldGuides: Record<string, { title: string; items: string[] }> = {
  industry: {
    title: "업종 선택",
    items: ["진단이 필요한 업종을 선택해 주세요."],
  },
  purpose: {
    title: "목적 선택",
    items: ["의뢰를 맡기실 목적을 선택해주세요"],
  },
  businessType: {
    title: "현재 사업 상태",
    items: ["현재 사업 상태를 선택해 주세요."],
  },
  
};

export const tabGuides: Record<ProjectTab, { title: string; items: string[] }> = {
  license: {
    title: "필요 면허 의뢰 가이드",
    items: [
      "사업자 유형과 신규/추가 여부를 정확히 선택해주세요",
      "필요한 면허의 정확한 명칭과 종류를 기재해주세요",
      "현재 운영 중인 업종이 있다면 상세히 입력해주세요",
      "자산 규모는 면허 심사에 중요한 요소이므로 정확히 입력해주세요",
    ],
  },
  periodic: {
    title: "주기적 신고 의뢰 가이드",
    items: [
      "사업자 유형을 정확히 선택해주세요",
      "자산 규모를 정확히 입력해주세요",
    ],
  },
  survey: {
    title: "실태 조사 의뢰 가이드",
    items: [
      "사업자 유형을 정확히 선택해주세요",
      "현재 보유하고 있는 면허를 정확히 입력해주세요",
      "자산 규모는 실태 조사에 필요한 정보이므로 정확히 입력해주세요",
    ],
  },
  other: {
    title: "기타 서비스 의뢰 가이드",
    items: [
      "현재 사업 상태를 정확히 선택해 주세요.",
      "현재 자본금과 총자산 금액을 정확히 입력해 주세요.",
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
  capitalScale: "",
};

export const initialConstructionSurveyData: ConstructionSurveyData = {
  businessType: "corporation",
  currentLicense: "",
  assetScale: "",
  capitalScale: "",
};

export const initialConstructionOtherData: ConstructionOtherData = {
  businessType: "corporation",
  reason: "capital",
  assetScale: "",
  capitalScale: "",
};

export const initialElectricalPeriodicData: ElectricalPeriodicData = {
  businessType: "corporation",
  assetScale: "",
  capitalScale: "",
};

export function getVisibleTabs(industry: string): ProjectTab[] {
  return industry === "electrical"
    ? ["license", "periodic", "survey", "other"]
    : ["license", "survey", "other"];
}

export function isSupportedDetailIndustry(industry: string) {
  return supportedDetailIndustries.has(industry);
}
