import { ApiClient } from './apiClient';

export type ExpertSearchCategory = 'ALL' | 'COMPANY_NAME' | 'REPRESENTATIVE_NAME' | 'CERTIFICATE';
export interface ExpertCertificateType { code: string; name: string }
export interface PublicExpert {
  expert_user_id: number;
  company_name: string | null;
  representative_name: string | null;
  certificate_types: ExpertCertificateType[];
}
export interface PublicExpertDetail extends PublicExpert {
  name: string | null;
  phone: string | null;
  portfolio_description: string | null;
}
export interface PublicExpertPage {
  items: PublicExpert[];
  page: number;
  size: number;
  total_count: number;
  total_pages: number;
  has_next: boolean;
}
// 공개 조회는 만료된 로그인 토큰에 영향을 받지 않도록 인증 헤더를 보내지 않습니다.
const publicClient = new ApiClient({ getAccessToken: () => undefined, credentials: 'omit' });
export function searchPublicExperts(category: ExpertSearchCategory, keyword: string, page: number, signal: AbortSignal) {
  return publicClient.get<PublicExpertPage>('/experts', {
    query: { category, keyword: keyword.trim(), page }, signal,
  });
}
export function getPublicExpert(id: number, signal: AbortSignal) {
  return publicClient.get<PublicExpertDetail>(`/experts/${id}`, { signal });
}
