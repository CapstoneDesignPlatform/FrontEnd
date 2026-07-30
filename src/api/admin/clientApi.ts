import { userInstance } from "../instance";

export interface AdminClientSummary {
  userId: number;
  name: string;
  email: string;
  companyName: string | null;
  businessNumber: string | null;
  createdAt: string;
}

export interface AdminAnnouncementSummary {
  id: number;
  announcementCode: string;
  companyName: string;
  clientName: string;
  purpose: string;
  industry: string;
  status: string;
  bidCount: number;
  createdAt: string;
}

export const getClientList = async () => {
  const response = await userInstance.get("/admin/clients");
  return response.data;
};

export const getAnnouncementList = async () => {
  const response = await userInstance.get("/admin/announcements");
  return response.data;
};

export const getClientDetail = async (userId: number) => {
  const response = await userInstance.get(`/admin/clients/${userId}`);
  return response.data;
};

export const getAnnouncementsByClient = async (userId: number) => {
  const response = await userInstance.get(
    `/admin/clients/${userId}/announcements`,
  );
  return response.data;
};

export const getAnnouncementDetail = async (announcementCode: string) => {
  const response = await userInstance.get(
    `/admin/announcements/${announcementCode}`,
  );
  return response.data;
};

export const updateAnnouncementStatus = async (
  announcementCode: string,
  status: string,
) => {
  const response = await userInstance.patch(
    `/admin/announcements/${announcementCode}/status`,
    { status },
  );
  return response.data;
};
