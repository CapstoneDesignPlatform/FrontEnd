import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

type ProjectStatus =
  | "all"
  | "bidding"
  | "closed"
  | "paid"
  | "in_progress"
  | "association"
  | "sent"
  | "completed";
type ClientType = "all" | "member" | "guest";

interface Project {
  id: string;
  code: string;
  title: string;
  industry: string;
  company: string;
  clientName: string;
  clientType: "member" | "guest";
  status:
    | "bidding"
    | "closed"
    | "paid"
    | "in_progress"
    | "association"
    | "sent"
    | "completed";
  bidCount: number;
  createdAt: string;
}

const allProjects: Project[] = [
  {
    id: "1",
    code: "REQ-L5X9K2M",
    title: "건설업 일반건설업(토목공사업) 면허 취득",
    industry: "건설업",
    company: "(주)대한건설",
    clientName: "김철수",
    clientType: "member",
    status: "bidding",
    bidCount: 8,
    createdAt: "2026-04-05",
  },
  {
    id: "2",
    code: "REQ-M3P7N1K",
    title: "제조업 실태 조사",
    industry: "실태 조사",
    company: "한국제조(주)",
    clientName: "이영희",
    clientType: "guest",
    status: "closed",
    bidCount: 5,
    createdAt: "2026-04-04",
  },
  {
    id: "3",
    code: "REQ-K9L2M5P",
    title: "전기공사업 면허 신청 대행",
    industry: "전기공사업",
    company: "전기산업(주)",
    clientName: "박민수",
    clientType: "member",
    status: "paid",
    bidCount: 12,
    createdAt: "2026-04-03",
  },
  {
    id: "4",
    code: "REQ-N7M4K1L",
    title: "정보통신공사업 등록",
    industry: "정보통신공사업",
    company: "(주)IT솔루션",
    clientName: "정수현",
    clientType: "member",
    status: "in_progress",
    bidCount: 3,
    createdAt: "2026-04-02",
  },
  {
    id: "5",
    code: "REQ-P2K9M3L",
    title: "소방시설공사업 면허",
    industry: "소방시설공사업",
    company: "안전소방(주)",
    clientName: "최영수",
    clientType: "guest",
    status: "association",
    bidCount: 7,
    createdAt: "2026-04-01",
  },
  {
    id: "6",
    code: "REQ-L1M8K5N",
    title: "의약품도매상 허가",
    industry: "의약품도매상",
    company: "헬스케어(주)",
    clientName: "강민지",
    clientType: "member",
    status: "sent",
    bidCount: 2,
    createdAt: "2026-03-31",
  },
  {
    id: "7",
    code: "REQ-K5M2L9P",
    title: "건설업 전문건설업(실내건축공사업) 면허",
    industry: "건설업",
    company: "인테리어건설(주)",
    clientName: "윤성호",
    clientType: "member",
    status: "completed",
    bidCount: 10,
    createdAt: "2026-03-30",
  },
  {
    id: "8",
    code: "REQ-M9L3K7N",
    title: "기업 자본금 변동 진단",
    industry: "기타",
    company: "(주)글로벌무역",
    clientName: "임지연",
    clientType: "guest",
    status: "bidding",
    bidCount: 4,
    createdAt: "2026-03-29",
  },
];

const statusMap: Record<
  Project["status"],
  { label: string; className: string }
> = {
  bidding: { label: "입찰 중", className: "bg-blue-100 text-blue-700" },
  closed: { label: "마감", className: "bg-gray-100 text-gray-700" },
  paid: { label: "결제", className: "bg-green-100 text-green-700" },
  in_progress: {
    label: "진단시작",
    className: "bg-yellow-100 text-yellow-700",
  },
  association: {
    label: "협회경유",
    className: "bg-purple-100 text-purple-700",
  },
  sent: { label: "발송", className: "bg-orange-100 text-orange-700" },
  completed: { label: "완료", className: "bg-blue-100 text-blue-700" },
};

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "bidding", label: "입찰 중" },
  { value: "closed", label: "마감" },
  { value: "paid", label: "결제" },
  { value: "in_progress", label: "진단시작" },
  { value: "association", label: "협회경유" },
  { value: "sent", label: "발송" },
  { value: "completed", label: "완료" },
];

export function AdminProjectList() {
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>("all");
  const [selectedClientType, setSelectedClientType] =
    useState<ClientType>("all");
  const [searchCode, setSearchCode] = useState("");

  const filtered = allProjects.filter((p) => {
    if (selectedStatus !== "all" && p.status !== selectedStatus) return false;
    if (selectedClientType !== "all" && p.clientType !== selectedClientType)
      return false;
    if (searchCode && !p.code.toLowerCase().includes(searchCode.toLowerCase()))
      return false;
    return true;
  });

  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();

      // 시트1: 현재 필터 적용된 목록
      const ws1 = XLSX.utils.aoa_to_sheet([
        [
          "의뢰코드",
          "의뢰명",
          "업종",
          "기업명",
          "의뢰인",
          "구분",
          "상태",
          "입찰수",
          "등록일",
        ],
        ...filtered.map((p) => [
          p.code,
          p.title,
          p.industry,
          p.company,
          p.clientName,
          p.clientType === "member" ? "회원" : "비회원",
          statusMap[p.status].label,
          p.bidCount,
          p.createdAt,
        ]),
      ]);
      ws1["!cols"] = [20, 30, 15, 20, 10, 8, 10, 8, 12].map((wch) => ({ wch }));
      XLSX.utils.book_append_sheet(wb, ws1, "의뢰현황목록");

      // 시트2: 상태별 집계
      const statusSummary = statusOptions
        .filter((s) => s.value !== "all")
        .map((s) => [
          s.label,
          allProjects.filter((p) => p.status === s.value).length,
          allProjects.filter(
            (p) => p.status === s.value && p.clientType === "member",
          ).length,
          allProjects.filter(
            (p) => p.status === s.value && p.clientType === "guest",
          ).length,
          allProjects
            .filter((p) => p.status === s.value)
            .reduce((sum, p) => sum + p.bidCount, 0),
        ]);
      const ws2 = XLSX.utils.aoa_to_sheet([
        ["상태", "건수", "회원", "비회원", "총입찰수"],
        ...statusSummary,
        [
          "합계",
          allProjects.length,
          allProjects.filter((p) => p.clientType === "member").length,
          allProjects.filter((p) => p.clientType === "guest").length,
          allProjects.reduce((sum, p) => sum + p.bidCount, 0),
        ],
      ]);
      ws2["!cols"] = [12, 8, 8, 8, 10].map((wch) => ({ wch }));
      XLSX.utils.book_append_sheet(wb, ws2, "상태별집계");

      XLSX.writeFile(
        wb,
        `의뢰현황_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    });
  };

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">의뢰현황 조회</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            모든 의뢰 의뢰를 확인하고 관리합니다.
          </p>
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

      {/* 통계 바 */}
      <div className="flex gap-2 flex-wrap text-xs">
        {statusOptions.map((s) => {
          const count =
            s.value === "all"
              ? allProjects.length
              : allProjects.filter((p) => p.status === s.value).length;
          return (
            <button
              key={s.value}
              onClick={() => setSelectedStatus(s.value)}
              className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${selectedStatus === s.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      {/* 필터 바 */}
      <div className="flex gap-2 items-center flex-wrap">
        <div className="flex gap-1">
          {(
            [
              { value: "all", label: "전체" },
              { value: "member", label: "회원" },
              { value: "guest", label: "비회원" },
            ] as { value: ClientType; label: string }[]
          ).map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedClientType(t.value)}
              className={`px-2 py-0.5 rounded border text-xs transition-colors ${selectedClientType === t.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <Input
          placeholder="의뢰 코드 검색"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          className="h-7 text-xs w-52"
        />
        <span className="text-xs text-gray-400 ml-auto">
          총 {filtered.length}건
        </span>
      </div>

      {/* 테이블 */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "의뢰코드",
                  "의뢰명",
                  "업종",
                  "기업명",
                  "의뢰인",
                  "구분",
                  "상태",
                  "입찰수",
                  "등록일",
                  "상세",
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-8 text-gray-400">
                    조건에 맞는 의뢰가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono whitespace-nowrap">
                      {p.code}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 max-w-[200px] truncate">
                      {p.title}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {p.industry}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {p.company}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      {p.clientName}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${p.clientType === "member" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {p.clientType === "member" ? "회원" : "비회원"}
                      </span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${statusMap[p.status].className}`}
                      >
                        {statusMap[p.status].label}
                      </span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                      {p.bidCount}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {p.createdAt}
                    </td>
                    <td className="border-b border-gray-200 px-2 py-1">
                      <Link
                        to={`/admin/projects/${p.id}`}
                        className="text-blue-600 hover:underline whitespace-nowrap"
                      >
                        상세 →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
