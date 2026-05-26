import type {
  BidStatusCode,
  BidStatusLabel,
  ClientContactDto,
  ClientContactVM,
  CreateBidResponseDto,
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
  ExpertSignupResponseDto,
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
  ACTIVE: "입찰 가능",
  BIDDING: "입찰 가능",
  CANCELLED: "입찰 마감",
  IN_PROGRESS: "입찰 마감",
  COMPLETED: "입찰 마감",
  CLOSED: "입찰 마감",
};

const bidStatusLabels: Record<BidStatusCode, BidStatusLabel> = {
  PENDING: "대기 중",
  SELECTED: "선정됨",
  REJECTED: "거절됨",
};

const industryLabels: Record<string, string> = {
  CONSTRUCTION: "건설업",
  ELECTRICAL: "전기공사업",
  ETC: "기타",
  FIRE_FIGHTING: "소방시설공사업",
  INFORMATION_COMMUNICATION: "정보통신공사업",
  PHARMACEUTICAL: "의약품도매상",
};

const businessTypeLabels: Record<string, string> = {
  CORPORATION: "법인 사업자",
  INDIVIDUAL: "개인 사업자",
  STARTUP: "창업 예정",
};

const announcementCategoryLabels: Record<string, string> = {
  ADD: "추가",
  NEW: "신규",
};

const currentIndustryLabels: Record<string, string> = {
  CONSTRUCTION_RELATED: "건설업 관련",
  NON_CONSTRUCTION_RELATED: "비 건설업 관련",
  NONE: "없음",
};

const diagnosisReasonLabels: Record<string, string> = {
  CAPITAL_CHANGE: "자본금 변동",
  ETC: "기타",
  MERGER: "합병",
  TRANSFER: "양도",
};

function formatCurrency(value: number) {
  return `₩${value.toLocaleString("ko-KR")}`;
}

function formatCapitalScale(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  if (typeof value === "number") {
    return `${value.toLocaleString("ko-KR")}억원`;
  }

  return value;
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

function mapEnumLabel(
  value: string | null | undefined,
  labels: Record<string, string>,
) {
  const normalizedValue = normalizeNullable(value);

  return normalizedValue ? labels[normalizedValue] ?? normalizedValue : undefined;
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
    announcementCode: dto.announcement_code,
    companyName: normalizeNullable(dto.company_name),
    title: dto.title,
    industry: mapEnumLabel(dto.industry, industryLabels) ?? "",
    typeCode: dto.job_type,
    type: mapJobPostType(dto),
    businessType: mapEnumLabel(dto.business_type, businessTypeLabels),
    classification: mapEnumLabel(dto.classification, announcementCategoryLabels),
    requiredLicense: normalizeNullable(dto.required_license),
    currentIndustry: mapEnumLabel(dto.current_industry, currentIndustryLabels),
    currentLicense: normalizeNullable(dto.current_license),
    reason: mapEnumLabel(dto.reason, diagnosisReasonLabels),
    assetScale: formatCapitalScale(
      dto.capital_scale ?? dto.capital ?? dto.asset_scale_label,
    ),
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
    announcementCode: dto.announcement_code,
    projectId: dto.job_post_id ?? dto.announcement_id ?? dto.id,
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

export function mapCreateBidResponseDtoToVM(dto: CreateBidResponseDto): MyBidItemVM {
  return {
    announcementCode: dto.announcement_code,
    bidDate: formatDate(dto.submitted_at),
    clientContact: undefined,
    id: dto.id,
    myBid: formatCurrency(dto.bid_amount),
    projectId: dto.id,
    projectTitle: dto.announcement_code,
    status: bidStatusLabels[dto.status],
    totalBids: dto.total_bid_count,
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
    verificationStatus:
      profile.verification_status ?? (profile.is_verified ? "APPROVED" : "NOT_APPLIED"),
    stats: {
      activeBids: profile.stats.active_bids,
      wonProjects: profile.stats.selected_count ?? profile.stats.won_projects ?? 0,
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
    businessName: payload.companyName,
    email: payload.email,
    name: payload.name,
    password: payload.password,
    phone: payload.phone,
    userType: "EXPERT",
  };
}

export function mapExpertSignupResponseToProfileVM(
  dto: ExpertSignupResponseDto,
  request: ExpertSignupRequest,
): ExpertProfileFormVM {
  const profile = dto.expert_profile;

  if (dto.user && profile) {
    return mapExpertProfileDtoToVM({
      expert_profile: profile,
      user: dto.user,
    });
  }

  return {
    companyName: profile?.company_name ?? request.companyName,
    email: dto.user?.email ?? request.email,
    id: profile?.id ?? 0,
    name: dto.user?.name ?? request.name,
    phone: dto.user?.phone ?? request.phone,
    stats: {
      activeBids: profile?.stats.active_bids ?? 0,
      completedProjects: profile?.stats.completed_projects ?? 0,
      totalEarned: formatCurrency(profile?.stats.total_earned ?? 0),
      wonProjects: profile?.stats.selected_count ?? profile?.stats.won_projects ?? 0,
    },
    userId: profile?.user_id ?? dto.user?.id ?? 0,
    verificationStatus:
      profile?.verification_status ??
      (profile?.is_verified ? "APPROVED" : "NOT_APPLIED"),
  };
}
