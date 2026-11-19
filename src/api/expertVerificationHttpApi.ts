import type { ExpertVerificationStatusResponseDto } from '../types/expertVerification';
import { apiClient, ApiError } from './apiClient';
import { mapSubmitVerificationRequestToDto, mapVerificationStatusDtoToVM } from './expertVerificationMappers';
import type { ExpertVerificationApi } from './expertApiTypes';
import { saveVerificationAssets } from './verificationAssets';

async function fetchExpertVerificationStatus() {
  const response = await apiClient.get<ExpertVerificationStatusResponseDto>('/expert/me/verification-status');
  return mapVerificationStatusDtoToVM(response);
}

export const expertVerificationHttpApi: ExpertVerificationApi = {
  async getExpertVerificationStatus() { return fetchExpertVerificationStatus(); },
  async submitExpertVerification(request) {
    // Refresh status before writes: another tab may already have submitted the request.
    const current = await fetchExpertVerificationStatus();
    if (current.status !== 'NOT_APPLIED' && current.status !== 'REJECTED') {
      throw new Error('현재 상태에서는 수정·재신청할 수 없습니다. 인증 상태를 다시 확인해 주세요.');
    }
    await saveVerificationAssets(apiClient, request);
    request.onSubmissionAttempt?.();
    try {
      await apiClient.post<void>('/expert/me/verification-requests', { body: mapSubmitVerificationRequestToDto(request) });
    } catch (error) {
      // A definite validation/permission rejection permits editing. Network/5xx outcomes are uncertain.
      if (error instanceof ApiError && [400, 401, 403, 422].includes(error.status)) {
        request.onSubmissionRejected?.();
        throw error;
      }
      throw new Error('신청 접수 여부를 확인하지 못했습니다. 인증 상태를 확인한 뒤 다시 진행해 주세요.');
    }
    try {
      const result = await fetchExpertVerificationStatus();
      if (result.status !== 'PENDING' && result.status !== 'APPROVED') throw new Error('unexpected status');
      return result;
    } catch {
      throw new Error('신청 요청은 처리되었지만 최신 상태를 확인하지 못했습니다. 인증 상태를 다시 확인해 주세요.');
    }
  },
};
