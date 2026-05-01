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
      license_type: dto.license_type,
      license_number: dto.license_number,
      issue_date: dto.issue_date,
      company_name: dto.company_name,
      portfolio: dto.portfolio,
      certificates: dto.certificates,
      business_license: dto.business_license,
      submitted_at: new Date().toISOString().slice(0, 10),
    };

    return mapVerificationStatusDtoToVM(responseDto);
  },
};
