import {
  mockExpertJobDetailDto,
  mockExpertJobsDto,
  mockExpertProfileDto,
  mockExpertVerificationStatusDto,
  mockMyBidsDto,
} from "../mocks/expert";
import type {
  ExpertJobDetailVM,
  ExpertJobListItemVM,
  ExpertProfileFormVM,
  ExpertSignupRequest,
  ExpertVerificationStatus,
  ExpertVerificationStatusVM,
  CreateBidRequest,
  MyBidItemDto,
  MyBidItemVM,
  SubmitExpertVerificationRequest,
} from "../types/expert";
import {
  mapBidDtoToVM,
  mapCreateBidRequestToDto,
  mapExpertProfileDtoToVM,
  mapExpertProfileVMToUpdateDto,
  mapJobPostDetailDtoToVM,
  mapJobPostListDtoToVM,
  mapSubmitVerificationRequestToDto,
  mapVerificationStatusDtoToVM,
} from "./expertMappers";

const clone = <T>(value: T): T => structuredClone(value);

export async function registerExpert(
  payload: ExpertSignupRequest,
): Promise<ExpertProfileFormVM> {
  const profileDto = clone(mockExpertProfileDto);

  profileDto.user = {
    ...profileDto.user,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
  };
  profileDto.expert_profile.verification_status = "NOT_APPLIED";
  profileDto.expert_profile.is_verified = false;

  return mapExpertProfileDtoToVM(profileDto);
}

export async function getExpertJobs(): Promise<ExpertJobListItemVM[]> {
  return mapJobPostListDtoToVM(clone(mockExpertJobsDto));
}

export async function getExpertJobDetail(
  id: number | string,
): Promise<ExpertJobDetailVM> {
  const numericId = Number(id);
  const listItem =
    mockExpertJobsDto.items.find((job) => job.id === numericId) ??
    mockExpertJobsDto.items[0];

  return mapJobPostDetailDtoToVM(
    clone({
      ...mockExpertJobDetailDto,
      ...listItem,
      created_at: listItem.posted_at,
      company: {
        ...mockExpertJobDetailDto.company,
        id: listItem.company_id,
        name: listItem.company_name ?? mockExpertJobDetailDto.company.name,
      },
    }),
  );
}

export async function createBid(payload: CreateBidRequest): Promise<MyBidItemVM> {
  const dto = mapCreateBidRequestToDto(payload);
  const job =
    mockExpertJobsDto.items.find((item) => item.id === dto.job_post_id) ??
    mockExpertJobsDto.items[0];
  const createdBidDto: MyBidItemDto = {
    id: Date.now(),
    job_post_id: dto.job_post_id,
    job_post_title: job.title,
    bid_amount: dto.bid_amount,
    status: "PENDING",
    submitted_at: new Date().toISOString(),
    total_bid_count: job.bid_count + 1,
  };

  return mapBidDtoToVM(createdBidDto);
}

export async function getMyBids(): Promise<MyBidItemVM[]> {
  return clone(mockMyBidsDto).items.map(mapBidDtoToVM);
}

export async function getExpertProfile(): Promise<ExpertProfileFormVM> {
  return mapExpertProfileDtoToVM(clone(mockExpertProfileDto));
}

export async function updateExpertProfile(
  profile: ExpertProfileFormVM,
): Promise<ExpertProfileFormVM> {
  const updateDto = mapExpertProfileVMToUpdateDto(profile);
  const responseDto = clone(mockExpertProfileDto);

  responseDto.user = {
    ...responseDto.user,
    name: updateDto.name,
    email: updateDto.email,
    phone: updateDto.phone,
  };
  responseDto.expert_profile = {
    ...responseDto.expert_profile,
    company_name: updateDto.company_name,
    license_type: updateDto.license_type,
    license_number: updateDto.license_number,
    expertise_areas: updateDto.expertise_areas,
    experience_years: updateDto.experience_years,
    education: updateDto.education,
    introduction: updateDto.introduction,
    portfolio: updateDto.portfolio,
    verification_status: profile.verificationStatus,
  };

  return mapExpertProfileDtoToVM(responseDto);
}

export async function getExpertVerificationStatus(
  statusOverride?: ExpertVerificationStatus,
): Promise<ExpertVerificationStatusVM> {
  const responseDto = clone(mockExpertVerificationStatusDto);

  responseDto.verification_request.status =
    statusOverride ?? responseDto.verification_request.status;

  return mapVerificationStatusDtoToVM(responseDto);
}

export async function submitExpertVerification(
  request: SubmitExpertVerificationRequest,
): Promise<ExpertVerificationStatusVM> {
  const dto = mapSubmitVerificationRequestToDto(
    request,
    mockExpertProfileDto.expert_profile.id,
  );
  const responseDto = clone(mockExpertVerificationStatusDto);

  responseDto.verification_request = {
    ...responseDto.verification_request,
    expert_profile_id: dto.expert_profile_id,
    status: "PENDING",
    license_type: dto.license_type,
    license_number: dto.license_number,
    issue_date: dto.issue_date,
    company_name: dto.company_name,
    portfolio: dto.portfolio,
    submitted_at: new Date().toISOString().slice(0, 10),
  };

  return mapVerificationStatusDtoToVM(responseDto);
}
