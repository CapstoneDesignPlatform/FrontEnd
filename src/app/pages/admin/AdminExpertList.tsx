import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Download, CheckCircle } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

interface Expert {
  id: number;
  name: string;
  email: string;
  phone: string;
  expertise: string;
  company: string;
  status: "approved" | "pending" | "suspended" | "withdrawn";
  approvedAt?: string;
  totalBids: number;
  completedProjects: number;
}

const allExperts: Expert[] = [
  {
    id: 101,
    name: "홍길동",
    email: "hong@example.com",
    phone: "010-1111-1111",
    expertise: "건설업 면허",
    company: "케이법무법인",
    status: "approved",
    approvedAt: "2026-03-25",
    totalBids: 24,
    completedProjects: 18,
  },
  {
    id: 102,
    name: "강전문",
    email: "kang@example.com",
    phone: "010-2222-2222",
    expertise: "전기공사업",
    company: "프로컨설팅",
    status: "approved",
    approvedAt: "2026-03-28",
    totalBids: 18,
    completedProjects: 12,
  },
  {
    id: 103,
    name: "신기술",
    email: "shin@example.com",
    phone: "010-3333-3333",
    expertise: "정보통신공사업",
    company: "IT솔루션",
    status: "approved",
    approvedAt: "2026-03-30",
    totalBids: 31,
    completedProjects: 25,
  },
  {
    id: 104,
    name: "박행정",
    email: "park@example.com",
    phone: "010-4444-4444",
    expertise: "실태 조사",
    company: "믿음행정사사무소",
    status: "approved",
    approvedAt: "2026-03-15",
    totalBids: 15,
    completedProjects: 10,
  },
  {
    id: 105,
    name: "이컨설",
    email: "lee@example.com",
    phone: "010-5555-5555",
    expertise: "건설업 면허",
    company: "글로벌컨설팅",
    status: "approved",
    approvedAt: "2026-03-20",
    totalBids: 42,
    completedProjects: 35,
  },
  {
    id: 106,
    name: "최면허",
    email: "choi@example.com",
    phone: "010-6666-6666",
    expertise: "소방시설공사업",
    company: "안전소방",
    status: "approved",
    approvedAt: "2026-03-22",
    totalBids: 12,
    completedProjects: 8,
  },
  {
    id: 107,
    name: "정법무",
    email: "jung@example.com",
    phone: "010-7777-7777",
    expertise: "의약품도매상",
    company: "헬스케어법무법인",
    status: "approved",
    approvedAt: "2026-03-18",
    totalBids: 9,
    completedProjects: 6,
  },
  {
    id: 108,
    name: "윤서비스",
    email: "yoon@example.com",
    phone: "010-8888-8888",
    expertise: "전기공사업",
    company: "원스톱행정사",
    status: "approved",
    approvedAt: "2026-03-12",
    totalBids: 27,
    completedProjects: 20,
  },
  {
    id: 109,
    name: "조기술",
    email: "jo@example.com",
    phone: "010-9999-9999",
    expertise: "정보통신공사업",
    company: "탑클래스컨설팅",
    status: "approved",
    approvedAt: "2026-03-10",
    totalBids: 33,
    completedProjects: 28,
  },
  {
    id: 110,
    name: "한전문",
    email: "han@example.com",
    phone: "010-1010-1010",
    expertise: "건설업 면허",
    company: "한국건설컨설팅",
    status: "approved",
    approvedAt: "2026-03-08",
    totalBids: 19,
    completedProjects: 14,
  },
  {
    id: 1,
    name: "김전문",
    email: "expert1@example.com",
    phone: "010-1234-5678",
    expertise: "건설업 면허",
    company: "케이법무법인",
    status: "pending",
    totalBids: 0,
    completedProjects: 0,
  },
  {
    id: 2,
    name: "이기술",
    email: "expert2@example.com",
    phone: "010-2345-6789",
    expertise: "전기공사업",
    company: "프로컨설팅",
    status: "pending",
    totalBids: 0,
    completedProjects: 0,
  },
  {
    id: 201,
    name: "김정지",
    email: "suspended@example.com",
    phone: "010-9999-0000",
    expertise: "건설업 면허",
    company: "정지법무법인",
    status: "suspended",
    totalBids: 5,
    completedProjects: 2,
  },
  {
    id: 202,
    name: "박탈퇴",
    email: "withdrawn@example.com",
    phone: "010-8888-0000",
    expertise: "실태 조사",
    company: "탈퇴컨설팅",
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

type StatusFilter = "all" | "approved" | "pending" | "suspended" | "withdrawn";

export function AdminExpertList() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = allExperts.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (search && !e.name.includes(search)) return false;
    return true;
  });

  const handleExport = () => {
    exportToExcel(
      "전문가목록",
      [
        "이름",
        "이메일",
        "연락처",
        "전문분야",
        "소속",
        "상태",
        "총입찰",
        "완료",
        "승인일",
      ],
      filtered.map((e) => [
        e.name,
        e.email,
        e.phone,
        e.expertise,
        e.company,
        statusMap[e.status].label,
        e.totalBids,
        e.completedProjects,
        e.approvedAt ?? "-",
      ]),
    );
  };

  const counts = {
    all: allExperts.length,
    approved: allExperts.filter((e) => e.status === "approved").length,
    pending: allExperts.filter((e) => e.status === "pending").length,
    suspended: allExperts.filter((e) => e.status === "suspended").length,
    withdrawn: allExperts.filter((e) => e.status === "withdrawn").length,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">전체 전문가 목록</h1>
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

      {/* 통계 바 */}
      <div className="flex gap-2 flex-wrap text-xs">
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

      {/* 검색 */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="이름 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 text-xs w-48"
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
                  "이름",
                  "이메일",
                  "연락처",
                  "전문분야",
                  "소속",
                  "상태",
                  "총입찰",
                  "완료",
                  "승인일",
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
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((e, i) => (
                  <tr
                    key={e.id}
                    className={`hover:bg-teal-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-medium whitespace-nowrap">
                      {e.name}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      {e.email}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {e.phone}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {e.expertise}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {e.company}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${statusMap[e.status].className}`}
                      >
                        {statusMap[e.status].label}
                      </span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                      {e.totalBids}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                      {e.completedProjects}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {e.approvedAt ?? "-"}
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
    </div>
  );
}
