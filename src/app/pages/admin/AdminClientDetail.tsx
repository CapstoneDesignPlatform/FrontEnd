import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Ban,
  CheckCircle,
} from "lucide-react";

interface StatusHistory {
  date: string;
  content: string;
  status: "정상" | "정지" | "탈퇴";
}

interface Project {
  id: number;
  code: string;
  title: string;
  status: string;
  createdAt: string;
}

interface Client {
  id: string;
  memberNumber: string;
  name: string;
  company: string;
  businessNumber: string;
  phone: string;
  email: string;
  address: string;
  registeredAt: string;
  projects: Project[];
}

export function AdminClientDetail() {
  const { id } = useParams();
  const [clientStatus, setClientStatus] = useState<"active" | "suspended">(
    "active",
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([
    { date: "2026-03-01 10:00", content: "회원 가입 완료", status: "정상" },
  ]);

  const allClients: Client[] = [
    {
      id: "1",
      memberNumber: "CL-2026-0001",
      name: "김철수",
      company: "(주)대한건설",
      businessNumber: "123-45-67890",
      phone: "010-1111-2222",
      email: "client@example.com",
      address: "서울특별시 강남구 테헤란로 123",
      registeredAt: "2026-03-01 10:00",
      projects: [
        {
          id: 1,
          code: "REQ-L5X9K2M",
          title: "건설업 일반건설업(토목공사업) 면허 취득",
          status: "matched",
          createdAt: "2026-04-05",
        },
        {
          id: 2,
          code: "REQ-M3P7N1K",
          title: "실태조사 대응용 재무자료 검토",
          status: "completed",
          createdAt: "2026-03-28",
        },
      ],
    },
    {
      id: "2",
      memberNumber: "CL-2026-0002",
      name: "이영희",
      company: "한국제조(주)",
      businessNumber: "234-56-78901",
      phone: "010-2222-3333",
      email: "lee@example.com",
      address: "서울특별시 서초구 서초대로 456",
      registeredAt: "2026-03-05 11:00",
      projects: [
        {
          id: 3,
          code: "REQ-K9L2M5P",
          title: "제조업 실태 조사",
          status: "completed",
          createdAt: "2026-04-04",
        },
      ],
    },
    {
      id: "3",
      memberNumber: "CL-2026-0003",
      name: "박민수",
      company: "전기산업(주)",
      businessNumber: "345-67-89012",
      phone: "010-3333-4444",
      email: "park@example.com",
      address: "서울특별시 송파구 올림픽로 789",
      registeredAt: "2026-03-10 09:30",
      projects: [],
    },
    {
      id: "4",
      memberNumber: "CL-2026-0004",
      name: "정수현",
      company: "(주)IT솔루션",
      businessNumber: "456-78-90123",
      phone: "010-4444-5555",
      email: "jung@example.com",
      address: "서울특별시 마포구 홍익로 321",
      registeredAt: "2026-02-20 14:00",
      projects: [
        {
          id: 4,
          code: "REQ-N7M4K1L",
          title: "정보통신공사업 등록",
          status: "unmatched",
          createdAt: "2026-04-02",
        },
      ],
    },
    {
      id: "5",
      memberNumber: "CL-2026-0005",
      name: "최영수",
      company: "안전소방(주)",
      businessNumber: "567-89-01234",
      phone: "010-5555-6666",
      email: "choi@example.com",
      address: "경기도 성남시 분당구 판교로 111",
      registeredAt: "2026-02-15 10:00",
      projects: [],
    },
  ];

  const client = allClients.find((c) => c.id === id) ?? allClients[0];

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case "matched":
        return (
          <Badge className="bg-blue-100 text-blue-700">전문가 매칭됨</Badge>
        );
      case "completed":
        return <Badge className="bg-green-100 text-green-700">완료</Badge>;
      case "unmatched":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            매칭 대기
          </Badge>
        );
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const handleStatusChange = () => {
    if (clientStatus === "active") {
      const reason = prompt("정지 사유를 입력해주세요:");
      if (!reason) return;
      const confirmed = confirm(
        `${client.name}님을 정지하시겠습니까?\n\n사유: ${reason}`,
      );
      if (!confirmed) return;
    } else {
      const confirmed = confirm(
        `${client.name}님을 정상으로 복구하시겠습니까?`,
      );
      if (!confirmed) return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newStatus = clientStatus === "active" ? "suspended" : "active";
      setClientStatus(newStatus);
      setIsProcessing(false);
      const now = new Date().toLocaleString("ko-KR");
      setStatusHistory((prev: StatusHistory[]) => [
        {
          date: now,
          content:
            newStatus === "suspended"
              ? "관리자에 의해 정지"
              : "관리자에 의해 정상 복구",
          status: newStatus === "suspended" ? "정지" : "정상",
        },
        ...prev,
      ]);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/clients">
                <ArrowLeft className="h-4 w-4 mr-1" />
                의뢰인 목록으로
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            {clientStatus === "active" ? (
              <Badge className="bg-green-100 text-green-700">정상</Badge>
            ) : (
              <Badge className="bg-red-100 text-red-700">정지</Badge>
            )}
            <span className="text-sm text-gray-500">
              회원번호: {client.memberNumber}
            </span>
          </div>
          <h1 className="text-3xl mb-2">{client.name}</h1>
          <p className="text-gray-600">{client.company}</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button
            size="sm"
            variant="outline"
            className="gap-1 text-xs"
            onClick={() => {
              import("xlsx").then((XLSX) => {
                const wb = XLSX.utils.book_new();

                // 시트1: 기본 정보 + 현황
                const ws1 = XLSX.utils.aoa_to_sheet([
                  ["항목", "내용"],
                  ["이름", client.name],
                  ["회원번호", client.memberNumber],
                  ["업체명", client.company],
                  ["사업자등록번호", client.businessNumber],
                  ["연락처", client.phone],
                  ["이메일", client.email],
                  ["주소", client.address],
                  ["가입일", client.registeredAt],
                  ["상태", clientStatus === "active" ? "정상" : "정지"],
                  ["총 의뢰 수", `${client.projects.length}건`],
                ]);
                ws1["!cols"] = [{ wch: 16 }, { wch: 40 }];
                XLSX.utils.book_append_sheet(wb, ws1, "기본정보");

                // 시트2: 현황 이력
                const ws2 = XLSX.utils.aoa_to_sheet([
                  ["일시", "내용", "현재상태"],
                  ...statusHistory.map((h) => [h.date, h.content, h.status]),
                ]);
                ws2["!cols"] = [{ wch: 20 }, { wch: 30 }, { wch: 10 }];
                XLSX.utils.book_append_sheet(wb, ws2, "현황이력");

                // 시트3: 의뢰 목록
                if (client.projects.length > 0) {
                  const statusLabel = (s: string) =>
                    s === "matched"
                      ? "전문가 매칭됨"
                      : s === "completed"
                        ? "완료"
                        : "매칭 대기";
                  const ws3 = XLSX.utils.aoa_to_sheet([
                    ["의뢰코드", "의뢰명", "상태", "등록일"],
                    ...client.projects.map((p) => [
                      p.code,
                      p.title,
                      statusLabel(p.status),
                      p.createdAt,
                    ]),
                  ]);
                  ws3["!cols"] = [
                    { wch: 16 },
                    { wch: 40 },
                    { wch: 14 },
                    { wch: 12 },
                  ];
                  XLSX.utils.book_append_sheet(wb, ws3, "의뢰목록");
                }

                XLSX.writeFile(
                  wb,
                  `의뢰인상세_${client.name}_${new Date().toISOString().slice(0, 10)}.xlsx`,
                );
              });
            }}
          >
            <Download className="h-3 w-3" />
            Excel 다운로드
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={
              clientStatus === "active"
                ? "text-red-600 border-red-200 hover:bg-red-50"
                : "text-green-600 border-green-200 hover:bg-green-50"
            }
            onClick={handleStatusChange}
            disabled={isProcessing}
          >
            {clientStatus === "active" ? (
              <>
                <Ban className="h-4 w-4 mr-1" />
                정지
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                정상 복구
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* 기본 정보 - 엑셀 (관)의뢰인 회원카드 시트 기준 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              기본 정보
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-28">
                    이름
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    {client.name}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-28">
                    회원번호
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5 font-mono">
                    {client.memberNumber}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    업체명
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    {client.company}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    사업자등록번호
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5 font-mono">
                    {client.businessNumber}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    연락처
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    {client.phone}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    이메일
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">
                    {client.email}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    주소
                  </td>
                  <td
                    colSpan={3}
                    className="border-b border-gray-200 px-3 py-1.5"
                  >
                    {client.address}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    가입일
                  </td>
                  <td colSpan={3} className="px-3 py-1.5">
                    {client.registeredAt}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 현황 이력 - 엑셀 (관)의뢰인 회원카드 시트 기준 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              현황 이력
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {["일시", "내용", "현재상태"].map((h) => (
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
                  {statusHistory.map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-blue-50 transition-colors ${index % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                        {item.date}
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1">
                        {item.content}
                      </td>
                      <td className="border-b border-gray-200 px-2 py-1">
                        {item.status === "정상" && (
                          <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                            정상
                          </span>
                        )}
                        {item.status === "정지" && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                            정지
                          </span>
                        )}
                        {item.status === "탈퇴" && (
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                            탈퇴
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 의뢰 목록 - 엑셀 스타일 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              의뢰 목록 (총 {client.projects.length}건)
            </div>
            {client.projects.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">
                등록된 의뢰가 없습니다.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {["의뢰코드", "의뢰명", "상태", "등록일", "상세"].map(
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
                    {client.projects.map((project, i) => (
                      <tr
                        key={project.id}
                        className={`hover:bg-blue-50 transition-colors ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                      >
                        <td className="border-b border-r border-gray-200 px-2 py-1 font-mono whitespace-nowrap">
                          {project.code}
                        </td>
                        <td className="border-b border-r border-gray-200 px-2 py-1">
                          {project.title}
                        </td>
                        <td className="border-b border-r border-gray-200 px-2 py-1">
                          {project.status === "matched" && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                              전문가 매칭됨
                            </span>
                          )}
                          {project.status === "completed" && (
                            <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                              완료
                            </span>
                          )}
                          {project.status === "unmatched" && (
                            <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700">
                              매칭 대기
                            </span>
                          )}
                        </td>
                        <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                          {project.createdAt}
                        </td>
                        <td className="border-b border-gray-200 px-2 py-1">
                          <Link
                            to={`/admin/projects/${project.id}`}
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
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* 가입 정보 - 엑셀 스타일 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              가입 정보
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {[
                  ["가입일", client.registeredAt],
                  ["총 의뢰 수", `${client.projects.length}건`],
                  ["상태", clientStatus === "active" ? "정상" : "정지"],
                ].map(([label, value], i) => (
                  <tr
                    key={label}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap last:border-b-0">
                      {label}
                    </td>
                    <td
                      className={`border-b border-gray-200 px-3 py-1.5 last:border-b-0 ${label === "상태" ? (clientStatus === "active" ? "text-green-700 font-semibold" : "text-red-700 font-semibold") : ""}`}
                    >
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
