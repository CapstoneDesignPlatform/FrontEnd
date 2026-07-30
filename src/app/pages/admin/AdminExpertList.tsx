import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";
import { getExpertList } from "../../../api/admin/expertApi";
import { downloadExpertListExcel } from "../../../api/admin/excelApi";

interface Expert {
  id: number;
  memberNumber: string;
  company: string;
  rating: number;
  representative: string;
  phone: string;
  email: string;
  license: string;
  businessNumber: string;
  grade: "special" | "business" | "free";
  status: "approved" | "pending" | "suspended" | "withdrawn";
  startDate?: string;
  endDate?: string;
  totalBids: number;
  completedProjects: number;
}

const statusMap = {
  approved: { label: "정상", className: "bg-green-100 text-green-700" },
  pending: { label: "승인대기", className: "bg-amber-100 text-amber-700" },
  suspended: { label: "정지", className: "bg-red-100 text-red-700" },
  withdrawn: { label: "탈퇴", className: "bg-gray-100 text-gray-600" },
};

const gradeMap = { special: "스페셜", business: "비즈니스", free: "무료" };
const gradeClass = {
  special: "bg-yellow-100 text-yellow-700",
  business: "bg-blue-100 text-blue-700",
  free: "bg-gray-100 text-gray-600",
};

// verificationStatus → status 변환
function mapStatus(v: string): Expert["status"] {
  if (v === "APPROVED") return "approved";
  if (v === "PENDING") return "pending";
  if (v === "REJECTED") return "suspended";
  return "withdrawn";
}

type StatusFilter = "all" | "approved" | "pending" | "suspended" | "withdrawn";
type GradeFilter = "all" | "special" | "business" | "free";

export function AdminExpertList() {
  const [allExperts, setAllExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState<
    "representative" | "company" | "phone" | "businessNumber"
  >("representative");

  useEffect(() => {
    getExpertList()
      .then((res) => {
        const mapped: Expert[] = res.data.content.map((e: any) => ({
          id: e.userId,
          memberNumber: `EX-${String(e.userId).padStart(6, "0")}`,
          company: "-",
          rating: 0,
          representative: "-",
          phone: "-",
          email: e.email,
          license: e.expertField,
          businessNumber: "-",
          grade: "free" as const,
          status: mapStatus(e.verificationStatus),
          startDate: undefined,
          endDate: undefined,
          totalBids: 0,
          completedProjects: 0,
        }));
        setAllExperts(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = allExperts.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (gradeFilter !== "all" && e.grade !== gradeFilter) return false;
    if (search) {
      const target =
        searchType === "representative"
          ? e.representative
          : searchType === "company"
            ? e.company
            : searchType === "phone"
              ? e.phone
              : e.businessNumber;
      if (!target.includes(search)) return false;
    }
    return true;
  });

  const counts = {
    all: allExperts.length,
    approved: allExperts.filter((e) => e.status === "approved").length,
    pending: allExperts.filter((e) => e.status === "pending").length,
    suspended: allExperts.filter((e) => e.status === "suspended").length,
    withdrawn: allExperts.filter((e) => e.status === "withdrawn").length,
  };
  const gradeCounts = {
    all: allExperts.length,
    special: allExperts.filter((e) => e.grade === "special").length,
    business: allExperts.filter((e) => e.grade === "business").length,
    free: allExperts.filter((e) => e.grade === "free").length,
  };

  const handleExport = () => downloadExpertListExcel();

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500">
        불러오는 중...
      </div>
    );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">전문가 회원현황 조회</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            등록된 모든 전문가를 확인하고 관리합니다.
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

      {/* 상태 필터 */}
      <div className="flex gap-2 flex-wrap">
        {(
          [
            ["all", "전체"],
            ["approved", "정상"],
            ["pending", "승인대기"],
            ["suspended", "정지"],
            ["withdrawn", "탈퇴"],
          ] as [StatusFilter, string][]
        ).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setStatusFilter(val)}
            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${statusFilter === val ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
          >
            {label} ({counts[val]})
          </button>
        ))}
      </div>

      {/* 등급 필터 */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-xs font-medium text-gray-600">등급</span>
        {(
          [
            ["all", "전체"],
            ["special", "스페셜"],
            ["business", "비즈니스"],
            ["free", "무료"],
          ] as [GradeFilter, string][]
        ).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setGradeFilter(val)}
            className={`px-2 py-0.5 rounded border text-xs font-medium transition-colors ${gradeFilter === val ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
          >
            {label} ({gradeCounts[val] ?? allExperts.length})
          </button>
        ))}
      </div>

      {/* 검색 */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as typeof searchType)}
          className="h-7 text-xs border border-gray-300 rounded px-2 bg-white"
        >
          <option value="representative">대표자명</option>
          <option value="company">업체명</option>
          <option value="phone">연락처</option>
          <option value="businessNumber">사업자등록번호</option>
        </select>
        <Input
          placeholder="검색어 입력"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 text-xs w-44"
        />
        <span className="text-xs text-gray-400 ml-auto">
          총 {filtered.length}명
        </span>
      </div>

      {/* 테이블 */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "대표자명",
                  "연락처",
                  "이메일",
                  "자격증",
                  "사업자등록번호",
                  "등급",
                  "상태",
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
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((e, i) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"} ${e.status === "withdrawn" ? "opacity-60" : ""}`}
                  >
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {e.representative}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {e.phone}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      {e.email}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {e.license}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                      {e.businessNumber}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${gradeClass[e.grade]}`}
                      >
                        {gradeMap[e.grade]}
                      </span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${statusMap[e.status].className}`}
                      >
                        {statusMap[e.status].label}
                      </span>
                    </td>
                    <td className="border-b border-gray-200 px-2 py-1">
                      {e.status === "withdrawn" ? (
                        <span className="text-gray-400 text-xs">탈퇴</span>
                      ) : (
                        <Link
                          to={
                            e.status === "pending"
                              ? `/admin/experts/approval/${e.id}`
                              : `/admin/experts/detail/${e.id}`
                          }
                          className="text-blue-600 hover:underline whitespace-nowrap"
                        >
                          상세 →
                        </Link>
                      )}
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
