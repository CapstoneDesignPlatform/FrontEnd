import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

interface Client {
  id: number;
  name: string;
  company: string;
  businessNumber: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "pending" | "suspended" | "withdrawn";
  registeredAt: string;
}

const allClients: Client[] = [
  {
    id: 1,
    name: "김철수",
    company: "(주)대한건설",
    businessNumber: "123-45-67890",
    phone: "010-1111-2222",
    email: "client@example.com",
    address: "서울특별시 강남구 테헤란로 123",
    status: "active",
    registeredAt: "2026-03-01",
  },
  {
    id: 2,
    name: "이영희",
    company: "한국제조(주)",
    businessNumber: "234-56-78901",
    phone: "010-2222-3333",
    email: "lee@example.com",
    address: "서울특별시 서초구 서초대로 456",
    status: "active",
    registeredAt: "2026-03-05",
  },
  {
    id: 3,
    name: "박민수",
    company: "전기산업(주)",
    businessNumber: "345-67-89012",
    phone: "010-3333-4444",
    email: "park@example.com",
    address: "서울특별시 송파구 올림픽로 789",
    status: "pending",
    registeredAt: "2026-03-10",
  },
  {
    id: 4,
    name: "정수현",
    company: "(주)IT솔루션",
    businessNumber: "456-78-90123",
    phone: "010-4444-5555",
    email: "jung@example.com",
    address: "서울특별시 마포구 홍익로 321",
    status: "suspended",
    registeredAt: "2026-02-20",
  },
  {
    id: 5,
    name: "최영수",
    company: "안전소방(주)",
    businessNumber: "567-89-01234",
    phone: "010-5555-6666",
    email: "choi@example.com",
    address: "경기도 성남시 분당구 판교로 111",
    status: "withdrawn",
    registeredAt: "2026-02-15",
  },
];

const statusMap = {
  active: { label: "정상", className: "bg-green-100 text-green-700" },
  pending: { label: "대기", className: "bg-amber-100 text-amber-700" },
  suspended: { label: "정지", className: "bg-red-100 text-red-700" },
  withdrawn: { label: "탈퇴", className: "bg-gray-100 text-gray-600" },
};

type StatusFilter = "all" | "active" | "pending" | "suspended" | "withdrawn";

export function AdminClientList() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = allClients.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !c.name.includes(search) && !c.company.includes(search))
      return false;
    return true;
  });

  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();

      // 시트1: 필터 적용 의뢰인 목록
      const ws1 = XLSX.utils.aoa_to_sheet([
        [
          "이름",
          "업체명",
          "사업자번호",
          "연락처",
          "이메일",
          "주소",
          "상태",
          "가입일",
        ],
        ...filtered.map((c) => [
          c.name,
          c.company,
          c.businessNumber,
          c.phone,
          c.email,
          c.address,
          statusMap[c.status].label,
          c.registeredAt,
        ]),
      ]);
      ws1["!cols"] = [10, 18, 14, 14, 22, 30, 8, 12].map((wch) => ({ wch }));
      XLSX.utils.book_append_sheet(wb, ws1, "의뢰인목록");

      // 시트2: 상태별 집계
      const ws2 = XLSX.utils.aoa_to_sheet([
        ["상태", "인원수"],
        ["정상", counts.active],
        ["대기", counts.pending],
        ["정지", counts.suspended],
        ["탈퇴", counts.withdrawn],
        ["합계", allClients.length],
      ]);
      ws2["!cols"] = [{ wch: 10 }, { wch: 10 }];
      XLSX.utils.book_append_sheet(wb, ws2, "상태별집계");

      XLSX.writeFile(
        wb,
        `의뢰인목록_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    });
  };

  const counts = {
    all: allClients.length,
    active: allClients.filter((c) => c.status === "active").length,
    pending: allClients.filter((c) => c.status === "pending").length,
    suspended: allClients.filter((c) => c.status === "suspended").length,
    withdrawn: allClients.filter((c) => c.status === "withdrawn").length,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">의뢰인 회원현황 조회</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            등록된 모든 의뢰인을 확인하고 관리합니다.
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
      <div className="flex gap-2 flex-wrap">
        {(
          [
            ["all", "전체"],
            ["active", "정상"],
            ["pending", "대기"],
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

      {/* 검색 */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="이름 또는 업체명 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 text-xs w-52"
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
                  "업체명",
                  "사업자번호",
                  "연락처",
                  "이메일",
                  "주소",
                  "상태",
                  "가입일",
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
                  <td colSpan={9} className="text-center py-8 text-gray-400">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-medium">
                      {c.name}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {c.company}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                      {c.businessNumber}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {c.phone}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      {c.email}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 max-w-[160px] truncate">
                      {c.address}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${statusMap[c.status].className}`}
                      >
                        {statusMap[c.status].label}
                      </span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {c.registeredAt}
                    </td>
                    <td className="border-b border-gray-200 px-2 py-1">
                      <Link
                        to={`/admin/clients/${c.id}`}
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
