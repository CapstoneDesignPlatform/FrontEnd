import type { ExpertVerificationStatus } from "./expertVerification";

export type { ExpertVerificationStatus } from "./expertVerification";

export type JobPostTypeCode = "LICENSE" | "SURVEY" | "PERIODIC_REPORT" | "ETC";

export type JobPostTypeLabel = "필요 면허" | "실태 조사" | "주기적 신고" | "기타";

export type JobPostType = JobPostTypeLabel;

export type JobPostStatusCode =
  | "ACTIVE"
  | "CANCELLED"
  | "CLOSED"
  | "BIDDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export type BidStatusCode = "PENDING" | "SELECTED" | "REJECTED";

export type BidStatusLabel = "대기 중" | "선정됨" | "거절됨";

export type JobPostSort = "posted_at_desc" | "posted_at_asc";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "CLIENT" | "EXPERT" | "ADMIN";
}

export interface ExpertProfile {
  id: number;
  userId: number;
  companyName: string;
  isVerified: boolean;
  verificationStatus: ExpertVerificationStatus;
}

export interface Company {
  id: number;
  name: string;
  representative: string;
  location?: string;
}

export interface JobPost {
  id: number;
  companyId: number;
  title: string;
  industry: string;
  jobType: JobPostType;
  businessType: string;
  classification?: string;
  requiredLicense?: string;
  currentIndustry?: string;
  currentLicense?: string;
  reason?: string;
  assetScale?: string;
  bidCount: number;
  status: JobPostStatusCode;
  createdAt: string;
}

export interface Bid {
  id: number;
  jobPostId: number;
  expertProfileId: number;
  bidAmount: number;
  message: string;
  status: BidStatusCode;
  createdAt: string;
  clientContact?: ClientContactVM;
}

export interface ExpertProfileStatsDto {
  active_bids: number;
  selected_count?: number;
  won_projects?: number;
  completed_projects: number;
  total_earned: number;
  total_earned_label?: string;
}

export interface UserSummaryDto {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export interface ExpertProfileResponseDto {
  user: UserSummaryDto;
  expert_profile: {
    id: number;
    user_id: number;
    company_name: string;
    verification_status?: ExpertVerificationStatus;
    is_verified: boolean;
    stats: ExpertProfileStatsDto;
  };
}

export interface UpdateExpertProfileRequestDto {
  name?: string;
  phone?: string;
  company_name?: string;
}

export type ExpertProfileResponseUpdateDto = ExpertProfileResponseDto;

export interface JobPostListItemDto {
  id: number;
  announcement_code: string;
  company_id: number | null;
  company_name: string | null;
  title: string;
  industry: string;
  job_type: JobPostTypeCode;
  job_type_label?: JobPostTypeLabel;
  business_type: string | null;
  classification?: string | null;
  required_license?: string | null;
  current_industry?: string | null;
  current_license?: string | null;
  reason?: string | null;
  asset_scale_label?: number | string | null;
  capital?: number | string | null;
  capital_scale?: number | string | null;
  bid_count: number;
  posted_at: string;
  deadline?: string | null;
  due_date?: string | null;
  job_post_deadline?: string | null;
  is_new: boolean;
  status?: JobPostStatusCode | null;
  has_my_bid?: boolean;
}

export interface JobPostListResponseDto {
  items: JobPostListItemDto[];
  page?: number;
  size?: number;
  total_count?: number;
  total_pages?: number;
  has_next?: boolean;
}

export interface CompanySummaryDto {
  id: number;
  name: string;
  representative: string | null;
  location?: string | null;
}

export interface JobPostDetailResponseDto extends JobPostListItemDto {
  created_at: string;
  company: CompanySummaryDto;
  my_bid?: MyBidSummaryDto | null;
}

export interface CreateBidRequestDto {
  bid_amount: number;
}

export interface MyBidSummaryDto {
  id: number;
  bid_amount: number;
  status: BidStatusCode;
  submitted_at: string;
}

export interface ClientContactDto {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface MyBidItemDto {
  id: number;
  announcement_id?: number;
  announcement_code?: string;
  job_post_id?: number;
  job_post_title: string;
  bid_amount: number;
  status: BidStatusCode;
  submitted_at: string;
  deadline?: string | null;
  due_date?: string | null;
  job_post_deadline?: string | null;
  total_bid_count: number;
  client_contact: ClientContactDto | null;
}

export interface CreateBidResponseDto {
  id: number;
  announcement_code: string;
  bid_amount: number;
  status: BidStatusCode;
  submitted_at: string;
  total_bid_count: number;
}

export interface MyBidsResponseDto {
  items: MyBidItemDto[];
  page?: number;
  size?: number;
  total_count?: number;
  total_pages?: number;
  has_next?: boolean;
}

export interface ExpertSignupRequestDto {
  userType: "EXPERT";
  name: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
}

export interface ExpertSignupResponseDto {
  accessToken?: string | null;
  access_token?: string | null;
  expert_profile?: ExpertProfileResponseDto["expert_profile"];
  loginRequired?: boolean;
  login_required?: boolean;
  refreshToken?: string | null;
  refresh_token?: string | null;
  user?: UserSummaryDto;
}

export interface CompanySummaryVM {
  id: number;
  name: string;
  representative: string | null;
  location?: string | null;
}

export interface ExpertJobListItemVM {
  id: number;
  announcementCode: string;
  companyName?: string;
  title: string;
  industry: string;
  typeCode: JobPostTypeCode;
  type: JobPostType;
  businessType?: string;
  classification?: string;
  requiredLicense?: string;
  currentIndustry?: string;
  currentLicense?: string;
  reason?: string;
  assetScale?: string;
  bids: number;
  postedDate: string;
  deadline?: string;
  isNew: boolean;
  status?: string;
  hasMyBid?: boolean;
}

export interface ExpertJobListQuery {
  page?: number;
  size?: number;
  sort?: JobPostSort;
}

export interface ExpertJobListResultVM {
  hasNext: boolean;
  items: ExpertJobListItemVM[];
  page: number;
  size: number;
  totalCount: number;
  totalPages: number;
}

export interface ExpertJobDetailVM extends ExpertJobListItemVM {
  createdAt: string;
  company: CompanySummaryVM;
  myBid?: ExpertJobMyBidVM;
}

export interface ExpertJobMyBidVM {
  amount: number;
  id: number;
  status: BidStatusLabel;
  submittedAt: string;
}

export interface MyBidItemVM {
  id: number;
  projectId: number;
  announcementCode?: string;
  projectTitle: string;
  myBid: string;
  status: BidStatusLabel;
  bidDate: string;
  deadline?: string;
  totalBids: number;
  clientContact?: ClientContactVM;
}

export interface ClientContactVM {
  copyText: string;
  displayText: string;
  email?: string;
  name?: string;
  phone?: string;
}

export interface ExpertProfileFormVM {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  verificationStatus: ExpertVerificationStatus;
  stats: {
    activeBids: number;
    wonProjects: number;
    completedProjects: number;
    totalEarned: string;
  };
}

export interface CreateBidRequest {
  announcementCode: string;
  price: number;
}

export type UpdateBidRequest = CreateBidRequest;

export interface ExpertSignupRequest {
  companyName: string;
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface ExpertSignupResultVM {
  hasAccessToken: boolean;
  loginRequired: boolean;
  profile: ExpertProfileFormVM;
}
