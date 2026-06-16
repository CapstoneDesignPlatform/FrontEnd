import { userInstance } from "../instance";

export interface AdminExpertSummary {
  userId: number;
  expertProfileId: number;
  email: string;
  expertField: string;
  verificationStatus: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export interface AdminExpertDetail {
  userId: number;
  expertProfileId: number;
  email: string;
  expertField: string;
  verificationStatus: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface AdminExpertCertificate {
  certificateId: number;
  fileId: number;
  ownerName: string;
  certificateTypeCode: string;
  certificateNumber: string;
  issueDate: string;
  createdAt: string;
}

export interface AdminExpertBusinessInfo {
  businessRegistrationInfoId: number;
  fileId: number;
  businessNumber: string;
  representativeName: string;
  companyName: string;
  createdAt: string;
  updatedAt: string;
}

export const getExpertList = async (page = 0, size = 20) => {
  const response = await userInstance.get("/admin/experts", {
    params: { page, size },
  });
  return response.data;
};

export const getExpertDetail = async (userId: number) => {
  const response = await userInstance.get(`/admin/experts/${userId}`);
  return response.data;
};

export const getExpertCertificates = async (userId: number) => {
  const response = await userInstance.get(
    `/admin/experts/${userId}/certificates`,
  );
  return response.data;
};

export const getExpertBusinessInfo = async (userId: number) => {
  const response = await userInstance.get(
    `/admin/experts/${userId}/business-registration-info`,
  );
  return response.data;
};

export const updateExpertVerificationStatus = async (
  userId: number,
  verificationStatus: string,
  rejectReason?: string,
) => {
  const response = await userInstance.patch(
    `/admin/experts/${userId}/verification-status`,
    {
      verificationStatus,
      rejectReason,
    },
  );
  return response.data;
};
