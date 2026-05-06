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
import { Badge } from "../../components/ui/badge";
import { Bell, Printer } from "lucide-react";

interface NotificationMember {
  id: number;
  memberNumber: string;
  company: string;
  businessNumber: string;
  phone: string;
  email: string;
  memberStatus: "active" | "suspended";
  appliedCount: number;
  usedCount: number;
  remainingCount: number;
  serviceStatus: "continue" | "suspended";
}

export function AdminNotificationManage() {
  const [members, setMembers] = useState<NotificationMember[]>([
    {
      id: 1,
      memberNumber: "EX-2026-0001",
      company: "케이법무법인",
      businessNumber: "123-45-67890",
      phone: "010-1234-5678",
      email: "expert1@example.com",
      memberStatus: "active",
      appliedCount: 10,
      usedCount: 7,
      remainingCount: 3,
      serviceStatus: "continue",
    },
    {
      id: 2,
      memberNumber: "EX-2026-0002",
      company: "프로컨설팅",
      businessNumber: "234-56-78901",
      phone: "010-2345-6789",
      email: "expert2@example.com",
      memberStatus: "active",
      appliedCount: 20,
      usedCount: 15,
      remainingCount: 5,
      serviceStatus: "suspended",
    },
    {
      id: 3,
      memberNumber: "EX-2026-0003",
      company: "비즈컨설팅",
      businessNumber: "345-67-89012",
      phone: "010-3456-7890",
      email: "expert3@example.com",
      memberStatus: "active",
      appliedCount: 5,
      usedCount: 5,
      remainingCount: 0,
      serviceStatus: "continue",
    },
    {
      id: 4,
      memberNumber: "EX-2026-0004",
      company: "IT솔루션",
      businessNumber: "456-78-90123",
      phone: "010-4567-8901",
      email: "expert4@example.com",
      memberStatus: "suspended",
      appliedCount: 8,
      usedCount: 3,
      remainingCount: 5,
      serviceStatus: "suspended",
    },
    {
      id: 5,
      memberNumber: "EX-2026-0005",
      company: "안전소방컨설팅",
      businessNumber: "567-89-01234",
      phone: "010-5678-9012",
      email: "expert5@example.com",
      memberStatus: "active",
      appliedCount: 15,
      usedCount: 10,
      remainingCount: 5,
      serviceStatus: "continue",
    },
  ]);

  const handleToggleService = (id: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              serviceStatus:
                m.serviceStatus === "continue" ? "suspended" : "continue",
            }
          : m,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">알림서비스 사용관리</h1>
        <p className="text-gray-600">
          회원별 알림서비스 사용 현황을 관리합니다.
        </p>
      </div>

      {/* 통계 */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">전체 회원</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{members.length}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">서비스 계속</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {members.filter((m) => m.serviceStatus === "continue").length}명
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">서비스 정지</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {members.filter((m) => m.serviceStatus === "suspended").length}명
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            알림서비스 관리
          </CardTitle>
          <CardDescription>
            회원별 알림서비스 신청/사용/잔여 건수를 확인하고 상태를 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button variant="outline" className="gap-1">
              <Printer className="h-4 w-4" />
              출력
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {[
                    "번호",
                    "회원번호",
                    "상호",
                    "사업자등록번호",
                    "연락처",
                    "이메일",
                    "신청건수",
                    "사용건수",
                    "잔여건수",
                    "상태",
                    "상세",
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
                {members.map((member, index) => (
                  <tr key={member.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{index + 1}</td>
                    <td className="py-2 px-3 font-mono text-xs">
                      {member.memberNumber}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {member.company}
                    </td>
                    <td className="py-2 px-3 font-mono text-xs">
                      {member.businessNumber}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      {member.phone}
                    </td>
                    <td className="py-2 px-3 text-xs">{member.email}</td>
                    <td className="py-2 px-3 text-center">
                      {member.appliedCount}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {member.usedCount}
                    </td>
                    <td className="py-2 px-3 text-center font-semibold">
                      {member.remainingCount}
                    </td>
                    <td className="py-2 px-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className={
                          member.serviceStatus === "continue"
                            ? "text-teal-600 border-teal-200"
                            : "text-red-600 border-red-200"
                        }
                        onClick={() => handleToggleService(member.id)}
                      >
                        {member.serviceStatus === "continue" ? "계속" : "정지"}
                      </Button>
                    </td>
                    <td className="py-2 px-3">
                      <Link to={`/admin/notifications/${member.memberNumber}`}>
                        <Button size="sm" variant="outline">
                          상세
                        </Button>
                      </Link>
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
