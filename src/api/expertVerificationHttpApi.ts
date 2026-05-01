import type {
  CreateVerificationResponseDto,
  ExpertVerificationStatusResponseDto,
} from "../types/expertVerification";
import { apiClient } from "./apiClient";
import {
  mapSubmitVerificationRequestToDto,
  mapVerificationStatusDtoToVM,
} from "./expertVerificationMappers";
import type { ExpertVerificationApi } from "./expertApiTypes";

export const expertVerificationHttpApi: ExpertVerificationApi = {
  async getExpertVerificationStatus() {
    const response = await apiClient.get<ExpertVerificationStatusResponseDto>(
      "/expert/me/verification-status",
    );

    return mapVerificationStatusDtoToVM(response);
  },

  async submitExpertVerification(request) {
    const response = await apiClient.post<CreateVerificationResponseDto>(
      "/expert/me/verification-requests",
      { body: mapSubmitVerificationRequestToDto(request) },
    );

    return mapVerificationStatusDtoToVM(response);
  },
};
