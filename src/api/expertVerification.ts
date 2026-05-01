import { expertVerificationHttpApi } from "./expertVerificationHttpApi";
import { expertVerificationMockApi } from "./expertVerificationMockApi";

const expertVerificationApi = expertVerificationMockApi; 

export const {
  getExpertVerificationStatus,
  submitExpertVerification,
} = expertVerificationApi;