import { mockExpertVerificationStatusDto } from "../mocks/expertVerification";
import {
  mapSubmitVerificationRequestToDto,
  mapVerificationStatusDtoToVM,
} from "./expertVerificationMappers";
import type { ExpertVerificationApi } from "./expertApiTypes";

const clone = <T>(value: T): T => structuredClone(value);

export const expertVerificationMockApi: ExpertVerificationApi = {
  async getExpertVerificationStatus(statusOverride) {
    const responseDto = clone(mockExpertVerificationStatusDto);

    responseDto.verification_request.status =
      statusOverride ?? responseDto.verification_request.status;

    return mapVerificationStatusDtoToVM(responseDto);
  },

  async submitExpertVerification(request) {
    const dto = mapSubmitVerificationRequestToDto(request);
    const responseDto = clone(mockExpertVerificationStatusDto);

    responseDto.verification_request = {
      ...responseDto.verification_request,
      status: "PENDING",
      specialty: dto.specialty,
      license_number: request.licenseNumber,
      issue_date: request.issueDate,
      company_name: request.companyName,
      certificates: request.certificates?.map((certificate, index) => ({
        file_id: certificate.fileId ?? index + 1,
        file_name: certificate.fileName,
        holder_name: certificate.holderName,
        issue_date: certificate.issueDate,
        license_number: certificate.licenseNumber,
        certificate_name: certificate.licenseType,
      })),
      business_license: request.businessLicense
        ? {
            business_number: request.businessLicense.businessNumber,
            company_name: request.businessLicense.companyName,
            file_id: request.businessLicense.fileId ?? 100,
            file_name: request.businessLicense.fileName,
            representative_name: request.businessLicense.ownerName,
          }
        : undefined,
      submitted_at: new Date().toISOString().slice(0, 10),
    };

    return mapVerificationStatusDtoToVM(responseDto);
  },
};
