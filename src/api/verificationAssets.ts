import type { SubmitExpertVerificationRequest, VerificationFilePurpose } from '../types/expertVerification';

type Client = {
  post<T>(path: string, options: { body: unknown; query?: Record<string, string> }): Promise<T>;
  patch<T>(path: string, options: { body: unknown }): Promise<T>;
};
export class VerificationSaveUncertainError extends Error {}

const validId = (id: unknown): id is number => Number.isSafeInteger(id) && Number(id) > 0;

/** Save sequentially and report each confirmed upload/save so retry can reuse its IDs. */
export async function saveVerificationAssets(client: Client, request: SubmitExpertVerificationRequest) {
  const certificates = request.certificates ?? [];
  const assets = [...certificates, ...(request.businessLicense ? [request.businessLicense] : [])];
  for (const asset of assets) {
    if ((asset.existing || asset.id !== undefined) && !validId(asset.id)) {
      throw new Error('기존 서류의 ID가 없어 수정할 수 없습니다. 새로고침 후 다시 확인해 주세요.');
    }
  }
  async function upload(file: File | null | undefined, fileId: number | undefined, purpose: VerificationFilePurpose) {
    if (!file) {
      if (!validId(fileId)) throw new Error('인증 파일 정보가 없습니다.');
      return fileId;
    }
    const body = new FormData();
    body.append('file', file);
    const result = await client.post<{ file: { id: number } }>('/files', { body, query: { purpose } });
    if (!validId(result?.file?.id)) throw new Error('업로드 결과의 파일 ID를 확인할 수 없습니다.');
    return result.file.id;
  }
  async function save(path: string, id: number | undefined, body: unknown) {
    try {
      const result = id ? await client.patch<{ id: number }>(`${path}/${id}`, { body })
        : await client.post<{ id: number }>(path, { body });
      if (!validId(result?.id) || (id && result.id !== id)) {
        throw new VerificationSaveUncertainError('저장 결과를 확인할 수 없습니다. 인증 상태를 다시 조회해 등록 내역을 확인해 주세요.');
      }
      return result;
    } catch (error) {
      const status = (error as { status?: number } | null)?.status;
      if (typeof status === 'number' && [400, 401, 403, 404, 422].includes(status)) throw error;
      throw new VerificationSaveUncertainError('서류 저장 여부를 확인하지 못했습니다. 인증 상태를 다시 조회한 뒤 진행해 주세요.');
    }
  }
  for (const [index, certificate] of certificates.entries()) {
    const fileId = await upload(certificate.file, certificate.fileId, 'CERTIFICATE');
    request.onProgress?.({ kind: 'certificate', index, id: certificate.id, fileId });
    const body = {
      certificate_name: certificate.licenseType === '경영지도사(재무관리)' ? '경영지도사' : certificate.licenseType,
      certificate_number: certificate.licenseNumber,
      issue_date: certificate.issueDate, expiry_date: certificate.expiryDate,
      owner_name: certificate.holderName, file_id: fileId,
    };
    const result = await save('/expert/me/certificates', certificate.id, body);
    request.onProgress?.({ kind: 'certificate', index, id: result.id, fileId });
  }
  const business = request.businessLicense;
  if (business) {
    const fileId = await upload(business.file, business.fileId, 'BUSINESS_REGISTRATION');
    request.onProgress?.({ kind: 'business', index: 0, id: business.id, fileId });
    const body = { file_id: fileId, business_number: business.businessNumber, representative_name: business.ownerName, company_name: business.companyName };
    const result = await save('/expert/me/business-registration-info', business.id, body);
    request.onProgress?.({ kind: 'business', index: 0, id: result.id, fileId });
  }
}
