import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

type ViewType = "individual" | "total";

interface NotificationRecord {
  id: number;
  memberNumber: string;
  company: string;
  businessNumber: string;
  phone: string;
  email: string;
  date: string;
  count: number;
  supplyAmount: number;
  vat: number;
  note: string;
  grade: "special" | "business" | "free";
}

const records: NotificationRecord[] = [
  {
    id: 1,
    memberNumber: "EX-2026-0001",
    company: "케이법무법인",
    businessNumber: "123-45-67890",
    phone: "010-1234-5678",
    email: "expert1@example.com",
    date: "2026-04-05",
    count: 3,
    supplyAmount: 27273,
    vat: 2727,
    note: "",

    grade: "free",
  },
  {
    id: 2,
    memberNumber: "EX-2026-0002",
    company: "프로컨설팅",
    businessNumber: "234-56-78901",
    phone: "010-2345-6789",
    email: "expert2@example.com",
    date: "2026-04-04",
    count: 5,
    supplyAmount: 45455,
    vat: 4545,
    note: "",
    grade: "business",
  },
  {
    id: 3,
    memberNumber: "EX-2026-0003",
    company: "비즈컨설팅",
    businessNumber: "345-67-89012",
    phone: "010-3456-7890",
    email: "expert3@example.com",
    date: "2026-04-03",
    count: 2,
    supplyAmount: 18182,
    vat: 1818,
    note: "",
    grade: "business",
  },
  {
    id: 4,
    memberNumber: "EX-2026-0004",
    company: "IT솔루션",
    businessNumber: "456-78-90123",
    phone: "010-4567-8901",
    email: "expert4@example.com",
    date: "2026-04-02",
    count: 8,
    supplyAmount: 72727,
    vat: 7273,
    note: "",
    grade: "business",
  },
  {
    id: 5,
    memberNumber: "EX-2026-0005",
    company: "안전소방컨설팅",
    businessNumber: "567-89-01234",
    phone: "010-5678-9012",
    email: "expert5@example.com",
    date: "2026-04-01",
    count: 1,
    supplyAmount: 9091,
    vat: 909,
    note: "",
    grade: "free",
  },
];

export function AdminNotificationStats() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-04-30");
  const [viewType, setViewType] = useState<ViewType>("individual");

  const filtered = records.filter((r) => {
    if (startDate && r.date < startDate) return false;
    if (endDate && r.date > endDate) return false;
    return true;
  });
  const totalCount = filtered.reduce((sum, r) => sum + r.count, 0);
  const totalSupply = filtered.reduce((sum, r) => sum + r.supplyAmount, 0);
  const totalVat = filtered.reduce((sum, r) => sum + r.vat, 0);
  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();

      // 시트1: 상세 내역
      const ws1 = XLSX.utils.aoa_to_sheet([
        [
          "번호",
          "회원번호",
          "상호",
          "사업자등록번호",
          "연락처",
          "이메일",
          "일시",
          "건수",
          "공급가액",
          "부가가치세",
          "비고",
        ],
        ...records.map((r, i) => [
          i + 1,
          r.memberNumber,
          r.company,
          r.businessNumber,
          r.phone,
          r.email,
          r.date,
          r.count,
          r.supplyAmount,
          r.vat,
          r.note,
        ]),
        [],
        ["", "", "", "", "", "", "합계", totalCount, totalSupply, totalVat, ""],
      ]);
      ws1["!cols"] = [6, 16, 16, 16, 14, 22, 12, 8, 12, 12, 8].map((wch) => ({
        wch,
      }));
      XLSX.utils.book_append_sheet(wb, ws1, "알림서비스집계");

      // 시트2: 요약 통계
      const ws2 = XLSX.utils.aoa_to_sheet([
        ["항목", "값"],
        ["조회 기간", `${startDate} ~ ${endDate}`],
        ["구분", viewType === "individual" ? "회원별(개별)" : "회원별(합계)"],
        ["총 발송 건수", `${totalCount}건`],
        ["공급가액 합계", `₩${totalSupply.toLocaleString()}`],
        ["부가가치세 합계", `₩${totalVat.toLocaleString()}`],
        ["총액(공급가액+VAT)", `₩${(totalSupply + totalVat).toLocaleString()}`],
        ["회원 수", records.length],
        ["건당 평균 발송", (totalCount / records.length).toFixed(1)],
      ]);
      ws2["!cols"] = [{ wch: 20 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, ws2, "요약통계");

      XLSX.writeFile(
        wb,
        `알림서비스집계_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    });
  };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">알림서비스 집계표</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            기간별 알림서비스 사용 집계를 확인합니다.
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
            label: "총 발송 건수",
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
                    "회원번호",
                    "상호",
                    "사업자등록번호",
                    "연락처",
                    "이메일",
                    "일시",
                    "건수",
                    "공급가액",
                    "부가가치세",
                    "비고",
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
                    <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                      <Link
                        to={`/admin/notifications/${r.memberNumber}`}
                        className="text-blue-600 hover:underline"
                      >
                        {r.memberNumber}
                      </Link>
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
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {r.date}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs ${r.grade === "special" ? "bg-yellow-100 text-yellow-700" : r.grade === "business" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                      >
                        {r.grade === "special"
                          ? "스페셜"
                          : r.grade === "business"
                            ? "비즈니스"
                            : "무료"}
                      </span>
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-center font-semibold">
                      {r.count}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-right">
                      ₩{r.supplyAmount.toLocaleString()}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 text-right">
                      ₩{r.vat.toLocaleString()}
                    </td>
                    <td className="border-b border-gray-200 px-2 py-1">
                      {r.note}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                  <td
                    colSpan={7}
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
