import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

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

  const handleExport = () => {
    exportToExcel(
      "알림서비스_사용관리",
      [
        "번호",
        "회원번호",
        "상호",
        "사업자등록번호",
        "연락처",
        "이메일",
        "신청건수",
        "사용건수",
        "잔여건수",
        "서비스상태",
      ],
      members.map((m, i) => [
        i + 1,
        m.memberNumber,
        m.company,
        m.businessNumber,
        m.phone,
        m.email,
        m.appliedCount,
        m.usedCount,
        m.remainingCount,
        m.serviceStatus === "continue" ? "계속" : "정지",
      ]),
    );
  };

  const continueCount = members.filter(
    (m) => m.serviceStatus === "continue",
  ).length;
  const suspendedCount = members.filter(
    (m) => m.serviceStatus === "suspended",
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">알림서비스 사용관리</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            회원별 알림서비스 사용 현황을 관리합니다.
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
      <div className="flex gap-3">
        {[
          {
            label: "전체 회원",
            value: `${members.length}명`,
            color: "text-gray-900",
          },
          {
            label: "서비스 계속",
            value: `${continueCount}명`,
            color: "text-teal-600",
          },
          {
            label: "서비스 정지",
            value: `${suspendedCount}명`,
            color: "text-red-600",
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
                  "신청건수",
                  "사용건수",
                  "잔여건수",
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
              {members.map((m, i) => (
                <tr
                  key={m.id}
                  className={`hover:bg-teal-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                    {i + 1}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                    {m.memberNumber}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                    {m.company}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                    {m.businessNumber}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                    {m.phone}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1">
                    {m.email}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                    {m.appliedCount}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                    {m.usedCount}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-center font-semibold">
                    {m.remainingCount}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1">
                    <button
                      onClick={() => handleToggleService(m.id)}
                      className={`px-2 py-0.5 rounded border text-xs font-medium transition-colors ${m.serviceStatus === "continue" ? "text-teal-600 border-teal-300 hover:bg-teal-50" : "text-red-600 border-red-300 hover:bg-red-50"}`}
                    >
                      {m.serviceStatus === "continue" ? "계속" : "정지"}
                    </button>
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1">
                    <Link
                      to={`/admin/notifications/${m.memberNumber}`}
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
