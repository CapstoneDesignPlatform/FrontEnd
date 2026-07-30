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
  createdAt?: string;
}

function mapStatus(v: string): Expert["status"] {
  if (v === "APPROVED") return "approved";
  if (v === "PENDING") return "pending";
  if (v === "REJECTED") return "suspended";
  return "withdrawn";
}

const statusMap = {
  approved: { label: "정상", className: "bg-green-100 text-green-700" },
  pending: { label: "대기", className: "bg-amber-100 text-amber-700" },
  suspended: { label: "정지", className: "bg-red-100 text-red-700" },
  withdrawn: { label: "탈퇴", className: "bg-gray-100 text-gray-600" },
};
const gradeMap = { special: "스페셜", business: "비즈니스", free: "무료" };
const gradeClass = {
  special: "bg-yellow-100 text-yellow-700",
  business: "bg-blue-100 text-blue-700",
  free: "bg-gray-100 text-gray-600",
};

type StatusFilter = "all" | "approved" | "pending" | "suspended" | "withdrawn";
type GradeFilter = "all" | "special" | "business" | "free";
export function AdminExperts() {
  const [apiExperts, setApiExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState<
    "representative" | "company" | "phone" | "businessNumber"
  >("company");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
          createdAt: e.createdAt?.slice(0, 10),
        }));
        setApiExperts(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const allExperts = apiExperts;

  const counts = {
    total: allExperts.length,
    special: allExperts.filter((e) => e.grade === "special").length,
    business: allExperts.filter((e) => e.grade === "business").length,
    free: allExperts.filter((e) => e.grade === "free").length,
    approved: allExperts.filter((e) => e.status === "approved").length,
    pending: allExperts.filter((e) => e.status === "pending").length,
    suspended: allExperts.filter((e) => e.status === "suspended").length,
    withdrawn: allExperts.filter((e) => e.status === "withdrawn").length,
  };

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
    const joinDate = e.createdAt ?? "";
    if (startDate && joinDate && joinDate < startDate) return false;
    if (endDate && joinDate && joinDate > endDate) return false;
    return true;
  });

  const handleExport = () => downloadExpertListExcel();

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500">
        불러오는 중...
      </div>
    );

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">전문가 회원 관리</h1>
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
      <div className="grid grid-cols-4 gap-4">
        {/* 총 전문가 */}
        <div className="border border-gray-200 rounded-lg bg-white px-5 py-4">
          <p className="text-sm text-gray-500 mb-1">총 전문가</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {counts.total}명
          </p>
          <p className="text-xs text-gray-400">등록된 전체 전문가 수</p>
          <Link to="/admin/experts/list">
            <button className="mt-3 text-sm text-teal-600 border border-teal-300 rounded px-3 py-1 hover:bg-teal-50 w-full">
              전체 목록 보기
            </button>
          </Link>
        </div>

        {/* 등급별 */}
        <div className="border border-gray-200 rounded-lg bg-white px-5 py-4">
          <p className="text-sm text-gray-500 mb-2">등급별</p>
          <table className="w-full">
            <tbody>
              {[
                ["스페셜", counts.special],
                ["비즈니스", counts.business],
                ["무료", counts.free],
              ].map(([label, val]) => (
                <tr key={label as string}>
                  <td className="text-sm text-gray-600 py-0.5">{label}</td>
                  <td className="text-sm font-bold text-right">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 상태별 */}
        <div className="border border-gray-200 rounded-lg bg-white px-5 py-4">
          <p className="text-sm text-gray-500 mb-2">상태별</p>
          <table className="w-full">
            <tbody>
              {[
                ["정상", counts.approved],
                ["대기", counts.pending],
                ["정지", counts.suspended],
                ["탈퇴", counts.withdrawn],
              ].map(([label, val]) => (
                <tr key={label as string}>
                  <td className="text-sm text-gray-600 py-0.5">{label}</td>
                  <td className="text-sm font-bold text-right">{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 승인 대기 중 */}
        <div className="border border-gray-200 rounded-lg bg-white px-5 py-4">
          <p className="text-sm text-gray-500 mb-1">승인 대기 중</p>
          <p className="text-3xl font-bold text-amber-500 mb-1">
            {counts.pending}명
          </p>
          <p className="text-xs text-gray-400">신규 전문가 승인 필요</p>
        </div>
      </div>

      {/* 필터 */}
      <div className="border border-gray-200 rounded bg-gray-50 px-3 py-2 space-y-2">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
              등급
            </span>
            <div className="flex gap-1">
              {(["all", "special", "business", "free"] as GradeFilter[]).map(
                (val) => (
                  <button
                    key={val}
                    onClick={() => setGradeFilter(val)}
                    className={`px-2 py-0.5 rounded border text-xs font-medium transition-colors ${gradeFilter === val ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-300 hover:border-teal-400"}`}
                  >
                    {val === "all" ? "전체" : gradeMap[val]}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
              상태
            </span>
            <div className="flex gap-1">
              {(
                [
                  ["all", "전체"],
                  ["approved", "정상"],
                  ["pending", "대기"],
                  ["suspended", "정지"],
                  ["withdrawn", "탈퇴"],
                ] as [StatusFilter, string][]
              ).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  className={`px-2 py-0.5 rounded border text-xs font-medium transition-colors ${statusFilter === val ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-300 hover:border-teal-400"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1">
            <select
              value={searchType}
              onChange={(e) =>
                setSearchType(e.target.value as typeof searchType)
              }
              className="h-7 text-xs border border-gray-300 rounded px-2 bg-white"
            >
              <option value="company">업체명</option>
              <option value="representative">대표자명</option>
              <option value="phone">연락처</option>
              <option value="businessNumber">사업자등록번호</option>
            </select>
            <Input
              placeholder="검색어 입력"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 text-xs w-36"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
              날짜 조회
            </span>
            <span className="text-xs text-gray-500">신청시작일</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-7 text-xs w-32"
            />
            <span className="text-xs text-gray-400">~</span>
            <span className="text-xs text-gray-500">신청마감일</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-7 text-xs w-32"
            />
          </div>
          <span className="text-xs text-gray-400 ml-auto">
            총 {filtered.length}명
          </span>
        </div>
      </div>

      {/* 테이블 */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "회원번호",
                  "업체명",
                  "평점",
                  "대표자명",
                  "연락처",
                  "이메일",
                  "자격증",
                  "사업자등록번호",
                  "등급",
                  "신청시작일",
                  "신청마감일",
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
                  <td colSpan={13} className="text-center py-8 text-gray-400">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((e, i) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-teal-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"} ${e.status === "withdrawn" ? "opacity-60" : ""}`}
                  >
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                      {e.memberNumber}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {e.company}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                      {e.rating > 0 ? e.rating.toFixed(1) : "-"}
                    </td>
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
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {e.startDate ?? "-"}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {e.endDate ?? "-"}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${statusMap[e.status].className}`}
                      >
                        {statusMap[e.status].label}
                      </span>
                    </td>
                    <td className="border-b border-gray-200 px-2 py-1">
                      <Link
                        to={
                          e.status === "pending"
                            ? `/admin/experts/approval/${e.id}`
                            : `/admin/experts/detail/${e.id}`
                        }
                        className="text-teal-600 hover:underline whitespace-nowrap"
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
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="text-sm px-10 py-2 h-10 font-medium"
        >
          수정
        </Button>
        <Button className="bg-[#009689] hover:bg-[#007d71] text-sm px-10 py-2 h-10 font-medium">
          저장
        </Button>
      </div>
    </div>
  );
}
