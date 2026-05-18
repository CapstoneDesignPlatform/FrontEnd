import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

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

const WITHDRAWN_BUSINESS_NUMBERS = new Set(["456-78-90123"]);

const allExperts: Expert[] = [
  {
    id: 101,
    memberNumber: "EX-2026-0101",
    company: "케이법무법인",
    rating: 4.8,
    representative: "홍길동",
    phone: "010-1111-1111",
    email: "hong@example.com",
    license: "행정사",
    businessNumber: "123-45-67890",
    grade: "special",
    status: "approved",
    startDate: "2026-03-25",
    endDate: "2027-03-24",
    totalBids: 24,
    completedProjects: 18,
  },
  {
    id: 102,
    memberNumber: "EX-2026-0102",
    company: "프로컨설팅",
    rating: 4.5,
    representative: "강전문",
    phone: "010-2222-2222",
    email: "kang@example.com",
    license: "공인회계사",
    businessNumber: "234-56-78901",
    grade: "business",
    status: "approved",
    startDate: "2026-03-28",
    endDate: "2027-03-27",
    totalBids: 18,
    completedProjects: 12,
  },
  {
    id: 103,
    memberNumber: "EX-2026-0103",
    company: "IT솔루션",
    rating: 4.9,
    representative: "신기술",
    phone: "010-3333-3333",
    email: "shin@example.com",
    license: "경영지도사",
    businessNumber: "345-67-89012",
    grade: "special",
    status: "approved",
    startDate: "2026-03-30",
    endDate: "2027-03-29",
    totalBids: 31,
    completedProjects: 25,
  },
  {
    id: 104,
    memberNumber: "EX-2026-0104",
    company: "믿음행정사사무소",
    rating: 4.2,
    representative: "박행정",
    phone: "010-4444-4444",
    email: "park@example.com",
    license: "세무사",
    businessNumber: "111-22-33333",
    grade: "free",
    status: "approved",
    startDate: "2026-03-15",
    endDate: "2027-03-14",
    totalBids: 15,
    completedProjects: 10,
  },
  {
    id: 105,
    memberNumber: "EX-2026-0105",
    company: "글로벌컨설팅",
    rating: 4.7,
    representative: "이컨설",
    phone: "010-5555-5555",
    email: "lee@example.com",
    license: "행정사",
    businessNumber: "567-89-01234",
    grade: "special",
    status: "approved",
    startDate: "2026-03-20",
    endDate: "2027-03-19",
    totalBids: 42,
    completedProjects: 35,
  },
  {
    id: 106,
    memberNumber: "EX-2026-0106",
    company: "안전소방",
    rating: 4.3,
    representative: "최면허",
    phone: "010-6666-6666",
    email: "choi@example.com",
    license: "소방사",
    businessNumber: "678-90-12345",
    grade: "business",
    status: "approved",
    startDate: "2026-03-22",
    endDate: "2027-03-21",
    totalBids: 12,
    completedProjects: 8,
  },
  {
    id: 1,
    memberNumber: "EX-2026-0001",
    company: "케이법무법인",
    rating: 0,
    representative: "김전문",
    phone: "010-1234-5678",
    email: "expert1@example.com",
    license: "행정사",
    businessNumber: "123-45-11111",
    grade: "free",
    status: "pending",
    totalBids: 0,
    completedProjects: 0,
  },
  {
    id: 2,
    memberNumber: "EX-2026-0002",
    company: "프로컨설팅",
    rating: 0,
    representative: "이기술",
    phone: "010-2345-6789",
    email: "expert2@example.com",
    license: "공인회계사",
    businessNumber: "234-56-22222",
    grade: "free",
    status: "pending",
    totalBids: 0,
    completedProjects: 0,
  },
  {
    id: 201,
    memberNumber: "EX-2026-0201",
    company: "정지법무법인",
    rating: 3.5,
    representative: "김정지",
    phone: "010-9999-0000",
    email: "suspended@example.com",
    license: "행정사",
    businessNumber: "333-33-33333",
    grade: "free",
    status: "suspended",
    totalBids: 5,
    completedProjects: 2,
  },
  {
    id: 202,
    memberNumber: "EX-2026-0202",
    company: "탈퇴컨설팅",
    rating: 3.8,
    representative: "박탈퇴",
    phone: "010-8888-0000",
    email: "withdrawn@example.com",
    license: "세무사",
    businessNumber: "456-78-90123",
    grade: "free",
    status: "withdrawn",
    totalBids: 3,
    completedProjects: 1,
  },
];

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

type StatusFilter = "all" | "approved" | "pending" | "suspended" | "withdrawn";
type GradeFilter = "all" | "special" | "business" | "free";

export function AdminExpertList() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState<
    "representative" | "company" | "phone" | "businessNumber"
  >("representative");

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

  const handleExport = () => {
    exportToExcel(
      "전문가목록",
      [
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
      ],
      filtered.map((e) => [
        e.memberNumber,
        e.company,
        e.rating > 0 ? e.rating.toFixed(1) : "-",
        e.representative,
        e.phone,
        e.email,
        e.license,
        e.businessNumber,
        gradeMap[e.grade],
        e.startDate ?? "-",
        e.endDate ?? "-",
        statusMap[e.status].label,
      ]),
    );
  };

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
            className={`px-3 py-1 rounded border text-xs font-medium transition-colors ${statusFilter === val ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-300 hover:border-teal-400"}`}
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
            className={`px-2 py-0.5 rounded border text-xs font-medium transition-colors ${gradeFilter === val ? "bg-teal-600 text-white border-teal-600" : "bg-white text-gray-600 border-gray-300 hover:border-teal-400"}`}
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

      {/* 탈퇴자 재가입 차단 안내 */}
      <div className="bg-amber-50 border border-amber-200 rounded px-3 py-2 text-xs text-amber-700">
        탈퇴자 재가입 차단: 사업자등록번호 기준으로 탈퇴 이력이 있는 경우
        재가입이 제한됩니다. (차단 등록번호: {WITHDRAWN_BUSINESS_NUMBERS.size}
        건)
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
                      {e.status === "withdrawn" ? (
                        <span className="text-gray-400 text-xs">탈퇴</span>
                      ) : (
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
