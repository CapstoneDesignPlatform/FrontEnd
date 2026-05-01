import type {
  CreateBidResponseDto,
  ExpertProfileResponseDto,
  ExpertSignupResponseDto,
  JobPostDetailResponseDto,
  JobPostListResponseDto,
  MyBidsResponseDto,
} from "../types/expert";
import { apiClient } from "./apiClient";
import {
  mapBidDtoToVM,
  mapCreateBidRequestToDto,
  mapExpertProfileDtoToVM,
  mapExpertProfileVMToUpdateDto,
  mapJobPostDetailDtoToVM,
  mapJobPostListDtoToVM,
} from "./expertMappers";
import type { ExpertApi } from "./expertApiTypes";

export const expertHttpApi: ExpertApi = {
  async registerExpert(payload) {
    const response = await apiClient.post<ExpertSignupResponseDto>(
      "/auth/signup/expert",
      { body: payload },
    );

    return mapExpertProfileDtoToVM(response);
  },

  async getExpertJobs() {
    const response = await apiClient.get<JobPostListResponseDto>("/expert/job-posts");

    return mapJobPostListDtoToVM(response);
  },

  async getExpertJobDetail(id) {
    const response = await apiClient.get<JobPostDetailResponseDto>(
      `/expert/job-posts/${id}`,
    );

    return mapJobPostDetailDtoToVM(response);
  },

  async createBid(payload) {
    const dto = mapCreateBidRequestToDto(payload);
    const response = await apiClient.post<CreateBidResponseDto>(
      `/expert/job-posts/${payload.jobPostId}/bids`,
      { body: { bid_amount: dto.bid_amount } },
    );

    return mapBidDtoToVM(response.bid);
  },

  async getMyBids() {
    const response = await apiClient.get<MyBidsResponseDto>("/expert/me/bids");

    return response.items.map(mapBidDtoToVM);
  },

  async getExpertProfile() {
    const response = await apiClient.get<ExpertProfileResponseDto>(
      "/expert/me/profile",
    );

    return mapExpertProfileDtoToVM(response);
  },

  async updateExpertProfile(profile) {
    const response = await apiClient.patch<ExpertProfileResponseDto>(
      "/expert/me/profile",
      { body: mapExpertProfileVMToUpdateDto(profile) },
    );

    return mapExpertProfileDtoToVM(response);
  },
};
