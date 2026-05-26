import { useParams, Link } from "react-router-dom";
import { Download, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import {
  getExpertDetail,
  getExpertCertificates,
  getExpertBusinessInfo,
} from "../../../api/admin/expertApi";
import type {
  AdminExpertDetail as ExpertDetailType,
  AdminExpertCertificate,
  AdminExpertBusinessInfo,
} from "../../../api/admin/expertApi";

export function AdminExpertDetail() {
  const { id } = useParams();
  const userId = Number(id);

  const [apiDetail, setApiDetail] = useState<ExpertDetailType | null>(null);
  const [apiCertificates, setApiCertificates] = useState<
    AdminExpertCertificate[]
  >([]);
  const [apiBusinessInfo, setApiBusinessInfo] =
    useState<AdminExpertBusinessInfo | null>(null);

  useEffect(() => {
    Promise.all([
      getExpertDetail(userId),
      getExpertCertificates(userId),
      getExpertBusinessInfo(userId).catch(() => ({ data: null })),
    ])
      .then(([detailRes, certRes, bizRes]) => {
        setApiDetail(detailRes.data);
        setApiCertificates(certRes.data ?? []);
        setApiBusinessInfo(bizRes.data);
      })
      .catch(() => {});
  }, [userId]);

  const [statusHistory, setStatusHistory] = useState([
    {
      date: "2026-03-25 10:00",
      content: "전문가 승인 완료",
      status: "정상",
      grade: "스페셜",
      startDate: "2026-03-25",
      endDate: "2027-03-24",
    },
    {
      date: "2026-02-15 14:30",
      content: "회원 가입",
      status: "승인대기",
      grade: "-",
      startDate: "-",
      endDate: "-",
    },
  ]);

  const statusLabelMap: Record<string, string> = {
    APPROVED: "정상",
    PENDING: "승인대기",
    REJECTED: "정지",
    NOT_SUBMITTED: "탈퇴",
  };

  const expert = {
    memberNumber: apiDetail
      ? `EX-${String(apiDetail.userId).padStart(6, "0")}`
      : "EX-2026-0101",
    company: apiBusinessInfo?.companyName ?? "케이법무법인",
    representative: apiBusinessInfo?.representativeName ?? "홍길동",
    phone: "-",
    email: apiDetail?.email ?? "hong@example.com",
    license: apiDetail?.expertField ?? "행정사",
    businessNumber: apiBusinessInfo?.businessNumber ?? "123-45-67890",
    address: "-",
    currentStatus: apiDetail
      ? (statusLabelMap[apiDetail.verificationStatus] ??
        apiDetail.verificationStatus)
      : "정상",
    certificateFile:
      apiCertificates.length > 0
        ? `${apiCertificates[0].certificateTypeCode} (${apiCertificates[0].ownerName})`
        : "",
    businessFile: apiBusinessInfo
      ? `${apiBusinessInfo.companyName} 사업자등록증`
      : "",
  };

  const statusBadgeClass: Record<string, string> = {
    정상: "bg-green-100 text-green-700",
    승인대기: "bg-amber-100 text-amber-700",
    정지: "bg-red-100 text-red-700",
    탈퇴: "bg-gray-100 text-gray-600",
  };

  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();
      const ws1 = XLSX.utils.aoa_to_sheet([
        ["항목", "내용"],
        ["회원번호", expert.memberNumber],
        ["업체명", expert.company],
        ["대표자명", expert.representative],
        ["연락처", expert.phone],
        ["이메일", expert.email],
        ["자격증", expert.license],
        ["사업자등록번호", expert.businessNumber],
        ["주소", expert.address],
        ["현재상태", expert.currentStatus],
      ]);
      ws1["!cols"] = [{ wch: 16 }, { wch: 50 }];
      XLSX.utils.book_append_sheet(wb, ws1, "전문가정보");

      const ws2 = XLSX.utils.aoa_to_sheet([
        ["일시", "내용", "현재상태", "등급", "신청시작일", "신청마감일"],
        ...statusHistory.map((h) => [
          h.date,
          h.content,
          h.status,
          h.grade,
          h.startDate,
          h.endDate,
        ]),
      ]);
      ws2["!cols"] = [18, 25, 10, 10, 12, 12].map((wch) => ({ wch }));
      XLSX.utils.book_append_sheet(wb, ws2, "현황이력");

      XLSX.writeFile(
        wb,
        `전문가회원카드_${expert.representative}_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/experts/list">
              <ArrowLeft className="h-4 w-4 mr-1" />
              전문가 목록으로
            </Link>
          </Button>
          <h1 className="text-xl font-bold">전문가 회원카드</h1>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1 text-xs"
          onClick={handleExport}
        >
          <Download className="h-3 w-3" />
          Excel 다운로드
        </Button>
      </div>

      {/* 구분 + 현재상태 */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 flex justify-between items-center">
          <span>구분</span>
          <span className="font-normal text-gray-500">
            현재상태:{" "}
            <span
              className={`px-1.5 py-0.5 rounded text-xs font-semibold ${statusBadgeClass[expert.currentStatus] ?? "bg-gray-100 text-gray-600"}`}
            >
              {expert.currentStatus}
            </span>
          </span>
        </div>
        <table className="w-full text-xs border-collapse">
          <tbody>
            <tr className="bg-white">
              <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 w-28 whitespace-nowrap">
                회원번호
              </td>
              <td className="border-b border-gray-200 px-3 py-1.5 font-mono">
                {expert.memberNumber}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                업체명
              </td>
              <td className="border-b border-gray-200 px-3 py-1.5">
                {expert.company}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                대표자명
              </td>
              <td className="border-b border-gray-200 px-3 py-1.5">
                {expert.representative}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                연락처
              </td>
              <td className="border-b border-gray-200 px-3 py-1.5">
                {expert.phone}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                이메일
              </td>
              <td className="border-b border-gray-200 px-3 py-1.5">
                {expert.email}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                자격증
              </td>
              <td className="border-b border-gray-200 px-3 py-1.5">
                {expert.license}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                사업자등록번호
              </td>
              <td className="border-b border-gray-200 px-3 py-1.5 font-mono">
                {expert.businessNumber}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                주소
              </td>
              <td className="px-3 py-1.5">{expert.address}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 현황 이력 */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
          현황
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {[
                  "일시",
                  "내용 입력",
                  "현재상태",
                  "등급",
                  "신청 시작일",
                  "신청 마감일",
                ].map((h) => (
                  <th
                    key={h}
                    className="border-b border-r border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 whitespace-nowrap last:border-r-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {statusHistory.map((item, index) => (
                <tr
                  key={index}
                  className={`hover:bg-teal-50 transition-colors ${index % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1">
                    {item.content}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${statusBadgeClass[item.status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                    {item.grade}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                    {item.startDate}
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1 whitespace-nowrap">
                    {item.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* 탈퇴 해지 버튼 - 탈퇴 회원만 표시 */}
      {expert.currentStatus === "탈퇴" && (
        <div className="flex justify-end">
          <Button
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-6"
            onClick={() => {
              if (
                confirm("탈퇴를 해지하고 재가입 가능 상태로 변경하시겠습니까?")
              ) {
                alert("탈퇴 해지 처리되었습니다. (API 연동 예정)");
              }
            }}
          >
            탈퇴 해지 (재가입 가능)
          </Button>
        </div>
      )}

      {/* 첨부파일 */}
      {/* 첨부파일 */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
          첨부파일
        </div>
        <table className="w-full text-xs border-collapse">
          <tbody>
            <tr className="bg-white">
              <td className="border-b border-r border-gray-200 px-3 py-2 font-semibold text-gray-600 w-28 whitespace-nowrap">
                자격증
              </td>
              <td className="border-b border-gray-200 px-3 py-2">
                {expert.certificateFile ? (
                  <button
                    className="text-teal-600 hover:underline flex items-center gap-1"
                    onClick={() => alert("파일 다운로드 기능 연동 예정입니다.")}
                  >
                    <Download className="h-3 w-3" />
                    {expert.certificateFile}
                  </button>
                ) : (
                  <span className="text-gray-400">첨부파일 없음</span>
                )}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border-r border-gray-200 px-3 py-2 font-semibold text-gray-600 whitespace-nowrap">
                사업자등록증
              </td>
              <td className="px-3 py-2">
                {expert.businessFile ? (
                  <button
                    className="text-teal-600 hover:underline flex items-center gap-1"
                    onClick={() => alert("파일 다운로드 기능 연동 예정입니다.")}
                  >
                    <Download className="h-3 w-3" />
                    {expert.businessFile}
                  </button>
                ) : (
                  <span className="text-gray-400">첨부파일 없음</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
