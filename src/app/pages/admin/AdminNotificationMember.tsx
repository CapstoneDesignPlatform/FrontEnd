import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { ArrowLeft, Bell, Printer } from "lucide-react";
import { useState } from "react";

interface NotificationHistory {
  date: string;
  description: string;
  charged: number;
  deducted: number;
  balance: number;
  note: "입금" | "무상" | "환급" | "";
}

export function AdminNotificationMember() {
  const { memberNumber } = useParams();
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-04-30");

  const memberInfo = {
    memberNumber: memberNumber || "EX-2026-0001",
    company: "케이법무법인",
    businessNumber: "123-45-67890",
  };

  const history: NotificationHistory[] = [
    {
      date: "2026-04-01",
      description: "알림서비스 신청 (10건)",
      charged: 90909,
      deducted: 0,
      balance: 90909,
      note: "입금",
    },
    {
      date: "2026-04-05",
      description: "공고 알림 발송 (3건)",
      charged: 0,
      deducted: 27273,
      balance: 63636,
      note: "",
    },
    {
      date: "2026-04-10",
      description: "공고 알림 발송 (2건)",
      charged: 0,
      deducted: 18182,
      balance: 45454,
      note: "",
    },
    {
      date: "2026-04-15",
      description: "무상 알림 추가 (2건)",
      charged: 18182,
      deducted: 0,
      balance: 63636,
      note: "무상",
    },
    {
      date: "2026-04-20",
      description: "공고 알림 발송 (2건)",
      charged: 0,
      deducted: 18182,
      balance: 45454,
      note: "",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/notifications/manage">
            <ArrowLeft className="h-4 w-4 mr-1" />
            알림서비스 사용관리로
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl mb-2">알림서비스 회원별 현황</h1>
        <p className="text-gray-600">
          회원의 알림서비스 신청 및 이용 내역을 확인합니다.
        </p>
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
            <Bell className="h-5 w-5" />
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
            <Button className="bg-[#009689] hover:bg-[#007d71]">조회</Button>
            <Button variant="outline" className="gap-1">
              <Printer className="h-4 w-4" />
              출력
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 이용 내역 */}
      <Card>
        <CardHeader>
          <CardTitle>알림서비스 신청 및 이용 내역</CardTitle>
          <CardDescription>
            {startDate} ~ {endDate}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {["일시", "내역", "입금액", "차감액", "잔고", "비고"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left py-2 px-3 text-gray-600 font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3 whitespace-nowrap">{item.date}</td>
                    <td className="py-2 px-3">{item.description}</td>
                    <td className="py-2 px-3 text-right">
                      {item.charged > 0
                        ? `₩${item.charged.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="py-2 px-3 text-right text-red-600">
                      {item.deducted > 0
                        ? `₩${item.deducted.toLocaleString()}`
                        : "-"}
                    </td>
                    <td className="py-2 px-3 text-right font-semibold">
                      ₩{item.balance.toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      {item.note === "입금" && (
                        <Badge className="bg-teal-100 text-teal-700">
                          입금
                        </Badge>
                      )}
                      {item.note === "무상" && (
                        <Badge className="bg-blue-100 text-blue-700">
                          무상
                        </Badge>
                      )}
                      {item.note === "환급" && (
                        <Badge className="bg-orange-100 text-orange-700">
                          환급
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
