import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

const stats = { totalExperts: 24, pendingExperts: 5, approvedExperts: 19 };

const pendingExperts = [
  {
    id: 1,
    name: "김전문",
    email: "expert1@example.com",
    phone: "010-1234-5678",
    expertise: "건설업 면허",
    appliedDate: "2026-04-05",
    hasDocuments: true,
  },
  {
    id: 2,
    name: "이기술",
    email: "expert2@example.com",
    phone: "010-2345-6789",
    expertise: "전기공사업",
    appliedDate: "2026-04-04",
    hasDocuments: true,
  },
  {
    id: 3,
    name: "박컨설",
    email: "expert3@example.com",
    phone: "010-3456-7890",
    expertise: "실태 조사",
    appliedDate: "2026-04-03",
    hasDocuments: true,
  },
  {
    id: 4,
    name: "최자격",
    email: "expert4@example.com",
    phone: "010-4567-8901",
    expertise: "정보통신공사업",
    appliedDate: "2026-04-02",
    hasDocuments: true,
  },
  {
    id: 5,
    name: "정면허",
    email: "expert5@example.com",
    phone: "010-5678-9012",
    expertise: "소방시설공사업",
    appliedDate: "2026-04-01",
    hasDocuments: true,
  },
];

const recentApproved = [
  {
    id: 101,
    name: "홍길동",
    expertise: "건설업 면허",
    approvedAt: "2026-03-25",
  },
  {
    id: 102,
    name: "강전문",
    expertise: "전기공사업",
    approvedAt: "2026-03-28",
  },
  {
    id: 103,
    name: "신기술",
    expertise: "정보통신공사업",
    approvedAt: "2026-03-30",
  },
];

export function AdminExperts() {
  const handleExportPending = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();

      // 시트1: 전체 통계 요약
      const ws1 = XLSX.utils.aoa_to_sheet([
        ["항목", "수치"],
        ["총 전문가", `${stats.totalExperts}명`],
        ["승인 대기", `${stats.pendingExperts}명`],
        ["승인 완료", `${stats.approvedExperts}명`],
      ]);
      ws1["!cols"] = [{ wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, ws1, "통계요약");

      // 시트2: 승인 대기 전문가
      const ws2 = XLSX.utils.aoa_to_sheet([
        ["번호", "이름", "이메일", "연락처", "전문분야", "신청일", "서류첨부"],
        ...pendingExperts.map((e, i) => [
          i + 1,
          e.name,
          e.email,
          e.phone,
          e.expertise,
          e.appliedDate,
          e.hasDocuments ? "O" : "X",
        ]),
      ]);
      ws2["!cols"] = [6, 10, 25, 15, 15, 12, 8].map((wch) => ({ wch }));
      XLSX.utils.book_append_sheet(wb, ws2, "승인대기전문가");

      // 시트3: 최근 승인된 전문가
      const ws3 = XLSX.utils.aoa_to_sheet([
        ["이름", "전문분야", "승인일"],
        ...recentApproved.map((e) => [e.name, e.expertise, e.approvedAt]),
      ]);
      ws3["!cols"] = [{ wch: 12 }, { wch: 20 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, ws3, "최근승인전문가");

      XLSX.writeFile(
        wb,
        `전문가관리_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">전문가 관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            전문가 승인 및 관리를 수행합니다.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1 text-xs"
          onClick={handleExportPending}
        >
          <Download className="h-3 w-3" />
          Excel 다운로드
        </Button>
      </div>

      {/* 통계 바 */}
      <div className="flex gap-3">
        {[
          {
            label: "총 전문가",
            value: stats.totalExperts,
            color: "text-gray-900",
          },
          {
            label: "승인 대기",
            value: stats.pendingExperts,
            color: "text-amber-600",
          },
          {
            label: "승인 완료",
            value: stats.approvedExperts,
            color: "text-teal-600",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-1 border border-gray-200 rounded bg-white px-4 py-2"
          >
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}명</p>
          </div>
        ))}
        <div className="flex items-center">
          <Link to="/admin/experts/list">
            <Button
              size="sm"
              variant="outline"
              className="text-xs whitespace-nowrap"
            >
              전체 목록 보기
            </Button>
          </Link>
        </div>
      </div>

      {/* 승인 대기 테이블 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-amber-700">
            ⚠ 승인 대기 중인 전문가 ({pendingExperts.length}명)
          </p>
        </div>
        <div className="border border-gray-300 rounded overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {[
                  "번호",
                  "이름",
                  "이메일",
                  "연락처",
                  "전문분야",
                  "신청일",
                  "서류",
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
              {pendingExperts.map((e, i) => (
                <tr
                  key={e.id}
                  className={`hover:bg-amber-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                    {i + 1}
                  </td>
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
                    {e.appliedDate}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                    {e.hasDocuments ? (
                      <span className="text-teal-600 font-semibold">✓</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1">
                    <Link
                      to={`/admin/experts/approval/${e.id}`}
                      className="text-teal-600 hover:underline whitespace-nowrap"
                    >
                      상세 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 최근 승인된 전문가 테이블 */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">
          최근 승인된 전문가
        </p>
        <div className="border border-gray-300 rounded overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {["이름", "전문분야", "승인일", "상세"].map((h) => (
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
              {recentApproved.map((e, i) => (
                <tr
                  key={e.id}
                  className={`hover:bg-teal-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="border-b border-r border-gray-200 px-2 py-1 font-medium">
                    {e.name}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1">
                    {e.expertise}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                    {e.approvedAt}
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1">
                    <Link
                      to={`/admin/experts/detail/${e.id}`}
                      className="text-teal-600 hover:underline whitespace-nowrap"
                    >
                      상세 →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
