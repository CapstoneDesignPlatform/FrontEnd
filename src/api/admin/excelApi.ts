import { instance } from "../instance";

const downloadExcel = async (url: string, filename: string) => {
  const response = await instance.get(url, { responseType: "blob" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(new Blob([response.data]));
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadExpertListExcel = () =>
  downloadExcel(
    "/api/admin/excel/experts",
    `전문가목록_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );

export const downloadExpertDetailExcel = (userId: number) =>
  downloadExcel(
    `/api/admin/excel/experts/${userId}`,
    `전문가상세_${userId}_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );

export const downloadClientListExcel = () =>
  downloadExcel(
    "/api/admin/excel/clients",
    `의뢰인목록_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );

export const downloadAnnouncementListExcel = () =>
  downloadExcel(
    "/api/admin/excel/announcements",
    `의뢰현황_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );

export const downloadAnnouncementDetailExcel = (code: string) =>
  downloadExcel(
    `/api/admin/excel/announcements/${code}`,
    `의뢰상세_${code}_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
