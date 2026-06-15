import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";

interface NotificationMember {
  id: number;
  memberNumber: string;
  company: string;
  businessNumber: string;
  phone: string;
  email: string;
  grade: "special" | "business" | "free";
  memberStatus: "active" | "suspended";
  usedCount: number;
  remainingCount: number;
  serviceStatus: "continue" | "suspended";
}

const GRADE_LIMIT: Record<string, number | "무제한"> = {
  special: "무제한",
  business: 10,
  free: 3,
};

export function AdminNotificationManage() {
  const [members, setMembers] = useState<NotificationMember[]>([
    {
      id: 1,
      memberNumber: "EX-2026-0001",
      company: "케이법무법인",
      businessNumber: "123-45-67890",
      phone: "010-1234-5678",
      email: "expert1@example.com",
      grade: "special",
      memberStatus: "active",
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
      grade: "business",
      memberStatus: "active",
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
      grade: "free",
      memberStatus: "active",
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
      grade: "business",
      memberStatus: "suspended",
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
      grade: "special",
      memberStatus: "active",
      usedCount: 10,
      remainingCount: 5,
      serviceStatus: "continue",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [addCounts, setAddCounts] = useState<Record<number, string>>({});

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

  const handleSave = () => {
    setMembers((prev) =>
      prev.map((m) => {
        const add = parseInt(addCounts[m.id] ?? "0") || 0;
        return { ...m, remainingCount: m.remainingCount + add };
      }),
    );
    setAddCounts({});
    setIsEditing(false);
  };

  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const gradeLabel = (g: string) =>
        g === "special" ? "스페셜" : g === "business" ? "비즈니스" : "무료";
      const wb = XLSX.utils.book_new();
      const ws1 = XLSX.utils.aoa_to_sheet([
        [
          "번호",
          "회원번호",
          "대표자",
          "연락처",
          "사업자등록번호",
          "이메일",
          "등급",
          "신청건수",
          "사용건수",
          "잔여건수",
          "서비스상태",
        ],
        ...members.map((m, i) => [
          i + 1,
          m.memberNumber,
          m.company,
          m.phone,
          m.businessNumber,
          m.email,
          gradeLabel(m.grade),
          GRADE_LIMIT[m.grade],
          m.usedCount,
          m.remainingCount,
          m.serviceStatus === "continue" ? "계속" : "정지",
        ]),
      ]);
      ws1["!cols"] = [6, 16, 16, 14, 16, 22, 10, 10, 10, 10, 10].map((wch) => ({
        wch,
      }));
      XLSX.utils.book_append_sheet(wb, ws1, "사용관리목록");
      XLSX.writeFile(
        wb,
        `알림서비스사용관리_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    });
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
            color: "text-blue-600",
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
                  ...(isEditing ? ["추가건수"] : []),
                  "번호",
                  "회원번호",
                  "대표자",
                  "연락처",
                  "사업자등록번호",
                  "이메일",
                  "등급",
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
                  className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                >
                  {isEditing && (
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      <Input
                        type="number"
                        min={0}
                        placeholder="0"
                        value={addCounts[m.id] ?? ""}
                        onChange={(e) =>
                          setAddCounts((prev) => ({
                            ...prev,
                            [m.id]: e.target.value,
                          }))
                        }
                        className="h-6 text-xs w-16"
                      />
                    </td>
                  )}
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                    {i + 1}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                    {m.memberNumber}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                    {m.company}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                    {m.phone}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 font-mono">
                    {m.businessNumber}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-xs">
                    {m.email}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${m.grade === "special" ? "bg-yellow-100 text-yellow-700" : m.grade === "business" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {m.grade === "special"
                        ? "스페셜"
                        : m.grade === "business"
                          ? "비즈니스"
                          : "무료"}
                    </span>
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                    {GRADE_LIMIT[m.grade]}
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
                      className={`px-2 py-0.5 rounded border text-xs font-medium transition-colors ${m.serviceStatus === "continue" ? "text-blue-600 border-blue-300 hover:bg-blue-50" : "text-red-600 border-red-300 hover:bg-red-50"}`}
                    >
                      {m.serviceStatus === "continue" ? "계속" : "정지"}
                    </button>
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1">
                    <Link
                      to={`/admin/notifications/${m.memberNumber}`}
                      className="text-blue-600 hover:underline whitespace-nowrap"
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

      {/* 수정/저장 버튼 */}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs px-6"
          onClick={() => {
            setIsEditing(!isEditing);
            setAddCounts({});
          }}
        >
          {isEditing ? "취소" : "수정"}
        </Button>
        <Button
          size="sm"
          className="bg-[#009689] hover:bg-[#007d71] text-xs px-6"
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
