import { useParams, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import { useState } from "react";
import { exportToExcel } from "../../utils/exportExcel";

interface NotificationHistory {
  date: string;
  description: string;
  charged: number;
  deducted: number;
  balance: number;
  note: "입금" | "무상" | "환급" | "";
}

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
    description: "의뢰 알림 발송 (3건)",
    charged: 0,
    deducted: 27273,
    balance: 63636,
    note: "",
  },
  {
    date: "2026-04-10",
    description: "의뢰 알림 발송 (2건)",
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
    description: "의뢰 알림 발송 (2건)",
    charged: 0,
    deducted: 18182,
    balance: 45454,
    note: "",
  },
];

export function AdminNotificationMember() {
  const { memberNumber } = useParams();
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-04-30");

  const memberInfo = {
    memberNumber: memberNumber || "EX-2026-0001",
    company: "케이법무법인",
    businessNumber: "123-45-67890",
  };
  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();

      // 시트1: 회원 정보
      const ws1 = XLSX.utils.aoa_to_sheet([
        ["항목", "내용"],
        ["회원번호", memberInfo.memberNumber],
        ["상호명", memberInfo.company],
        ["사업자등록번호", memberInfo.businessNumber],
        ["조회 기간", `${startDate} ~ ${endDate}`],
      ]);
      ws1["!cols"] = [{ wch: 16 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, ws1, "회원정보");

      // 시트2: 알림서비스 이용 내역
      const totalCharged = history.reduce((s, h) => s + h.charged, 0);
      const totalDeducted = history.reduce((s, h) => s + h.deducted, 0);
      const ws2 = XLSX.utils.aoa_to_sheet([
        ["일시", "내역", "입금액", "차감액", "잔고", "비고"],
        ...history.map((h) => [
          h.date,
          h.description,
          h.charged > 0 ? h.charged : "-",
          h.deducted > 0 ? h.deducted : "-",
          h.balance,
          h.note,
        ]),
        [],
        [
          "합계",
          "",
          totalCharged,
          totalDeducted,
          history[history.length - 1]?.balance ?? 0,
          "",
        ],
      ]);
      ws2["!cols"] = [12, 28, 12, 12, 12, 8].map((wch) => ({ wch }));
      XLSX.utils.book_append_sheet(wb, ws2, "이용내역");

      // 시트3: 거래 유형별 요약
      const ws3 = XLSX.utils.aoa_to_sheet([
        ["거래 유형", "건수", "금액"],
        [
          "입금",
          history.filter((h) => h.note === "입금").length,
          history
            .filter((h) => h.note === "입금")
            .reduce((s, h) => s + h.charged, 0),
        ],
        [
          "무상",
          history.filter((h) => h.note === "무상").length,
          history
            .filter((h) => h.note === "무상")
            .reduce((s, h) => s + h.charged, 0),
        ],
        [
          "환급",
          history.filter((h) => h.note === "환급").length,
          history
            .filter((h) => h.note === "환급")
            .reduce((s, h) => s + h.charged, 0),
        ],
        [
          "차감(발송)",
          history.filter((h) => h.deducted > 0).length,
          history
            .filter((h) => h.deducted > 0)
            .reduce((s, h) => s + h.deducted, 0),
        ],
        ["현재 잔고", "", history[history.length - 1]?.balance ?? 0],
      ]);
      ws3["!cols"] = [{ wch: 14 }, { wch: 8 }, { wch: 14 }];
      XLSX.utils.book_append_sheet(wb, ws3, "거래유형요약");

      XLSX.writeFile(
        wb,
        `알림서비스_${memberInfo.memberNumber}_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/notifications/manage">
            <ArrowLeft className="h-4 w-4 mr-1" />
            알림서비스 사용관리로
          </Link>
        </Button>
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

      <div>
        <h1 className="text-xl font-bold">알림서비스 회원별 현황</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          회원의 알림서비스 신청 및 이용 내역을 확인합니다.
        </p>
      </div>

      {/* 회원 정보 */}
      <div className="flex gap-4 bg-white border border-gray-200 rounded px-4 py-3 text-xs">
        {[
          ["회원번호", memberInfo.memberNumber],
          ["상호명", memberInfo.company],
          ["사업자등록번호", memberInfo.businessNumber],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-gray-500 mb-0.5">{label}</p>
            <p className="font-semibold font-mono">{value}</p>
          </div>
        ))}
      </div>

      {/* 조회 기간 */}
      <div className="flex flex-wrap items-center gap-3 bg-white border border-gray-200 rounded px-4 py-3">
        <div className="flex items-center gap-2">
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
        <Button
          size="sm"
          className="bg-[#34499C] hover:bg-[#2a3d84] h-7 text-xs"
        >
          조회
        </Button>
      </div>

      {/* 테이블 */}
      <div>
        <p className="text-xs text-gray-500 mb-1">
          {startDate} ~ {endDate}
        </p>
        <div className="border border-gray-300 rounded overflow-hidden">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {["일시", "내역", "입금액", "차감액", "잔고", "비고"].map(
                  (h) => (
                    <th
                      key={h}
                      className="border-b border-r border-gray-300 px-2 py-1.5 text-left font-semibold text-gray-700 whitespace-nowrap last:border-r-0"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {history.map((item, i) => (
                <tr
                  key={i}
                  className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1">
                    {item.description}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-right">
                    {item.charged > 0
                      ? `₩${item.charged.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-right text-red-600">
                    {item.deducted > 0
                      ? `₩${item.deducted.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="border-b border-r border-gray-200 px-2 py-1 text-right font-semibold">
                    ₩{item.balance.toLocaleString()}
                  </td>
                  <td className="border-b border-gray-200 px-2 py-1">
                    {item.note === "입금" && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs px-1 py-0">
                        입금
                      </Badge>
                    )}
                    {item.note === "무상" && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs px-1 py-0">
                        무상
                      </Badge>
                    )}
                    {item.note === "환급" && (
                      <Badge className="bg-orange-100 text-orange-700 text-xs px-1 py-0">
                        환급
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" size="sm" className="text-xs px-6">
          수정
        </Button>
        <Button
          size="sm"
          className="bg-[#009689] hover:bg-[#007d71] text-xs px-6"
        >
          저장
        </Button>
      </div>
    </div>
  );
}
