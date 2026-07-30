import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

type ViewType = "individual" | "total";

interface FeeRecord {
  id: number;
  processedAt: string;
  memberNumber: string;
  company: string;
  businessNumber: string;
  phone: string;
  email: string;
  description: string;
  count: number;
  supplyAmount: number;
  vat: number;
}

const records: FeeRecord[] = [
  {
    id: 1,
    processedAt: "2026-04-06",
    memberNumber: "EX-2026-0001",
    company: "케이법무법인",
    businessNumber: "123-45-67890",
    phone: "010-1234-5678",
    email: "expert1@example.com",
    description: "건설업 면허 취득 중개수수료",
    count: 1,
    supplyAmount: 227273,
    vat: 22727,
  },
  {
    id: 2,
    processedAt: "2026-04-05",
    memberNumber: "EX-2026-0002",
    company: "프로컨설팅",
    businessNumber: "234-56-78901",
    phone: "010-2345-6789",
    email: "expert2@example.com",
    description: "전기공사업 면허 중개수수료",
    count: 1,
    supplyAmount: 209091,
    vat: 20909,
  },
  {
    id: 3,
    processedAt: "2026-04-10",
    memberNumber: "EX-2026-0003",
    company: "비즈컨설팅",
    businessNumber: "345-67-89012",
    phone: "010-3456-7890",
    email: "expert3@example.com",
    description: "실태조사 중개수수료",
    count: 2,
    supplyAmount: 163636,
    vat: 16364,
  },
  {
    id: 4,
    processedAt: "2026-04-12",
    memberNumber: "EX-2026-0001",
    company: "케이법무법인",
    businessNumber: "123-45-67890",
    phone: "010-1234-5678",
    email: "expert1@example.com",
    description: "소방시설공사업 면허 중개수수료",
    count: 1,
    supplyAmount: 190909,
    vat: 19091,
  },
  {
    id: 5,
    processedAt: "2026-04-15",
    memberNumber: "EX-2026-0004",
    company: "IT솔루션",
    businessNumber: "456-78-90123",
    phone: "010-4567-8901",
    email: "expert4@example.com",
    description: "정보통신공사업 등록 중개수수료",
    count: 1,
    supplyAmount: 154545,
    vat: 15455,
  },
];

export function AdminFeeStats() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-04-30");
  const [viewType, setViewType] = useState<ViewType>("individual");

  const filtered = records.filter((r) => {
    if (startDate && r.processedAt < startDate) return false;
    if (endDate && r.processedAt > endDate) return false;
    return true;
  });
  const totalCount = filtered.reduce((sum, r) => sum + r.count, 0);
  const totalSupply = filtered.reduce((sum, r) => sum + r.supplyAmount, 0);
  const totalVat = filtered.reduce((sum, r) => sum + r.vat, 0);

  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();

      // 시트1: 상세 내역 (합계 행 포함)
      const ws1 = XLSX.utils.aoa_to_sheet([
        [
          "번호",
          "처리일",
          "회원번호",
          "상호",
          "사업자등록번호",
          "연락처",
          "이메일",
          "내용",
          "건수",
          "공급가액",
          "부가가치세",
        ],
        ...records.map((r, i) => [
          i + 1,
          r.processedAt,
          r.memberNumber,
          r.company,
          r.businessNumber,
          r.phone,
          r.email,
          r.description,
          r.count,
          r.supplyAmount,
          r.vat,
        ]),
        [],
        ["", "", "", "", "", "", "", "합계", totalCount, totalSupply, totalVat],
      ]);
      ws1["!cols"] = [6, 12, 16, 16, 16, 14, 22, 24, 8, 14, 14].map((wch) => ({
        wch,
      }));
      XLSX.utils.book_append_sheet(wb, ws1, "중개수수료집계");

      // 시트2: 요약 통계
      const ws2 = XLSX.utils.aoa_to_sheet([
        ["항목", "값"],
        ["조회 기간", `${startDate} ~ ${endDate}`],
        ["구분", viewType === "individual" ? "회원별(개별)" : "회원별(합계)"],
        ["총 건수", `${totalCount}건`],
        ["공급가액 합계", `₩${totalSupply.toLocaleString()}`],
        ["부가가치세 합계", `₩${totalVat.toLocaleString()}`],
        ["총액(공급가액+VAT)", `₩${(totalSupply + totalVat).toLocaleString()}`],
      ]);
      ws2["!cols"] = [{ wch: 20 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, ws2, "요약통계");

      // 시트3: 회원별 집계
      const byMember = records.reduce(
        (acc, r) => {
          if (!acc[r.memberNumber])
            acc[r.memberNumber] = {
              company: r.company,
              count: 0,
              supply: 0,
              vat: 0,
            };
          acc[r.memberNumber].count += r.count;
          acc[r.memberNumber].supply += r.supplyAmount;
          acc[r.memberNumber].vat += r.vat;
          return acc;
        },
        {} as Record<
          string,
          { company: string; count: number; supply: number; vat: number }
        >,
      );
      const ws3 = XLSX.utils.aoa_to_sheet([
        ["회원번호", "상호", "건수", "공급가액", "부가가치세"],
        ...Object.entries(byMember).map(([mn, v]) => [
          mn,
          v.company,
          v.count,
          v.supply,
          v.vat,
        ]),
      ]);
      ws3["!cols"] = [16, 18, 8, 14, 14].map((wch) => ({ wch }));
      XLSX.utils.book_append_sheet(wb, ws3, "회원별집계");

      XLSX.writeFile(
        wb,
        `중개수수료집계_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">중개수수료 현황</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            기간별 중개수수료 집계를 확인합니다.
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

      {/* 조회 조건 */}
      <div className="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded px-4 py-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium whitespace-nowrap">기간</label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-7 text-xs w-36"
          />
          <span className="text-gray-400 text-xs">~</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-7 text-xs w-36"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">구분</span>
          {(
            [
              ["individual", "회원별(개별)"],
              ["total", "회원별(합계)"],
            ] as [ViewType, string][]
          ).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setViewType(val)}
              className={`px-2 py-0.5 rounded border text-xs transition-colors ${viewType === val ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <Button
          size="sm"
          className="bg-[#34499C] hover:bg-[#2a3d84] h-7 text-xs"
        >
          조회
        </Button>
      </div>

      {/* 통계 바 */}
      <div className="flex gap-3">
        {[
          {
            label: "총 건수",
            value: `${totalCount}건`,
            color: "text-blue-600",
          },
          {
            label: "공급가액 합계",
            value: `₩${totalSupply.toLocaleString()}`,
            color: "text-gray-900",
          },
          {
            label: "부가가치세 합계",
            value: `₩${totalVat.toLocaleString()}`,
            color: "text-gray-900",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-1 border border-gray-200 rounded bg-white px-4 py-2"
          >
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* 테이블 */}
      <div>
        <p className="text-xs text-gray-500 mb-1">
          {startDate} ~ {endDate} 기간 조회 결과
        </p>
        <div className="border border-gray-300 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {[
                    "번호",
                    "처리일",
                    "회원번호",
                    "상호",
                    "사업자등록번호",
                    "연락처",
                    "이메일",
                    "내용",
                    "건수",
                    "공급가액",
                    "부가가치세",
                    "조회",
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
                {filtered.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                      {i + 1}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {r.processedAt}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                      {r.memberNumber}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {r.company}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                      {r.businessNumber}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {r.phone}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      {r.email}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      {r.description}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                      {r.count}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-right">
                      ₩{r.supplyAmount.toLocaleString()}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-right">
                      ₩{r.vat.toLocaleString()}
                    </td>
                    <td className="border-b border-gray-200 px-2 py-1">
                      <Link
                        to={`/admin/fees/${r.memberNumber}`}
                        className="text-blue-600 hover:underline whitespace-nowrap"
                      >
                        조회 →
                      </Link>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                  <td
                    colSpan={8}
                    className="px-2 py-1.5 text-right text-gray-700"
                  >
                    합계
                  </td>
                  <td className="border-r border-gray-300 px-2 py-1.5 text-center">
                    {totalCount}
                  </td>
                  <td className="border-r border-gray-300 px-2 py-1.5 text-right">
                    ₩{totalSupply.toLocaleString()}
                  </td>
                  <td className="border-r border-gray-300 px-2 py-1.5 text-right">
                    ₩{totalVat.toLocaleString()}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
