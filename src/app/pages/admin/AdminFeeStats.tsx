import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, DollarSign, Printer } from "lucide-react";

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

export function AdminFeeStats() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-04-30");
  const [viewType, setViewType] = useState<ViewType>("individual");

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

  const totalCount = records.reduce((sum, r) => sum + r.count, 0);
  const totalSupply = records.reduce((sum, r) => sum + r.supplyAmount, 0);
  const totalVat = records.reduce((sum, r) => sum + r.vat, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">중개수수료 현황</h1>
        <p className="text-gray-600">기간별 중개수수료 집계를 확인합니다.</p>
      </div>

      {/* 조회 조건 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            조회 조건
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap">
                기간
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-40"
              />
              <span className="text-gray-500">~</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-40"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium self-center">구분</span>
            <Button
              size="sm"
              variant={viewType === "individual" ? "default" : "outline"}
              className={
                viewType === "individual"
                  ? "bg-[#009689] hover:bg-[#007d71]"
                  : ""
              }
              onClick={() => setViewType("individual")}
            >
              회원별(개별)
            </Button>
            <Button
              size="sm"
              variant={viewType === "total" ? "default" : "outline"}
              className={
                viewType === "total" ? "bg-[#009689] hover:bg-[#007d71]" : ""
              }
              onClick={() => setViewType("total")}
            >
              회원별(합계)
            </Button>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#009689] hover:bg-[#007d71]">조회</Button>
            <Button variant="outline" className="gap-1">
              <Printer className="h-4 w-4" />
              출력
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 집계 요약 */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">총 건수</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {totalCount}건
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">공급가액 합계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₩{totalSupply.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">부가가치세 합계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₩{totalVat.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 집계 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            중개수수료 집계
          </CardTitle>
          <CardDescription>
            {startDate} ~ {endDate} 기간 조회 결과
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
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
                      className="text-left py-2 px-3 text-gray-600 font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{index + 1}</td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {record.processedAt}
                    </td>
                    <td className="py-2 px-3 font-mono text-xs">
                      {record.memberNumber}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {record.company}
                    </td>
                    <td className="py-2 px-3 font-mono text-xs">
                      {record.businessNumber}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {record.phone}
                    </td>
                    <td className="py-2 px-3 text-xs">{record.email}</td>
                    <td className="py-2 px-3">{record.description}</td>
                    <td className="py-2 px-3 text-center">{record.count}</td>
                    <td className="py-2 px-3 text-right">
                      ₩{record.supplyAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right">
                      ₩{record.vat.toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      <Link to={`/admin/fees/${record.memberNumber}`}>
                        <Button size="sm" variant="outline">
                          조회
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold border-t-2">
                  <td colSpan={8} className="py-2 px-3 text-right">
                    합계
                  </td>
                  <td className="py-2 px-3 text-center">{totalCount}</td>
                  <td className="py-2 px-3 text-right">
                    ₩{totalSupply.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    ₩{totalVat.toLocaleString()}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
