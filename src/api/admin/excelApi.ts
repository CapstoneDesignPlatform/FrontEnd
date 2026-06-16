import { userInstance } from "../instance";

const downloadExcel = async (url: string, filename: string) => {
  const response = await userInstance.get(url, {
    responseType: "blob",
    validateStatus: () => true,
  });

  const contentType = response.headers["content-type"] ?? "";

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url2 = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url2;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url2);
};

export const downloadExpertListExcel = () =>
  downloadExcel(
    "/admin/excel/experts",
    `전문가목록_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );

export const downloadExpertDetailExcel = (userId: number) =>
  downloadExcel(
    `/admin/excel/experts/${userId}`,
    `전문가상세_${userId}_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );

export const downloadClientListExcel = () =>
  downloadExcel(
    "/admin/excel/clients",
    `의뢰인목록_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );

export const downloadAnnouncementListExcel = () =>
  downloadExcel(
    "/admin/excel/announcements",
    `의뢰현황_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );

export const downloadAnnouncementDetailExcel = (code: string) =>
  downloadExcel(
    `/admin/excel/announcements/${code}`,
    `의뢰상세_${code}_${new Date().toISOString().slice(0, 10)}.xlsx`,
  );
