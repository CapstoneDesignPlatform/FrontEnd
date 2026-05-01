import { shouldUseMockApi } from "./apiMode";
import type { ExpertApi } from "./expertApiTypes";
import { expertHttpApi } from "./expertHttpApi";
import { expertMockApi } from "./expertMockApi";

const expertApi: ExpertApi = shouldUseMockApi ? expertMockApi : expertHttpApi;

export const {
  createBid,
  getExpertJobDetail,
  getExpertJobs,
  getExpertProfile,
  getMyBids,
  registerExpert,
  updateExpertProfile,
} = expertApi;
