import { useParams, Link } from "react-router-dom";
import { Download, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import { downloadExpertDetailExcel } from "../../../api/admin/excelApi";
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

  const statusLabelMap: Record<string, string> = {
    APPROVED: "정상",
    PENDING: "승인대기",
    REJECTED: "정지",
    NOT_SUBMITTED: "탈퇴",
  };

  const currentStatus = apiDetail
    ? (statusLabelMap[apiDetail.verificationStatus] ??
      apiDetail.verificationStatus)
    : "-";

  const statusBadgeClass: Record<string, string> = {
    정상: "bg-green-100 text-green-700",
    승인대기: "bg-amber-100 text-amber-700",
    정지: "bg-red-100 text-red-700",
    탈퇴: "bg-gray-100 text-gray-600",
  };

  const cert = apiCertificates[0];

  const attachments = [
    ...apiCertificates.map((c) => ({
      name: `${c.certificateTypeCode}_${c.ownerName}.pdf`,
      type: "자격증",
      size: "-",
      uploadedAt: "-",
      fileId: c.fileId,
    })),
    ...(apiBusinessInfo
      ? [
          {
            name: `${apiBusinessInfo.companyName}_사업자등록증.pdf`,
            type: "사업자등록증",
            size: "-",
            uploadedAt: "-",
          },
        ]
      : []),
  ];

  const handleExport = () => downloadExpertDetailExcel(userId);

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
          <h1 className="text-xl font-bold">
            {apiBusinessInfo?.representativeName ?? "-"} 전문가 회원카드
          </h1>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadgeClass[currentStatus] ?? "bg-gray-100 text-gray-600"}`}
          >
            {currentStatus}
          </span>
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

      {/* 기본 정보 요약 */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <table className="w-full text-xs border-collapse">
          <tbody>
            <tr className="bg-gray-50">
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-24">
                이름
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5">
                {apiBusinessInfo?.representativeName ?? "-"}
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-24">
                신청일
              </td>
              <td className="border-b border-gray-300 px-3 py-1.5">-</td>
            </tr>
            <tr className="bg-white">
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                이메일
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5">
                {apiDetail?.email ?? "-"}
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                연락처
              </td>
              <td className="border-b border-gray-300 px-3 py-1.5">-</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                전문분야
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5">
                {apiDetail?.expertField ?? "-"}
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                상호
              </td>
              <td className="border-b border-gray-300 px-3 py-1.5">
                {apiBusinessInfo?.companyName ?? "-"}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                휴대전화
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5">
                -
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                사업자번호
              </td>
              <td className="border-b border-gray-300 px-3 py-1.5 font-mono">
                {apiBusinessInfo?.businessNumber ?? "-"}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                주소
              </td>
              <td colSpan={3} className="px-3 py-1.5">
                -
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* 전문가 인증 정보 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 border-b border-gray-300">
              전문가 인증 정보
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 w-28 whitespace-nowrap">
                    면허 종류
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    {cert?.certificateTypeCode ?? "-"}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 w-28 whitespace-nowrap">
                    면허 번호
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5 font-mono">
                    -
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    발급일
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    -
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    만료일
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">-</td>
                </tr>

                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    직책
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    -
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    휴대전화
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">-</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    회사 주소
                  </td>
                  <td colSpan={3} className="px-3 py-1.5">
                    -
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 소개글 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 border-b border-gray-300">
              소개글
            </div>
            <div className="px-3 py-2 text-xs text-gray-700 bg-white min-h-[48px]">
              -
            </div>
          </div>

          {/* 첨부 서류 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 border-b border-gray-300">
              첨부 서류 (총 {attachments.length}개)
            </div>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {["파일명", "종류", "크기", "업로드일시", "다운로드"].map(
                    (h) => (
                      <th
                        key={h}
                        className="border-b border-r border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 whitespace-nowrap last:border-r-0"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {attachments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      첨부파일 없음
                    </td>
                  </tr>
                ) : (
                  attachments.map((f, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="border-b border-r border-gray-200 px-2 py-1">
                        {f.name}
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                        {f.type}
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                        {f.size}
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                        {f.uploadedAt}
                      </td>
                      <td className="border-b border-gray-200 px-2 py-1">
                        <button
                          className="text-teal-600 hover:underline"
                          onClick={() =>
                            alert("파일 다운로드 기능 연동 예정입니다.")
                          }
                        >
                          다운로드
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 우측: 탈퇴 해지 버튼 */}
        <div className="space-y-4">
          {currentStatus === "탈퇴" && (
            <div className="flex justify-end">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs px-6"
                onClick={() => {
                  if (
                    confirm(
                      "탈퇴를 해지하고 재가입 가능 상태로 변경하시겠습니까?",
                    )
                  ) {
                    alert("탈퇴 해지 처리되었습니다. (API 연동 예정)");
                  }
                }}
              >
                탈퇴 해지 (재가입 가능)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
