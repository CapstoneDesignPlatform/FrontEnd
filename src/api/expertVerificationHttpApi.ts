import type {
  RegisterBusinessRegistrationRequestDto,
  RegisterBusinessRegistrationResponseDto,
  RegisterCertificateRequestDto,
  RegisterCertificateResponseDto,
  ExpertVerificationStatusResponseDto,
  SubmitExpertVerificationRequest,
  UploadFileResponseDto,
  VerificationFilePurpose,
} from "../types/expertVerification";
import { apiClient } from "./apiClient";
import {
  mapSubmitVerificationRequestToDto,
  mapVerificationStatusDtoToVM,
} from "./expertVerificationMappers";
import type { ExpertVerificationApi } from "./expertApiTypes";

function mapCertificateNameToBackend(value: string) {
  return value === "경영지도사(재무관리)" ? "경영지도사" : value;
}

async function uploadVerificationFile(
  file: File,
  purpose: VerificationFilePurpose,
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<UploadFileResponseDto>("/files", {
    body: formData,
    query: { purpose },
  });

  return response.file.id;
}

function getFileId(
  requestFile: File | null | undefined,
  existingFileId: number | undefined,
  purpose: VerificationFilePurpose,
) {
  if (requestFile) {
    return uploadVerificationFile(requestFile, purpose);
  }

  if (existingFileId) {
    return Promise.resolve(existingFileId);
  }

  return Promise.reject(new Error("인증 파일 정보가 없습니다."));
}

async function registerCertificate(
  certificate: NonNullable<SubmitExpertVerificationRequest["certificates"]>[number],
) {
  const fileId = await getFileId(certificate.file, certificate.fileId, "CERTIFICATE");
  const payload: RegisterCertificateRequestDto = {
    certificate_name: mapCertificateNameToBackend(certificate.licenseType),
    certificate_number: certificate.licenseNumber,
    expiry_date: certificate.expiryDate,
    file_id: fileId,
    issue_date: certificate.issueDate,
    owner_name: certificate.holderName,
  };

  await apiClient.post<RegisterCertificateResponseDto>(
    "/expert/me/certificates",
    { body: payload },
  );
}

async function registerBusinessRegistrationInfo(
  businessLicense: NonNullable<SubmitExpertVerificationRequest["businessLicense"]>,
) {
  const fileId = await getFileId(
    businessLicense.file,
    businessLicense.fileId,
    "BUSINESS_REGISTRATION",
  );
  const payload: RegisterBusinessRegistrationRequestDto = {
    business_number: businessLicense.businessNumber,
    company_name: businessLicense.companyName,
    file_id: fileId,
    representative_name: businessLicense.ownerName,
  };

  await apiClient.post<RegisterBusinessRegistrationResponseDto>(
    "/expert/me/business-registration-info",
    { body: payload },
  );
}

async function registerVerificationAssets(request: SubmitExpertVerificationRequest) {
  const certificates = request.certificates ?? [];

  await Promise.all(certificates.map(registerCertificate));

  if (request.businessLicense) {
    await registerBusinessRegistrationInfo(request.businessLicense);
  }
}

async function fetchExpertVerificationStatus() {
  const response = await apiClient.get<ExpertVerificationStatusResponseDto>(
    "/expert/me/verification-status",
  );

  return mapVerificationStatusDtoToVM(response);
}

export const expertVerificationHttpApi: ExpertVerificationApi = {
  async getExpertVerificationStatus() {
    return fetchExpertVerificationStatus();
  },

  async submitExpertVerification(request) {
    await registerVerificationAssets(request);
    await apiClient.post<void>("/expert/me/verification-requests", {
      body: mapSubmitVerificationRequestToDto(request),
    });

    return fetchExpertVerificationStatus();
  },
};
