import { useState, useEffect } from "react";
import { getAnnouncementList } from "../../../api/admin/clientApi";
import type { AdminAnnouncementSummary } from "../../../api/admin/clientApi";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";

import { downloadAnnouncementListExcel } from "../../../api/admin/excelApi";

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

// 백엔드 상태 → 프론트 상태 매핑
const STATUS_MAP: Record<string, Project["status"]> = {
  BIDDING: "bidding",
  CLOSED: "closed",
  PAID: "paid",
  IN_PROGRESS: "in_progress",
  ASSOCIATION: "association",
  SENT: "sent",
  COMPLETED: "completed",
};

function mapToProject(a: AdminAnnouncementSummary): Project {
  return {
    id: String(a.id),
    code: a.announcementCode,
    title: `${a.industry} - ${a.purpose}`, // 백엔드에 title 없으면 조합
    industry: a.industry,
    company: a.companyName,
    clientName: a.clientName,
    clientType: "member", // TODO: 백엔드에서 isGuest 필드 추가 후 연결
    status: STATUS_MAP[a.status] ?? "bidding",
    bidCount: a.bidCount,
    createdAt: a.createdAt.slice(0, 10),
  };
}

const statusMap: Record<
  Project["status"],
  { label: string; className: string }
> = {
  bidding: { label: "입찰 중", className: "bg-blue-100 text-blue-700" },
  closed: { label: "마감", className: "bg-gray-100 text-gray-700" },
  paid: { label: "전문가 선택", className: "bg-green-100 text-green-700" },
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
  { value: "paid", label: "전문가 선택" },
  { value: "in_progress", label: "진단시작" },
  { value: "association", label: "협회경유" },
  { value: "sent", label: "발송" },
  { value: "completed", label: "완료" },
];

export function AdminProjectList() {
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>("all");
  const [selectedClientType, setSelectedClientType] =
    useState<ClientType>("all");
  const [searchCode, setSearchCode] = useState("");

  useEffect(() => {
    setLoading(true);
    getAnnouncementList()
      .then((res) => setAllProjects(res.data.content.map(mapToProject)))
      .catch(() => setError("데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500">
        불러오는 중...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error}
      </div>
    );

  const filtered = allProjects.filter((p) => {
    if (selectedStatus !== "all" && p.status !== selectedStatus) return false;
    if (selectedClientType !== "all" && p.clientType !== selectedClientType)
      return false;
    if (searchCode && !p.code.toLowerCase().includes(searchCode.toLowerCase()))
      return false;
    return true;
  });

  const handleExport = () => downloadAnnouncementListExcel();
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
                  "의뢰번호",
                  "의뢰인",
                  "대표자",
                  "사업자",
                  "연락처",
                  "구분",
                  "의뢰 내용",
                  "상태",
                  "입찰",
                  "종료상태",
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
                  <td colSpan={11} className="text-center py-8 text-gray-400">
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
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {p.clientName}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {p.company}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                      -
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      -
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${p.clientType === "member" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {p.clientType === "member" ? "회원" : "비회원"}
                      </span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 max-w-[200px] truncate">
                      {p.title}
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
                      -
                    </td>

                    <td className="border-b border-gray-200 px-2 py-1">
                      <Link
                        to={`/admin/projects/${p.code}`}
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
