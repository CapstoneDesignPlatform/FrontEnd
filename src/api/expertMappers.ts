import type {
  BidStatusCode,
  BidStatusLabel,
  ClientContactDto,
  ClientContactVM,
  CreateBidRequest,
  CreateBidRequestDto,
  ExpertJobMyBidVM,
  ExpertSignupRequest,
  ExpertSignupRequestDto,
  ExpertJobDetailVM,
  ExpertJobListItemVM,
  ExpertJobListResultVM,
  ExpertProfileFormVM,
  ExpertProfileResponseDto,
  JobPostDetailResponseDto,
  JobPostListItemDto,
  JobPostListResponseDto,
  JobPostStatusCode,
  JobPostTypeCode,
  JobPostTypeLabel,
  MyBidItemDto,
  MyBidItemVM,
  MyBidSummaryDto,
  UpdateExpertProfileRequestDto,
} from "../types/expert";

const jobPostTypeLabels: Record<JobPostTypeCode, JobPostTypeLabel> = {
  LICENSE: "필요 면허",
  SURVEY: "실태 조사",
  PERIODIC_REPORT: "주기적 신고",
  ETC: "기타",
};

const jobPostStatusLabels: Record<JobPostStatusCode, string> = {
  BIDDING: "입찰 가능",
  IN_PROGRESS: "입찰 마감",
  COMPLETED: "입찰 마감",
  CLOSED: "입찰 마감",
};

const bidStatusLabels: Record<BidStatusCode, BidStatusLabel> = {
  PENDING: "대기 중",
  SELECTED: "선정됨",
  REJECTED: "거절됨",
};

function formatCurrency(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

function formatAssetScale(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return typeof value === "number" ? formatCurrency(value) : value;
}

function formatDate(value: string) {
  return value.slice(0, 10);
}

function formatOptionalDate(value: string | null | undefined) {
  return value ? formatDate(value) : undefined;
}

function normalizeNullable(value: string | null | undefined) {
  return value ?? undefined;
}

function mapJobPostType(dto: JobPostListItemDto) {
  return dto.job_type_label ?? jobPostTypeLabels[dto.job_type];
}

function mapClientContactDtoToVM(
  contact: ClientContactDto | null,
): ClientContactVM | undefined {
  if (!contact) return undefined;

  const parts = [contact.name, contact.phone, contact.email].filter(Boolean);

  return {
    copyText: parts.join(" / "),
    displayText: parts.join(" · "),
    email: normalizeNullable(contact.email),
    name: normalizeNullable(contact.name),
    phone: normalizeNullable(contact.phone),
  };
}

function mapMyBidSummaryDtoToVM(dto: MyBidSummaryDto): ExpertJobMyBidVM {
  return {
    amount: dto.bid_amount,
    id: dto.id,
    status: bidStatusLabels[dto.status],
    submittedAt: formatDate(dto.submitted_at),
  };
}

export function mapJobPostListItemDtoToVM(dto: JobPostListItemDto): ExpertJobListItemVM {
  return {
    id: dto.id,
    companyName: dto.company_name,
    title: dto.title,
    industry: dto.industry,
    typeCode: dto.job_type,
    type: mapJobPostType(dto),
    businessType: normalizeNullable(dto.business_type),
    classification: normalizeNullable(dto.classification),
    requiredLicense: normalizeNullable(dto.required_license),
    currentIndustry: normalizeNullable(dto.current_industry),
    currentLicense: normalizeNullable(dto.current_license),
    reason: normalizeNullable(dto.reason),
    assetScale: formatAssetScale(dto.asset_scale_label),
    bids: dto.bid_count,
    postedDate: formatDate(dto.posted_at),
    deadline: formatOptionalDate(
      dto.job_post_deadline ?? dto.deadline ?? dto.due_date,
    ),
    isNew: dto.is_new,
    status: dto.status ? jobPostStatusLabels[dto.status] : undefined,
    hasMyBid: dto.has_my_bid,
  };
}

export function mapJobPostListDtoToVM(dto: JobPostListResponseDto): ExpertJobListResultVM {
  const items = dto.items.map(mapJobPostListItemDtoToVM);

  return {
    hasNext: dto.has_next ?? false,
    items,
    page: dto.page ?? 1,
    size: dto.size ?? items.length,
    totalCount: dto.total_count ?? items.length,
    totalPages: dto.total_pages ?? 1,
  };
}

export function mapJobPostDetailDtoToVM(dto: JobPostDetailResponseDto): ExpertJobDetailVM {
  return {
    ...mapJobPostListItemDtoToVM(dto),
    createdAt: formatDate(dto.created_at),
    hasMyBid: dto.has_my_bid === true || Boolean(dto.my_bid),
    myBid: dto.my_bid ? mapMyBidSummaryDtoToVM(dto.my_bid) : undefined,
    company: {
      id: dto.company.id,
      name: dto.company.name,
      representative: dto.company.representative ?? "",
      location: normalizeNullable(dto.company.location),
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
    deadline: formatOptionalDate(
      dto.job_post_deadline ?? dto.deadline ?? dto.due_date,
    ),
    totalBids: dto.total_bid_count,
    clientContact: mapClientContactDtoToVM(dto.client_contact),
  };
}

export function mapExpertProfileDtoToVM(dto: ExpertProfileResponseDto): ExpertProfileFormVM {
  const profile = dto.expert_profile;

  return {
    id: profile.id,
    userId: profile.user_id,
    name: dto.user.name,
    email: dto.user.email,
    phone: dto.user.phone ?? "",
    companyName: profile.company_name,
    licenseType: profile.license_type ?? undefined,
    expertiseAreas: profile.expertise_areas,
    portfolio: profile.portfolio ?? undefined,
    verificationStatus: profile.verification_status,
    stats: {
      activeBids: profile.stats.active_bids,
      wonProjects: profile.stats.won_projects,
      completedProjects: profile.stats.completed_projects,
      totalEarned: formatCurrency(profile.stats.total_earned),
    },
  };
}

export function mapExpertProfileVMToUpdateDto(
  profile: ExpertProfileFormVM,
): UpdateExpertProfileRequestDto {
  return {
    name: profile.name,
    phone: profile.phone,
    company_name: profile.companyName,
    expertise_areas: profile.expertiseAreas,
    portfolio: profile.portfolio,
  };
}

export function mapCreateBidRequestToDto(payload: CreateBidRequest): CreateBidRequestDto {
  return {
    bid_amount: payload.price,
  };
}

export function mapExpertSignupRequestToDto(
  payload: ExpertSignupRequest,
): ExpertSignupRequestDto {
  return {
    company_name: payload.companyName,
    email: payload.email,
    name: payload.name,
    password: payload.password,
    phone: payload.phone,
  };
}
