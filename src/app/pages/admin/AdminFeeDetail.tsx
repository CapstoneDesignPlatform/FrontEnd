import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ArrowLeft, DollarSign, Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";
import { useState } from "react";

interface FeeHistory {
  date: string;
  description: string;
  bidAmount: number;
  feeAmount: number;
  supplyAmount: number;
  vat: number;
}

export function AdminFeeDetail() {
  const { memberNumber } = useParams();
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-04-30");

  const memberInfo = {
    memberNumber: memberNumber || "EX-2026-0001",
    company: "케이법무법인",
    businessNumber: "123-45-67890",
  };

  const history: FeeHistory[] = [
    {
      date: "2026-04-06",
      description: "건설업 면허 취득 (REQ-L5X9K2M)",
      bidAmount: 2500000,
      feeAmount: 250000,
      supplyAmount: 227273,
      vat: 22727,
    },
    {
      date: "2026-04-12",
      description: "소방시설공사업 면허 (REQ-P2K9M3L)",
      bidAmount: 2100000,
      feeAmount: 210000,
      supplyAmount: 190909,
      vat: 19091,
    },
  ];
  const totalBid = history.reduce((sum, h) => sum + h.bidAmount, 0);

  const handleExport = () => {
    exportToExcel(
      `중개수수료_회원별_${memberInfo.memberNumber}`,
      ["일시", "내역", "낙찰금액", "중개수수료", "공급가액", "부가가치세"],
      history.map((h) => [
        h.date,
        h.description,
        h.bidAmount,
        h.feeAmount,
        h.supplyAmount,
        h.vat,
      ]),
    );
  };
  const totalFee = history.reduce((sum, h) => sum + h.feeAmount, 0);
  const totalSupply = history.reduce((sum, h) => sum + h.supplyAmount, 0);
  const totalVat = history.reduce((sum, h) => sum + h.vat, 0);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/fees/stats">
            <ArrowLeft className="h-4 w-4 mr-1" />
            중개수수료 집계로
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl mb-2">중개수수료 현황 (회원별)</h1>
        <p className="text-gray-600">회원의 중개수수료 내역을 확인합니다.</p>
      </div>

      {/* 회원 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>회원 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">회원번호</p>
              <p className="font-semibold font-mono">
                {memberInfo.memberNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">상호명</p>
              <p className="font-semibold">{memberInfo.company}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">사업자등록번호</p>
              <p className="font-semibold font-mono">
                {memberInfo.businessNumber}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 조회 기간 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            조회 기간
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
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
            <Button className="bg-[#34499C] hover:bg-[#2a3d84]">조회</Button>

            <Button
              variant="outline"
              className="gap-1 text-xs"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
              Excel 다운로드
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 요약 통계 */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">총 낙찰금액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              ₩{totalBid.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">총 중개수수료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">
              ₩{totalFee.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">공급가액 합계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              ₩{totalSupply.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">부가가치세 합계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              ₩{totalVat.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 수수료 내역 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>중개수수료 내역</CardTitle>
          <CardDescription>
            {startDate} ~ {endDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {[
                    "일시",
                    "내역",
                    "낙찰금액",
                    "중개수수료",
                    "공급가액",
                    "부가가치세",
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
                {history.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 whitespace-nowrap">{item.date}</td>
                    <td className="py-2 px-3">{item.description}</td>
                    <td className="py-2 px-3 text-right font-semibold">
                      ₩{item.bidAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-blue-600 font-semibold">
                      ₩{item.feeAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right">
                      ₩{item.supplyAmount.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right">
                      ₩{item.vat.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold border-t-2">
                  <td colSpan={2} className="py-2 px-3 text-right">
                    합계
                  </td>
                  <td className="py-2 px-3 text-right">
                    ₩{totalBid.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right text-blue-600">
                    ₩{totalFee.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    ₩{totalSupply.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">
                    ₩{totalVat.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
