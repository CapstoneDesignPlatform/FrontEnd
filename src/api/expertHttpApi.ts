import type {
  CreateBidResponseDto,
  ExpertProfileResponseDto,
  ExpertSignupResponseDto,
  JobPostDetailResponseDto,
  JobPostListResponseDto,
  MyBidsResponseDto,
} from "../types/expert";
import { apiClient } from "./apiClient";
import { persistAuthTokens } from "./authTokens";
import {
  mapBidDtoToVM,
  mapCreateBidResponseDtoToVM,
  mapCreateBidRequestToDto,
  mapExpertProfileDtoToVM,
  mapExpertProfileVMToUpdateDto,
  mapExpertSignupResponseToProfileVM,
  mapExpertSignupRequestToDto,
  mapJobPostDetailDtoToVM,
  mapJobPostListDtoToVM,
} from "./expertMappers";
import type { ExpertApi } from "./expertApiTypes";

export const expertHttpApi: ExpertApi = {
  async registerExpert(payload) {
    const dto = mapExpertSignupRequestToDto(payload);
    const response =
      (await apiClient.post<ExpertSignupResponseDto | undefined>(
        "/auth/signup",
        { body: dto },
      )) ?? {};
    const hasAccessToken = persistAuthTokens(response);

    return {
      hasAccessToken,
      loginRequired:
        !hasAccessToken ||
        response.loginRequired === true ||
        response.login_required === true,
      profile: mapExpertSignupResponseToProfileVM(response, payload),
    };
  },

  async getExpertJobs(query = { page: 1, size: 20, sort: "posted_at_desc" as const }) {
    const response = await apiClient.get<JobPostListResponseDto>("/expert/job-posts", {
      query: {
        page: query.page,
        size: query.size,
        sort: query.sort,
      },
    });

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
      `/expert/job-posts/${encodeURIComponent(payload.announcementCode)}/bids`,
      { body: { bid_amount: dto.bid_amount } },
    );

    return mapCreateBidResponseDtoToVM(response);
  },

  async updateBid(payload) {
    void payload;
    throw new Error("입찰 수정 API는 아직 백엔드에서 제공되지 않습니다.");
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
