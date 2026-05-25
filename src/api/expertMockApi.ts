import {
  mockExpertJobDetailDto,
  mockExpertJobsDto,
  mockExpertProfileDto,
  mockMyBidsDto,
} from "../mocks/expert";
import type { CreateBidResponseDto, MyBidItemDto } from "../types/expert";
import {
  mapBidDtoToVM,
  mapCreateBidRequestToDto,
  mapCreateBidResponseDtoToVM,
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
    profileDto.expert_profile.company_name = payload.companyName;
    profileDto.expert_profile.verification_status = "NOT_APPLIED";
    profileDto.expert_profile.is_verified = false;

    return {
      hasAccessToken: true,
      loginRequired: false,
      profile: mapExpertProfileDtoToVM(profileDto),
    };
  },

  async getExpertJobs(query = { page: 1, size: 20, sort: "posted_at_desc" as const }) {
    const page = query.page ?? 1;
    const size = query.size ?? 20;
    const sortedItems = [...mockExpertJobsDto.items].sort((left, right) => {
      const order = left.posted_at.localeCompare(right.posted_at);
      return query.sort === "posted_at_asc" ? order : -order;
    });
    const startIndex = Math.max(page - 1, 0) * size;
    const items = sortedItems.slice(startIndex, startIndex + size);

    return mapJobPostListDtoToVM({
      ...clone(mockExpertJobsDto),
      items,
      page,
      size,
      total_count: mockExpertJobsDto.items.length,
      total_pages: Math.ceil(mockExpertJobsDto.items.length / size),
      has_next: startIndex + size < mockExpertJobsDto.items.length,
    });
  },

  async getExpertJobDetail(id) {
    const listItem =
      mockExpertJobsDto.items.find(
        (job) => job.announcement_code === id || job.id === Number(id),
      ) ??
      mockExpertJobsDto.items[0];

    return mapJobPostDetailDtoToVM(
      clone({
        ...mockExpertJobDetailDto,
        ...listItem,
        created_at: listItem.posted_at,
        has_my_bid: listItem.has_my_bid === true,
        my_bid: listItem.has_my_bid === true ? mockExpertJobDetailDto.my_bid : null,
        company: {
          ...mockExpertJobDetailDto.company,
          id: listItem.company_id ?? mockExpertJobDetailDto.company.id,
          name: listItem.company_name ?? mockExpertJobDetailDto.company.name,
        },
      }),
    );
  },

  async createBid(payload) {
    const dto = mapCreateBidRequestToDto(payload);
    const job =
      mockExpertJobsDto.items.find(
        (item) => item.announcement_code === payload.announcementCode,
      ) ??
      mockExpertJobsDto.items[0];
    const createdBidDto: CreateBidResponseDto = {
      id: Date.now(),
      announcement_code: job.announcement_code,
      bid_amount: dto.bid_amount,
      status: "PENDING",
      submitted_at: new Date().toISOString(),
      total_bid_count: job.bid_count + 1,
    };

    return mapCreateBidResponseDtoToVM(createdBidDto);
  },

  async updateBid(payload) {
    const dto = mapCreateBidRequestToDto(payload);
    const job =
      mockExpertJobsDto.items.find(
        (item) => item.announcement_code === payload.announcementCode,
      ) ??
      mockExpertJobsDto.items[0];
    const updatedBidDto: MyBidItemDto = {
      id: mockExpertJobDetailDto.my_bid?.id ?? Date.now(),
      announcement_id: job.id,
      announcement_code: job.announcement_code,
      job_post_title: job.title,
      bid_amount: dto.bid_amount,
      status: "PENDING",
      submitted_at: new Date().toISOString(),
      total_bid_count: job.bid_count,
      client_contact: null,
    };

    return mapBidDtoToVM(updatedBidDto);
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
      verification_status: profile.verificationStatus,
    };

    return mapExpertProfileDtoToVM(responseDto);
  },
};
