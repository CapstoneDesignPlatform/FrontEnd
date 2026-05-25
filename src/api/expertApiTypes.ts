import type {
  CreateBidRequest,
  ExpertJobDetailVM,
  ExpertJobListQuery,
  ExpertJobListResultVM,
  ExpertProfileFormVM,
  ExpertSignupResultVM,
  ExpertSignupRequest,
  MyBidItemVM,
  UpdateBidRequest,
} from "../types/expert";
import type {
  ExpertVerificationStatus,
  ExpertVerificationStatusVM,
  SubmitExpertVerificationRequest,
} from "../types/expertVerification";

export interface ExpertApi {
  createBid(payload: CreateBidRequest): Promise<MyBidItemVM>;
  getExpertJobDetail(id: number | string): Promise<ExpertJobDetailVM>;
  getExpertJobs(query?: ExpertJobListQuery): Promise<ExpertJobListResultVM>;
  getExpertProfile(): Promise<ExpertProfileFormVM>;
  getMyBids(): Promise<MyBidItemVM[]>;
  registerExpert(payload: ExpertSignupRequest): Promise<ExpertSignupResultVM>;
  updateBid(payload: UpdateBidRequest): Promise<MyBidItemVM>;
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
