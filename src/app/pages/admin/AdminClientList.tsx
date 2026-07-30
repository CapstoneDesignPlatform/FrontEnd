import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";
import { getClientList } from "../../../api/admin/clientApi";
import type { AdminClientSummary } from "../../../api/admin/clientApi";
import { downloadClientListExcel } from "../../../api/admin/excelApi";

// 백엔드 데이터를 프론트 UI에 맞게 변환
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

// 백엔드 → 프론트 타입 변환 함수
function mapToClient(c: AdminClientSummary): Client {
  return {
    id: c.userId,
    name: c.name,
    company: c.companyName ?? "-",
    businessNumber: c.businessNumber ?? "-",
    phone: "-", // 백엔드 Summary에 phone 없음 → Detail에서 가져옴
    email: c.email,
    address: "-", // 백엔드 Summary에 address 없음
    status: "active", // TODO: 백엔드에서 status 필드 추가 후 연결
    registeredAt: c.createdAt.slice(0, 10),
  };
}

const statusMap = {
  active: { label: "정상", className: "bg-green-100 text-green-700" },
  pending: { label: "대기", className: "bg-amber-100 text-amber-700" },
  suspended: { label: "정지", className: "bg-red-100 text-red-700" },
  withdrawn: { label: "탈퇴", className: "bg-gray-100 text-gray-600" },
};

type StatusFilter = "all" | "active" | "pending" | "suspended" | "withdrawn";
export function AdminClientList() {
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    getClientList()
      .then((res) => setAllClients(res.data.content.map(mapToClient)))
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

  const filtered = allClients.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search && !c.name.includes(search) && !c.company.includes(search))
      return false;
    return true;
  });

  const handleExport = () => downloadClientListExcel();

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
                  "구분",
                  "대표자",
                  "사업자",
                  "연락처",
                  "이메일",
                  "자격증",
                  "사업자등록번호",
                  "주소",
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
                  <td colSpan={10} className="text-center py-8 text-gray-400">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-medium whitespace-nowrap">
                      {c.company}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {c.name}
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
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      -
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                      {c.businessNumber}
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
