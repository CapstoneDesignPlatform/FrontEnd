export const QUALIFICATION_TYPE_OPTIONS = [
  "세무사",
  "전문경영진단",
  "경영지도사(재무관리)",
];

export const CERTIFICATE_TYPE_OPTIONS = [
  "공인회계사",
  "세무사",
  "경영지도사(재무관리)",
];

export const TAX_ACCOUNTANT_CERTIFICATE_TYPE = "세무사";
export const MULTIPLE_CERTIFICATE_REQUIRED_TYPE = "전문경영진단";
export const MANAGEMENT_CONSULTANT_CERTIFICATE_TYPE =
  "경영지도사(재무관리)";

export const QUALIFICATION_CERTIFICATE_REQUIREMENTS: Record<
  string,
  {
    certificateType: string;
    helperText: string;
    message: string;
    minCount: number;
  }
> = {
  세무사: {
    certificateType: TAX_ACCOUNTANT_CERTIFICATE_TYPE,
    helperText: "세무사 등록증을 1개 이상 등록해야 합니다.",
    message: "세무사 인증에는 세무사 등록증이 1개 이상 필요합니다.",
    minCount: 1,
  },
  [MULTIPLE_CERTIFICATE_REQUIRED_TYPE]: {
    certificateType: MANAGEMENT_CONSULTANT_CERTIFICATE_TYPE,
    helperText: "전문경영진단은 경영지도사(재무관리) 등록증을 2개 이상 등록해야 합니다.",
    message: "전문경영진단 인증에는 경영지도사(재무관리) 등록증 2개 이상이 필요합니다.",
    minCount: 2,
  },
  [MANAGEMENT_CONSULTANT_CERTIFICATE_TYPE]: {
    certificateType: MANAGEMENT_CONSULTANT_CERTIFICATE_TYPE,
    helperText: "경영지도사(재무관리) 등록증을 1개 이상 등록해야 합니다.",
    message: "경영지도사(재무관리) 인증에는 경영지도사(재무관리) 등록증이 필요합니다.",
    minCount: 1,
  },
};
