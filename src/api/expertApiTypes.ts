import type {
  CreateBidRequest,
  ExpertJobDetailVM,
  ExpertJobListItemVM,
  ExpertProfileFormVM,
  ExpertSignupRequest,
  MyBidItemVM,
} from "../types/expert";
import type {
  ExpertVerificationStatus,
  ExpertVerificationStatusVM,
  SubmitExpertVerificationRequest,
} from "../types/expertVerification";

export interface ExpertApi {
  createBid(payload: CreateBidRequest): Promise<MyBidItemVM>;
  getExpertJobDetail(id: number | string): Promise<ExpertJobDetailVM>;
  getExpertJobs(): Promise<ExpertJobListItemVM[]>;
  getExpertProfile(): Promise<ExpertProfileFormVM>;
  getMyBids(): Promise<MyBidItemVM[]>;
  registerExpert(payload: ExpertSignupRequest): Promise<ExpertProfileFormVM>;
  updateExpertProfile(profile: ExpertProfileFormVM): Promise<ExpertProfileFormVM>;
}

export interface ExpertVerificationApi {
  getExpertVerificationStatus(
    statusOverride?: ExpertVerificationStatus,
  ): Promise<ExpertVerificationStatusVM>;
  submitExpertVerification(
    request: SubmitExpertVerificationRequest,
  ): Promise<ExpertVerificationStatusVM>;
}
