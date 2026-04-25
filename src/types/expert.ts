export type ExpertVerificationStatus =
  | "NOT_APPLIED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type JobPostType = "필요 면허" | "실태 조사" | "주기적 신고" | "기타";

export type JobPostStatusCode = "BIDDING" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";

export type BidStatusCode = "PENDING" | "SELECTED" | "REJECTED";

export type BidStatusLabel = "대기 중" | "선정됨" | "거절됨";

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
  licenseType: string;
  licenseNumber: string;
  expertiseAreas: string[];
  experienceYears: number;
  education?: string;
  introduction: string;
  portfolio?: string;
  isVerified: boolean;
  verificationStatus: ExpertVerificationStatus;
}

export interface ExpertVerificationRequest {
  id: number;
  expertProfileId: number;
  status: ExpertVerificationStatus;
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  companyName: string;
  portfolio?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectedReason?: string;
}

export interface ExpertCertificate {
  id: number;
  expertProfileId: number;
  certificateType: string;
  certificateNumber: string;
  issueDate: string;
  fileId?: number;
}

export interface ExpertVerificationFile {
  id: number;
  verificationRequestId: number;
  fileId: number;
  fileName: string;
  fileType: "LICENSE" | "BUSINESS_LICENSE" | "PORTFOLIO" | "ETC";
  uploadedAt: string;
}

export interface FileResource {
  id: number;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  url: string;
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
  clientContact?: string;
}

export interface ExpertProfileStatsDto {
  active_bids: number;
  won_projects: number;
  completed_projects: number;
  total_earned_label: string;
}

export interface UserSummaryDto {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface ExpertProfileResponseDto {
  user: UserSummaryDto;
  expert_profile: {
    id: number;
    user_id: number;
    company_name: string;
    license_type: string;
    license_number: string;
    expertise_areas: string[];
    experience_years: number;
    education?: string;
    introduction: string;
    portfolio?: string;
    verification_status: ExpertVerificationStatus;
    is_verified: boolean;
    stats: ExpertProfileStatsDto;
  };
}

export interface UpdateExpertProfileRequestDto {
  name: string;
  email: string;
  phone: string;
  company_name: string;
  license_type: string;
  license_number: string;
  expertise_areas: string[];
  experience_years: number;
  education?: string;
  introduction: string;
  portfolio?: string;
}

export type ExpertProfileResponseUpdateDto = ExpertProfileResponseDto;

export interface VerificationRequestDto {
  id: number;
  expert_profile_id: number;
  status: ExpertVerificationStatus;
  license_type: string;
  license_number: string;
  issue_date: string;
  company_name: string;
  portfolio?: string;
  submitted_at?: string;
  reviewed_at?: string;
  rejected_reason?: string;
}

export interface ExpertVerificationStatusResponseDto {
  verification_request: VerificationRequestDto;
}

export interface CreateVerificationRequestDto {
  expert_profile_id: number;
  license_type: string;
  license_number: string;
  issue_date: string;
  company_name: string;
  portfolio?: string;
  file_ids?: number[];
}

export type CreateVerificationResponseDto = ExpertVerificationStatusResponseDto;

export interface JobPostListItemDto {
  id: number;
  company_id: number;
  company_name?: string;
  title: string;
  industry: string;
  job_type: JobPostType;
  business_type: string;
  classification?: string;
  required_license?: string;
  current_industry?: string;
  current_license?: string;
  reason?: string;
  asset_scale_label?: string;
  bid_count: number;
  posted_at: string;
  is_new: boolean;
  status: JobPostStatusCode;
}

export interface JobPostListResponseDto {
  items: JobPostListItemDto[];
}

export interface CompanySummaryDto {
  id: number;
  name: string;
  representative: string;
  location?: string;
}

export interface JobPostDetailResponseDto extends JobPostListItemDto {
  created_at: string;
  company: CompanySummaryDto;
}

export interface CreateBidRequestDto {
  job_post_id: number;
  bid_amount: number;
}

export interface MyBidItemDto {
  id: number;
  job_post_id: number;
  job_post_title: string;
  bid_amount: number;
  status: BidStatusCode;
  submitted_at: string;
  total_bid_count: number;
  client_contact?: string;
}

export interface CreateBidResponseDto {
  bid: MyBidItemDto;
}

export interface MyBidsResponseDto {
  items: MyBidItemDto[];
}

export interface ExpertSignupRequestDto {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface ExpertSignupResponseDto {
  user: UserSummaryDto;
  expert_profile: ExpertProfileResponseDto["expert_profile"];
}

export interface CompanySummaryVM {
  id: number;
  name: string;
  representative: string;
  location?: string;
}

export interface ExpertJobListItemVM {
  id: number;
  title: string;
  industry: string;
  type: JobPostType;
  businessType: string;
  classification?: string;
  requiredLicense?: string;
  currentIndustry?: string;
  currentLicense?: string;
  reason?: string;
  assetScale?: string;
  bids: number;
  postedDate: string;
  isNew: boolean;
  status?: string;
}

export interface ExpertJobDetailVM extends ExpertJobListItemVM {
  createdAt: string;
  company: CompanySummaryVM;
}

export interface MyBidItemVM {
  id: number;
  projectId: number;
  projectTitle: string;
  myBid: string;
  status: BidStatusLabel;
  bidDate: string;
  totalBids: number;
  clientContact?: string;
}

export interface ExpertProfileFormVM {
  id: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  licenseType: string;
  licenseNumber: string;
  expertiseAreas: string[];
  experienceYears: number;
  education?: string;
  introduction: string;
  portfolio?: string;
  verificationStatus: ExpertVerificationStatus;
  stats: {
    activeBids: number;
    wonProjects: number;
    completedProjects: number;
    totalEarned: string;
  };
}

export interface ExpertVerificationStatusVM {
  id: number;
  expertProfileId: number;
  status: ExpertVerificationStatus;
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  companyName: string;
  portfolio?: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectedReason?: string;
}

export interface CreateBidRequest {
  jobPostId: number;
  price: number;
}

export interface SubmitExpertVerificationRequest {
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  companyName: string;
  portfolio?: string;
  fileIds?: number[];
}

export interface ExpertSignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}
