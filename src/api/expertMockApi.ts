import {
  mockExpertJobDetailDto,
  mockExpertJobsDto,
  mockExpertProfileDto,
  mockMyBidsDto,
} from "../mocks/expert";
import type { MyBidItemDto } from "../types/expert";
import {
  mapBidDtoToVM,
  mapCreateBidRequestToDto,
  mapExpertProfileDtoToVM,
  mapExpertProfileVMToUpdateDto,
  mapJobPostDetailDtoToVM,
  mapJobPostListDtoToVM,
} from "./expertMappers";
import type { ExpertApi } from "./expertApiTypes";

const clone = <T>(value: T): T => structuredClone(value);

export const expertMockApi: ExpertApi = {
  async registerExpert(payload) {
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
  },

  async getExpertJobs() {
    return mapJobPostListDtoToVM(clone(mockExpertJobsDto));
  },

  async getExpertJobDetail(id) {
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
  },

  async createBid(payload) {
    const dto = mapCreateBidRequestToDto(payload);
    const job =
      mockExpertJobsDto.items.find((item) => item.id === payload.jobPostId) ??
      mockExpertJobsDto.items[0];
    const createdBidDto: MyBidItemDto = {
      id: Date.now(),
      job_post_id: payload.jobPostId,
      job_post_title: job.title,
      bid_amount: dto.bid_amount,
      status: "PENDING",
      submitted_at: new Date().toISOString(),
      total_bid_count: job.bid_count + 1,
      client_contact: null,
    };

    return mapBidDtoToVM(createdBidDto);
  },

  async getMyBids() {
    return clone(mockMyBidsDto).items.map(mapBidDtoToVM);
  },

  async getExpertProfile() {
    return mapExpertProfileDtoToVM(clone(mockExpertProfileDto));
  },

  async updateExpertProfile(profile) {
    const updateDto = mapExpertProfileVMToUpdateDto(profile);
    const responseDto = clone(mockExpertProfileDto);

    responseDto.user = {
      ...responseDto.user,
      name: updateDto.name ?? responseDto.user.name,
      email: profile.email,
      phone: updateDto.phone ?? responseDto.user.phone,
    };
    responseDto.expert_profile = {
      ...responseDto.expert_profile,
      company_name: updateDto.company_name ?? responseDto.expert_profile.company_name,
      expertise_areas:
        updateDto.expertise_areas ?? responseDto.expert_profile.expertise_areas,
      portfolio: updateDto.portfolio ?? responseDto.expert_profile.portfolio,
      verification_status: profile.verificationStatus,
    };

    return mapExpertProfileDtoToVM(responseDto);
  },
};
