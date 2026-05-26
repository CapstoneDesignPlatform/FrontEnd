import type {
  ExpertCertificate,
  ExpertVerificationFile,
  ExpertVerificationStatusResponseDto,
} from "../types/expertVerification";

const mockExpertVerificationProfile = {
  expertProfileId: 1,
  userName: "전문가",
  companyName: "케이법무법인",
  licenseType: "경영지도사",
  licenseNumber: "EXP-2026-001",
};

export const mockExpertVerificationProfileId =
  mockExpertVerificationProfile.expertProfileId;

export const mockExpertVerificationStatusDto: ExpertVerificationStatusResponseDto = {
  verification_request: {
    id: 1,
    expert_profile_id: mockExpertVerificationProfile.expertProfileId,
    status: "NOT_APPLIED",
    specialty: mockExpertVerificationProfile.licenseType,
    license_number: mockExpertVerificationProfile.licenseNumber,
    issue_date: "2020-03-15",
    company_name: mockExpertVerificationProfile.companyName,
    certificates: [
      {
        certificate_name: mockExpertVerificationProfile.licenseType,
        license_number: mockExpertVerificationProfile.licenseNumber,
        issue_date: "2020-03-15",
        holder_name: mockExpertVerificationProfile.userName,
        file_name: "certificate.pdf",
      },
    ],
    business_license: {
      business_number: "123-45-67890",
      owner_name: mockExpertVerificationProfile.userName,
      company_name: mockExpertVerificationProfile.companyName,
      file_name: "business-license.pdf",
    },
    rejected_reason:
      "제출한 자격증 사본의 식별 정보가 흐릿합니다. 선명한 파일로 다시 제출해주세요.",
  },
};

export const mockExpertCertificatesDto: ExpertCertificate[] = [
  {
    id: 1,
    expertProfileId: mockExpertVerificationProfile.expertProfileId,
    certificateType: "경영지도사",
    certificateNumber: "EXP-2026-001",
    issueDate: "2020-03-15",
    fileId: 1,
  },
];

export const mockExpertVerificationFilesDto: ExpertVerificationFile[] = [
  {
    id: 1,
    verificationRequestId: mockExpertVerificationStatusDto.verification_request.id ?? 0,
    fileId: 1,
    fileName: "certificate.pdf",
    fileType: "LICENSE",
    uploadedAt: "2026-04-05 10:30",
  },
  {
    id: 2,
    verificationRequestId: mockExpertVerificationStatusDto.verification_request.id ?? 0,
    fileId: 2,
    fileName: "business-license.pdf",
    fileType: "BUSINESS_LICENSE",
    uploadedAt: "2026-04-05 10:31",
  },
];
