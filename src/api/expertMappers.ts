import type {
  BidStatusCode,
  BidStatusLabel,
  CreateBidRequest,
  CreateBidRequestDto,
  CreateVerificationRequestDto,
  ExpertJobDetailVM,
  ExpertJobListItemVM,
  ExpertProfileFormVM,
  ExpertProfileResponseDto,
  ExpertVerificationStatusVM,
  ExpertVerificationStatusResponseDto,
  JobPostDetailResponseDto,
  JobPostListItemDto,
  JobPostListResponseDto,
  JobPostStatusCode,
  MyBidItemDto,
  MyBidItemVM,
  SubmitExpertVerificationRequest,
  UpdateExpertProfileRequestDto,
} from "../types/expert";

const jobPostStatusLabels: Record<JobPostStatusCode, string> = {
  BIDDING: "입찰 중",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
  CLOSED: "마감",
};

const bidStatusLabels: Record<BidStatusCode, BidStatusLabel> = {
  PENDING: "대기 중",
  SELECTED: "선정됨",
  REJECTED: "거절됨",
};

function formatCurrency(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

function formatDate(value: string) {
  return value.slice(0, 10);
}

export function mapJobPostListItemDtoToVM(dto: JobPostListItemDto): ExpertJobListItemVM {
  return {
    id: dto.id,
    title: dto.title,
    industry: dto.industry,
    type: dto.job_type,
    businessType: dto.business_type,
    classification: dto.classification,
    requiredLicense: dto.required_license,
    currentIndustry: dto.current_industry,
    currentLicense: dto.current_license,
    reason: dto.reason,
    assetScale: dto.asset_scale_label,
    bids: dto.bid_count,
    postedDate: formatDate(dto.posted_at),
    isNew: dto.is_new,
    status: jobPostStatusLabels[dto.status],
  };
}

export function mapJobPostListDtoToVM(dto: JobPostListResponseDto): ExpertJobListItemVM[] {
  return dto.items.map(mapJobPostListItemDtoToVM);
}

export function mapJobPostDetailDtoToVM(dto: JobPostDetailResponseDto): ExpertJobDetailVM {
  return {
    ...mapJobPostListItemDtoToVM(dto),
    createdAt: formatDate(dto.created_at),
    company: {
      id: dto.company.id,
      name: dto.company.name,
      representative: dto.company.representative,
      location: dto.company.location,
    },
  };
}

export function mapBidDtoToVM(dto: MyBidItemDto): MyBidItemVM {
  return {
    id: dto.id,
    projectId: dto.job_post_id,
    projectTitle: dto.job_post_title,
    myBid: formatCurrency(dto.bid_amount),
    status: bidStatusLabels[dto.status],
    bidDate: formatDate(dto.submitted_at),
    totalBids: dto.total_bid_count,
    clientContact: dto.client_contact,
  };
}

export function mapExpertProfileDtoToVM(dto: ExpertProfileResponseDto): ExpertProfileFormVM {
  const profile = dto.expert_profile;

  return {
    id: profile.id,
    userId: profile.user_id,
    name: dto.user.name,
    email: dto.user.email,
    phone: dto.user.phone,
    companyName: profile.company_name,
    licenseType: profile.license_type,
    licenseNumber: profile.license_number,
    expertiseAreas: profile.expertise_areas,
    experienceYears: profile.experience_years,
    education: profile.education,
    introduction: profile.introduction,
    portfolio: profile.portfolio,
    verificationStatus: profile.verification_status,
    stats: {
      activeBids: profile.stats.active_bids,
      wonProjects: profile.stats.won_projects,
      completedProjects: profile.stats.completed_projects,
      totalEarned: profile.stats.total_earned_label,
    },
  };
}

export function mapExpertProfileVMToUpdateDto(
  profile: ExpertProfileFormVM,
): UpdateExpertProfileRequestDto {
  return {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    company_name: profile.companyName,
    license_type: profile.licenseType,
    license_number: profile.licenseNumber,
    expertise_areas: profile.expertiseAreas,
    experience_years: profile.experienceYears,
    education: profile.education,
    introduction: profile.introduction,
    portfolio: profile.portfolio,
  };
}

export function mapVerificationStatusDtoToVM(
  dto: ExpertVerificationStatusResponseDto,
): ExpertVerificationStatusVM {
  const request = dto.verification_request;

  return {
    id: request.id,
    expertProfileId: request.expert_profile_id,
    status: request.status,
    licenseType: request.license_type,
    licenseNumber: request.license_number,
    issueDate: request.issue_date,
    companyName: request.company_name,
    portfolio: request.portfolio,
    submittedAt: request.submitted_at,
    reviewedAt: request.reviewed_at,
    rejectedReason: request.rejected_reason,
  };
}

export function mapCreateBidRequestToDto(payload: CreateBidRequest): CreateBidRequestDto {
  return {
    job_post_id: payload.jobPostId,
    bid_amount: payload.price,
  };
}

export function mapSubmitVerificationRequestToDto(
  payload: SubmitExpertVerificationRequest,
  expertProfileId: number,
): CreateVerificationRequestDto {
  return {
    expert_profile_id: expertProfileId,
    license_type: payload.licenseType,
    license_number: payload.licenseNumber,
    issue_date: payload.issueDate,
    company_name: payload.companyName,
    portfolio: payload.portfolio,
    file_ids: payload.fileIds,
  };
}
