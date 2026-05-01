import { shouldUseMockApi } from "./apiMode";
import type { ExpertVerificationApi } from "./expertApiTypes";
import { expertVerificationHttpApi } from "./expertVerificationHttpApi";
import { expertVerificationMockApi } from "./expertVerificationMockApi";

const expertVerificationApi: ExpertVerificationApi = shouldUseMockApi
  ? expertVerificationMockApi
  : expertVerificationHttpApi;

export const {
  getExpertVerificationStatus,
  submitExpertVerification,
} = expertVerificationApi;
