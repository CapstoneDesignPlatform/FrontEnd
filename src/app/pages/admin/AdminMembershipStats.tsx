import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

type ViewType = "individual" | "total";

interface MembershipHistory {
  id: number;
  memberNumber: string;
  representative: string;
  company: string;
  phone: string;
  email: string;
  businessNumber: string;
  address: string;
  paidAt: string;
  paidAmount: number;
  supplyAmount: number;
  vat: number;
}

const records: MembershipHistory[] = [
  {
    id: 1,
    memberNumber: "EX-2026-0101",
    representative: "홍길동",
    company: "케이법무법인",
    phone: "010-1234-5678",
    email: "expert1@example.com",
    businessNumber: "123-45-67890",
    address: "서울특별시 서초구 서초대로 123",
    paidAt: "2026-03-25",
    paidAmount: 330000,
    supplyAmount: 300000,
    vat: 30000,
  },
  {
    id: 2,
    memberNumber: "EX-2026-0102",
    representative: "강전문",
    company: "프로컨설팅",
    phone: "010-2222-2222",
    email: "kang@example.com",
    businessNumber: "234-56-78901",
    address: "서울특별시 강서구 마곡로 200",
    paidAt: "2026-03-28",
    paidAmount: 220000,
    supplyAmount: 200000,
    vat: 20000,
  },
  {
    id: 3,
    memberNumber: "EX-2026-0103",
    representative: "신기술",
    company: "IT솔루션",
    phone: "010-3333-3333",
    email: "shin@example.com",
    businessNumber: "345-67-89012",
    address: "서울특별시 마포구 월드컵북로 400",
    paidAt: "2026-03-30",
    paidAmount: 330000,
    supplyAmount: 300000,
    vat: 30000,
  },
  {
    id: 4,
    memberNumber: "EX-2026-0105",
    representative: "이컨설",
    company: "글로벌컨설팅",
    phone: "010-5555-5555",
    email: "lee@example.com",
    businessNumber: "567-89-01234",
    address: "서울특별시 강동구 천호대로 500",
    paidAt: "2026-03-20",
    paidAmount: 220000,
    supplyAmount: 200000,
    vat: 20000,
  },
];

export function AdminMembershipStats() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-04-30");
  const [viewType, setViewType] = useState<ViewType>("individual");

  const totalPaid = records.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalSupply = records.reduce((sum, r) => sum + r.supplyAmount, 0);
  const totalVat = records.reduce((sum, r) => sum + r.vat, 0);

  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();

      // 시트1: 납입 현황 상세 (합계 행 포함)
      const ws1 = XLSX.utils.aoa_to_sheet([
        [
          "번호",
          "회원번호",
          "대표자",
          "사업자",
          "연락처",
          "이메일",
          "사업자등록번호",
          "주소",
          "입금일시",
          "입금액",
          "공급가액",
          "부가가치세",
        ],
        ...records.map((r, i) => [
          i + 1,
          r.memberNumber,
          r.representative,
          r.company,
          r.phone,
          r.email,
          r.businessNumber,
          r.address,
          r.paidAt,
          r.paidAmount,
          r.supplyAmount,
          r.vat,
        ]),
        [],
        [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "합계",
          totalPaid,
          totalSupply,
          totalVat,
        ],
      ]);
      ws1["!cols"] = [6, 16, 12, 16, 14, 22, 16, 30, 12, 12, 12, 12].map(
        (wch) => ({ wch }),
      );
      XLSX.utils.book_append_sheet(wb, ws1, "납입현황");

      // 시트2: 요약 통계
      const ws2 = XLSX.utils.aoa_to_sheet([
        ["항목", "값"],
        ["조회 기간", `${startDate} ~ ${endDate}`],
        ["구분", viewType === "individual" ? "회원별(개별)" : "회원별(합계)"],
        ["납입 건수", `${records.length}건`],
        ["입금액 합계", `₩${totalPaid.toLocaleString()}`],
        ["공급가액 합계", `₩${totalSupply.toLocaleString()}`],
        ["부가가치세 합계", `₩${totalVat.toLocaleString()}`],
        ["총액(공급가액+VAT)", `₩${(totalSupply + totalVat).toLocaleString()}`],
        [
          "평균 입금액",
          `₩${Math.round(totalPaid / records.length).toLocaleString()}`,
        ],
      ]);
      ws2["!cols"] = [{ wch: 20 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, ws2, "요약통계");

      XLSX.writeFile(
        wb,
        `회원비납입현황_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">회원비 납입 현황 조회</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            기간별 회원비 납입 현황을 확인합니다.
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
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={handleExport}
        >
          출력
        </Button>
      </div>

      {/* 통계 바 */}
      <div className="flex gap-3">
        {[
          {
            label: "총 건수",
            value: `${records.length}건`,
            color: "text-blue-600",
          },
          {
            label: "입금액 합계",
            value: `₩${totalPaid.toLocaleString()}`,
            color: "text-gray-900",
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

      {/* 테이블 - 엑셀 (관)회원비 납입 현황 조회 시트 컬럼 순서 */}
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
                    "회원번호",
                    "대표자",
                    "사업자",
                    "연락처",
                    "이메일",
                    "사업자등록번호",
                    "주소",
                    "입금일시",
                    "입금액",
                    "공급가액",
                    "부가가치세",
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
                {records.map((r, i) => (
                  <tr
                    key={r.id}
                    className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                      {i + 1}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                      {r.memberNumber}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {r.representative}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {r.company}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {r.phone}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      {r.email}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                      {r.businessNumber}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      {r.address}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {r.paidAt}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-right">
                      ₩{r.paidAmount.toLocaleString()}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-right">
                      ₩{r.supplyAmount.toLocaleString()}
                    </td>
                    <td className="border-b border-gray-200 px-2 py-1 text-right">
                      ₩{r.vat.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                  <td
                    colSpan={9}
                    className="px-2 py-1.5 text-right text-gray-700"
                  >
                    합계
                  </td>
                  <td className="border-r border-gray-300 px-2 py-1.5 text-right">
                    ₩{totalPaid.toLocaleString()}
                  </td>
                  <td className="border-r border-gray-300 px-2 py-1.5 text-right">
                    ₩{totalSupply.toLocaleString()}
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    ₩{totalVat.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
