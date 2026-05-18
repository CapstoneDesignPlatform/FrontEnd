import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";
import { useState } from "react";
import { exportToExcel } from "../../utils/exportExcel";

interface MembershipRecord {
  id: number;
  memberNumber: string;
  representative: string;
  company: string;
  phone: string;
  email: string;
  businessNumber: string;
  paidAmount: number;
  supplyAmount: number;
  vat: number;
  grade: "special" | "business" | "free";
  paidAt: string;
}

const gradeMap = { special: "스페셜", business: "비즈니스", free: "무료" };
const gradeClass = {
  special: "bg-yellow-100 text-yellow-700",
  business: "bg-blue-100 text-blue-700",
  free: "bg-gray-100 text-gray-600",
};

const records: MembershipRecord[] = [
  {
    id: 1,
    memberNumber: "EX-2026-0101",
    representative: "홍길동",
    company: "케이법무법인",
    phone: "010-1234-5678",
    email: "expert1@example.com",
    businessNumber: "123-45-67890",
    paidAmount: 330000,
    supplyAmount: 300000,
    vat: 30000,
    grade: "special",
    paidAt: "2026-03-25",
  },
  {
    id: 2,
    memberNumber: "EX-2026-0102",
    representative: "강전문",
    company: "프로컨설팅",
    phone: "010-2222-2222",
    email: "kang@example.com",
    businessNumber: "234-56-78901",
    paidAmount: 220000,
    supplyAmount: 200000,
    vat: 20000,
    grade: "business",
    paidAt: "2026-03-28",
  },
  {
    id: 3,
    memberNumber: "EX-2026-0103",
    representative: "신기술",
    company: "IT솔루션",
    phone: "010-3333-3333",
    email: "shin@example.com",
    businessNumber: "345-67-89012",
    paidAmount: 330000,
    supplyAmount: 300000,
    vat: 30000,
    grade: "special",
    paidAt: "2026-03-30",
  },
  {
    id: 4,
    memberNumber: "EX-2026-0104",
    representative: "박행정",
    company: "믿음행정사사무소",
    phone: "010-4444-4444",
    email: "park@example.com",
    businessNumber: "456-78-90123",
    paidAmount: 0,
    supplyAmount: 0,
    vat: 0,
    grade: "free",
    paidAt: "-",
  },
  {
    id: 5,
    memberNumber: "EX-2026-0105",
    representative: "이컨설",
    company: "글로벌컨설팅",
    phone: "010-5555-5555",
    email: "lee@example.com",
    businessNumber: "567-89-01234",
    paidAmount: 220000,
    supplyAmount: 200000,
    vat: 20000,
    grade: "business",
    paidAt: "2026-03-20",
  },
];

export function AdminMembershipManage() {
  const [inputDate, setInputDate] = useState("");

  const handleExport = () => {
    exportToExcel(
      "회원비납입관리",
      [
        "번호",
        "회원번호",
        "대표자",
        "사업자",
        "연락처",
        "이메일",
        "사업자등록번호",
        "입금액",
        "공급가액",
        "부가가치세",
        "회원등급",
      ],
      records.map((r, i) => [
        i + 1,
        r.memberNumber,
        r.representative,
        r.company,
        r.phone,
        r.email,
        r.businessNumber,
        r.paidAmount || "-",
        r.supplyAmount || "-",
        r.vat || "-",
        gradeMap[r.grade],
      ]),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">회원비 납입 관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            전문가 회원비 납입 내역을 관리합니다.
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

      {/* 입금일자 조회 */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded px-4 py-3">
        <label className="text-xs font-medium whitespace-nowrap">
          입금일자
        </label>
        <Input
          type="date"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
          className="h-7 text-xs w-36"
        />
        <Button
          size="sm"
          className="bg-[#009689] hover:bg-[#007d71] h-7 text-xs"
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

      {/* 테이블 - 엑셀 (관)회원비 납입 관리 시트 컬럼 순서 */}
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
                  "입금액",
                  "공급가액",
                  "부가가치세",
                  "회원등급",
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
                  className={`hover:bg-teal-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
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
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-right">
                    {r.paidAmount > 0
                      ? `₩${r.paidAmount.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-right">
                    {r.supplyAmount > 0
                      ? `₩${r.supplyAmount.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-right">
                    {r.vat > 0 ? `₩${r.vat.toLocaleString()}` : "-"}
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${gradeClass[r.grade]}`}
                    >
                      {gradeMap[r.grade]}
                    </span>
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
