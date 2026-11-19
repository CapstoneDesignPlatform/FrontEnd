import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Download } from "lucide-react";
import { mockExpertMembership, mockExpertPlans, mockExpertProfileDto } from "../../../mocks/expert";
import { saveMockExpertAlertBalance, useMockExpertAlertBalance } from "../../../mocks/expertAlertBalance";

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
  lastAdjustment?: { delta: number; reason: string };
}

interface AdjustmentDraft {
  direction: "add" | "deduct";
  quantity: string;
  reason: string;
  serviceStatus?: NotificationMember["serviceStatus"];
}

const emptyDraft: AdjustmentDraft = { direction: "add", quantity: "", reason: "" };

function previewAdjustment(current: number, draft: AdjustmentDraft) {
  if (draft.quantity === "" && draft.reason === "") {
    return { balance: current, error: "", hasAdjustment: false };
  }

  const quantity = Number(draft.quantity);
  if (!/^\d+$/.test(draft.quantity) || !Number.isSafeInteger(quantity) || quantity < 1) {
    return { balance: null, error: "조정 횟수는 1 이상의 정수로 입력해 주세요.", hasAdjustment: true };
  }

  const balance = draft.direction === "add" ? current + quantity : current - quantity;
  if (balance < 0) {
    return { balance: null, error: "잔여 횟수보다 많이 차감할 수 없습니다.", hasAdjustment: true };
  }
  if (!Number.isSafeInteger(balance)) {
    return { balance: null, error: "조정 횟수가 너무 큽니다.", hasAdjustment: true };
  }
  return { balance, error: draft.reason.trim() ? "" : "변경 사유를 입력해 주세요.", hasAdjustment: true };
}

export function AdminNotificationManage() {
  const sharedBalance = useMockExpertAlertBalance();
  const [localMembers, setMembers] = useState<NotificationMember[]>([
    {
      id: 1,
      memberNumber: mockExpertMembership.memberNumber,
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
  const [drafts, setDrafts] = useState<Record<number, AdjustmentDraft>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const members = localMembers.map((member) => {
    if (!sharedBalance || member.memberNumber !== mockExpertMembership.memberNumber) return member;
    return {
      ...member,
      grade: mockExpertMembership.grade,
      company: mockExpertProfileDto.expert_profile.company_name,
      email: mockExpertProfileDto.user.email,
      remainingCount: sharedBalance.remainingCount,
      lastAdjustment: sharedBalance.lastAdjustment,
    };
  });

  const rows = members.map((member) => {
    const draft = drafts[member.id] ?? emptyDraft;
    const serviceStatus = draft.serviceStatus ?? member.serviceStatus;
    return { member, draft, serviceStatus, ...previewAdjustment(member.remainingCount, draft) };
  });
  const canSave =
    rows.some(({ member, serviceStatus, hasAdjustment }) => hasAdjustment || serviceStatus !== member.serviceStatus) &&
    rows.every(({ error }) => !error);

  const updateDraft = (id: number, change: Partial<AdjustmentDraft>) => {
    setDrafts((prev) => ({ ...prev, [id]: { ...(prev[id] ?? emptyDraft), ...change } }));
  };

  const handleToggleService = (member: NotificationMember, status: NotificationMember["serviceStatus"]) => {
    const serviceStatus = status === "continue" ? "suspended" : "continue";
    if (isEditing) {
      updateDraft(member.id, { serviceStatus });
      return;
    }
    setMembers((prev) =>
      prev.map((m) => m.id === member.id ? { ...m, serviceStatus } : m),
    );
  };

  const handleSave = async () => {
    if (!canSave || isSaving) return;
    setSaveError("");
    const target = rows.find(({ member }) => member.memberNumber === mockExpertMembership.memberNumber);
    if (sharedBalance && target?.hasAdjustment && target.balance !== null) {
      setIsSaving(true);
      try {
        const saved = await saveMockExpertAlertBalance(
          target.member.remainingCount, target.balance, target.draft.reason.trim(),
        );
        if (!saved) {
          setSaveError("다른 화면에서 잔여 횟수가 변경되었습니다. 조정 후 횟수를 다시 확인해 주세요.");
          return;
        }
      } catch {
        setSaveError("이 브라우저에 변경사항을 저장할 수 없습니다. 브라우저 저장 공간을 확인해 주세요.");
        return;
      } finally {
        setIsSaving(false);
      }
    }
    setMembers(
      rows.map(({ member, draft, serviceStatus, balance, hasAdjustment }) => {
        if (!hasAdjustment || balance === null) return { ...member, serviceStatus };
        return {
          ...member,
          serviceStatus,
          remainingCount: balance,
          lastAdjustment: { delta: balance - member.remainingCount, reason: draft.reason.trim() },
        };
      }),
    );
    setDrafts({});
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
          mockExpertPlans[m.grade].alertLimit,
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
            {sharedBalance
              ? `예시 회원 ${mockExpertMembership.memberNumber}의 잔여 횟수는 이 브라우저에 저장되며 전문가 마이페이지에도 반영됩니다.`
              : "예시 데이터입니다. 변경사항은 이 화면에서만 유지됩니다."}
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
      <fieldset disabled={isSaving} className="min-w-0 border border-gray-300 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {[
                  ...(isEditing ? ["잔여 횟수 조정"] : []),
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
              {rows.map(({ member: m, draft, serviceStatus, balance, error, hasAdjustment }, i) => (
                <tr
                  key={m.id}
                  className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                >
                  {isEditing && (
                    <td className="min-w-48 border-b border-r border-gray-200 px-2 py-2">
                      <div className="flex items-center gap-1">
                        <select
                          aria-label={`${m.memberNumber} 조정 유형`}
                          className="h-7 rounded-md border bg-white px-1"
                          value={draft.direction}
                          onChange={(e) => updateDraft(m.id, { direction: e.target.value === "deduct" ? "deduct" : "add" })}
                        >
                          <option value="add">추가</option>
                          <option value="deduct">차감</option>
                        </select>
                        <Input
                          inputMode="numeric"
                          aria-label={`${m.memberNumber} 조정 횟수`}
                          aria-describedby={`preview-${m.id}`}
                          placeholder="횟수"
                          value={draft.quantity}
                          onChange={(e) => updateDraft(m.id, { quantity: e.target.value })}
                          className="h-7 w-20 text-xs"
                        />
                        <span>회</span>
                      </div>
                      <Input
                        aria-label={`${m.memberNumber} 변경 사유`}
                        aria-describedby={`preview-${m.id}`}
                        placeholder="변경 사유"
                        value={draft.reason}
                        onChange={(e) => updateDraft(m.id, { reason: e.target.value })}
                        className="mt-1 h-7 text-xs"
                      />
                      <div id={`preview-${m.id}`} aria-live="polite">
                        {hasAdjustment && balance !== null && (
                          <p className="mt-1 font-medium">현재 {m.remainingCount}회 → 조정 후 {balance}회</p>
                        )}
                        {error && <p className="mt-1 text-red-700">{error}</p>}
                      </div>
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
                    {mockExpertPlans[m.grade].alertLimit}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                    {m.usedCount}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-center font-semibold">
                    {m.remainingCount}
                    {m.lastAdjustment && (
                      <p className="mt-1 min-w-24 max-w-48 break-words text-left font-normal text-gray-600">
                        최근 {Math.abs(m.lastAdjustment.delta)}회 {m.lastAdjustment.delta > 0 ? "추가" : "차감"} · {m.lastAdjustment.reason}
                      </p>
                    )}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1">
                    <button
                      onClick={() => handleToggleService(m, serviceStatus)}
                      className={`px-2 py-0.5 rounded border text-xs font-medium transition-colors ${serviceStatus === "continue" ? "text-blue-600 border-blue-300 hover:bg-blue-50" : "text-red-600 border-red-300 hover:bg-red-50"}`}
                    >
                      {serviceStatus === "continue" ? "계속" : "정지"}
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
      </fieldset>

      {/* 수정/저장 버튼 */}
      {saveError && <p role="alert" className="text-sm text-red-700">{saveError}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs px-6"
          disabled={isSaving}
          onClick={() => {
            setIsEditing(!isEditing);
            setDrafts({});
            setSaveError("");
          }}
        >
          {isEditing ? "취소" : "수정"}
        </Button>
        <Button
          size="sm"
          className="bg-[#009689] hover:bg-[#007d71] text-xs px-6"
          disabled={!isEditing || !canSave || isSaving}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
