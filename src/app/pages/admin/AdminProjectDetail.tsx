import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getAnnouncementDetail,
  updateAnnouncementStatus,
} from "../../../api/admin/clientApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import {
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  Users,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  ArrowLeft,
  Clock,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Download } from "lucide-react";
import { exportToExcel } from "../../utils/exportExcel";

type ProjectStatus =
  | "bidding"
  | "closed"
  | "paid"
  | "in_progress"
  | "association"
  | "sent"
  | "completed";

interface Project {
  id: string;
  code: string;
  title: string;
  type: string;
  industry: string;
  description: string;
  budget: string;
  deadline: string;
  location: string;
  requirements: string;
  createdAt: string;
  updatedAt: string;
  initialStatus: ProjectStatus;
  client: { name: string; email: string; phone: string; isGuest: boolean };
  company: {
    name: string;
    businessType: string;
    businessNumber: string;
    representative: string;
    address: string;
    phone: string;
    establishedDate: string;
    capital: string;
    employees: number;
  };
  selectedExpert?: {
    id: number;
    name: string;
    company: string;
    phone: string;
    email: string;
    price: string;
    selectedAt: string;
  };
  bids: {
    id: number;
    expertName: string;
    company: string;
    phone: string;
    email: string;
    price: string;
    estimatedDays: number;
    message: string;
    verified: boolean;
    bidAt: string;
    isSelected: boolean;
  }[];
}

export function AdminProjectDetail() {
  const { id } = useParams();
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("bidding");
  const [project, setProject] = useState<Project>({
    id: "",
    code: "",
    title: "-",
    type: "-",
    industry: "-",
    description: "-",
    budget: "-",
    deadline: "-",
    location: "-",
    requirements: "-",
    createdAt: "-",
    updatedAt: "-",
    initialStatus: "bidding",
    client: { name: "-", email: "-", phone: "-", isGuest: false },
    company: {
      name: "-",
      businessType: "-",
      businessNumber: "-",
      representative: "-",
      address: "-",
      phone: "-",
      establishedDate: "-",
      capital: "-",
      employees: 0,
    },
    bids: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getAnnouncementDetail(id)
      .then((res) => {
        const a = res.data;
        const STATUS_MAP: Record<string, ProjectStatus> = {
          BIDDING: "bidding",
          CLOSED: "closed",
          PAID: "paid",
          IN_PROGRESS: "in_progress",
          ASSOCIATION: "association",
          SENT: "sent",
          COMPLETED: "completed",
        };
        setProject({
          id,
          code: a.announcementCode,
          title: `${a.industry} - ${a.purpose}`,
          type: a.purpose ?? "-",
          industry: a.industry ?? "-",
          description: "-",
          budget: "-",
          deadline: "-",
          location: "-",
          requirements: "-",
          createdAt: a.createdAt?.slice(0, 10) ?? "-",
          updatedAt: a.createdAt?.slice(0, 10) ?? "-",
          initialStatus: STATUS_MAP[a.status] ?? "bidding",
          client: {
            name: a.clientName ?? "-",
            email: "-",
            phone: a.clientContact ?? "-",
            isGuest: false,
          },
          company: {
            name: a.companyName ?? "-",
            businessType: a.businessOwnerType ?? "-",
            businessNumber: "-",
            representative: a.clientName ?? "-",
            address: "-",
            phone: a.clientContact ?? "-",
            establishedDate: "-",
            capital: "-",
            employees: 0,
          },
          bids: (a.bids ?? []).map((b: any) => ({
            id: b.bidId,
            expertName: b.expertName ?? "-",
            company: b.expertCompany ?? "-",
            phone: b.expertContact ?? "-",
            email: "-",
            price: b.bidAmount
              ? `₩${Number(b.bidAmount).toLocaleString()}`
              : "-",
            estimatedDays: 0,
            message: "-",
            verified: false,
            bidAt: b.submittedAt?.slice(0, 10) ?? "-",
            isSelected: b.bidStatus === "SELECTED",
          })),
        });
        setProjectStatus(STATUS_MAP[a.status] ?? "bidding");
      })
      .catch(() => setError("데이터를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-sm text-gray-500">
        불러오는 중...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center py-20 text-sm text-red-500">
        {error}
      </div>
    );

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "bidding":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            입찰 중
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            마감
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700">
            결제
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
            진단시작
          </Badge>
        );
      case "association":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-700">
            협회경유
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-700">
            발송
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-teal-100 text-teal-700">
            완료
          </Badge>
        );
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    const labels: Record<ProjectStatus, string> = {
      bidding: "입찰 중",
      closed: "마감",
      paid: "결제",
      in_progress: "진단시작",
      association: "협회경유",
      sent: "발송",
      completed: "완료",
    };
    return labels[status];
  };

  const handleStatusChange = async (value: string) => {
    try {
      await updateAnnouncementStatus(project.code, value);
      setProjectStatus(value as ProjectStatus);
      alert(
        `공고 상태를 "${getStatusLabel(value as ProjectStatus)}"로 변경했습니다.`,
      );
    } catch {
      alert("상태 변경에 실패했습니다.");
    }
  };

  const sortedBids = [...project.bids].sort(
    (a, b) =>
      parseInt(a.price.replace(/[^0-9]/g, "")) -
      parseInt(b.price.replace(/[^0-9]/g, "")),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/projects">
                <ArrowLeft className="h-4 w-4 mr-1" />
                목록으로
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <Badge variant="outline">{project.type}</Badge>
            <Badge variant="outline">{project.industry}</Badge>
            {getStatusBadge(projectStatus)}
          </div>
          <h1 className="text-3xl mb-2">{project.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              의뢰 코드:{" "}
              <span className="font-mono font-semibold">{project.code}</span>
            </span>
            <span>•</span>
            <span>등록일: {project.createdAt}</span>
            <span>•</span>
            <span>최종 수정: {project.updatedAt}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Button
            size="sm"
            variant="outline"
            className="gap-1 text-xs"
            onClick={() => {
              // 시트 1: 의뢰 기본 정보
              const ws1Data = [
                ["항목", "내용"],
                ["의뢰코드", project.code],
                ["공고명", project.title],
                ["유형", project.type],
                ["업종", project.industry],
                ["상태", getStatusLabel(projectStatus)],
                ["예산", project.budget],
                ["희망완료일", project.deadline],
                ["지역", project.location],
                ["등록일", project.createdAt],
                ["최종수정일", project.updatedAt],
                ["", ""],
                ["=== 의뢰 내용 ===", ""],
                ["설명", project.description],
                ["필수 요구사항", project.requirements],
                ["", ""],
                ["=== 의뢰인 정보 ===", ""],
                ["의뢰인 이름", project.client.name],
                ["이메일", project.client.email],
                ["연락처", project.client.phone],
                ["회원유형", project.client.isGuest ? "비회원" : "정회원"],
                ["", ""],
                ["=== 기업 정보 ===", ""],
                ["기업명", project.company.name],
                ["사업자 유형", project.company.businessType],
                ["사업자등록번호", project.company.businessNumber],
                ["대표자명", project.company.representative],
                ["대표 전화", project.company.phone],
                ["주소", project.company.address],
                ["설립일", project.company.establishedDate],
                ["자본금", project.company.capital],
                ["직원 수", `${project.company.employees}명`],
              ];

              // 시트 2: 입찰 현황
              const ws2Headers = [
                "전문가명",
                "소속",
                "연락처",
                "이메일",
                "입찰가",
                "예상기간(일)",
                "입찰일시",
                "인증여부",
                "선택여부",
                "메시지",
              ];
              const ws2Rows = sortedBids.map((bid) => [
                bid.expertName,
                bid.company,
                bid.phone,
                bid.email,
                bid.price,
                bid.estimatedDays,
                bid.bidAt,
                bid.verified ? "인증" : "-",
                bid.isSelected ? "선택됨" : "-",
                bid.message,
              ]);

              // 시트 3: 선택된 전문가 (있을 경우)
              const ws3Data = project.selectedExpert
                ? [
                    ["항목", "내용"],
                    ["전문가명", project.selectedExpert.name],
                    ["소속", project.selectedExpert.company],
                    ["연락처", project.selectedExpert.phone],
                    ["이메일", project.selectedExpert.email],
                    ["확정금액", project.selectedExpert.price],
                    ["선택일", project.selectedExpert.selectedAt],
                  ]
                : [
                    ["항목", "내용"],
                    ["선택된 전문가 없음", ""],
                  ];

              // 입찰 통계
              const avgPrice = Math.round(
                sortedBids.reduce(
                  (s, b) => s + parseInt(b.price.replace(/[^0-9]/g, "")),
                  0,
                ) / sortedBids.length,
              );
              const ws3DataFull = [
                ...ws3Data,
                ["", ""],
                ["=== 입찰 통계 ===", ""],
                ["총 입찰자", `${project.bids.length}명`],
                ["최저 입찰가", sortedBids[0]?.price ?? "-"],
                [
                  "최고 입찰가",
                  sortedBids[sortedBids.length - 1]?.price ?? "-",
                ],
                ["평균 입찰가", `₩${avgPrice.toLocaleString()}`],
                [
                  "인증 전문가",
                  `${project.bids.filter((b) => b.verified).length}명`,
                ],
              ];

              import("xlsx").then((XLSX) => {
                const wb = XLSX.utils.book_new();

                // 시트 1: 의뢰 정보
                const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);
                ws1["!cols"] = [{ wch: 20 }, { wch: 50 }];
                XLSX.utils.book_append_sheet(wb, ws1, "의뢰정보");

                // 시트 2: 입찰현황
                const ws2 = XLSX.utils.aoa_to_sheet([ws2Headers, ...ws2Rows]);
                ws2["!cols"] = ws2Headers.map((h, i) => ({
                  wch: Math.max(
                    h.length * 2,
                    ...ws2Rows.map((r) => String(r[i] ?? "").length * 1.2),
                  ),
                }));
                XLSX.utils.book_append_sheet(wb, ws2, "입찰현황");

                // 시트 3: 선택전문가+통계
                const ws3 = XLSX.utils.aoa_to_sheet(ws3DataFull);
                ws3["!cols"] = [{ wch: 20 }, { wch: 30 }];
                XLSX.utils.book_append_sheet(wb, ws3, "선택전문가_통계");

                XLSX.writeFile(
                  wb,
                  `의뢰상세_${project.code}_${new Date().toISOString().slice(0, 10)}.xlsx`,
                );
              });
            }}
          >
            <Download className="h-3 w-3" />
            Excel 다운로드
          </Button>
          <label className="text-xs text-gray-600">진행 상태 변경</label>
          <Select value={projectStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bidding">입찰 중</SelectItem>
              <SelectItem value="closed">마감</SelectItem>
              <SelectItem value="paid">결제</SelectItem>
              <SelectItem value="in_progress">진단시작</SelectItem>
              <SelectItem value="association">협회경유</SelectItem>
              <SelectItem value="sent">발송</SelectItem>
              <SelectItem value="completed">완료</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* 의뢰 내용 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              의뢰 내용
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-28">
                    등록일자
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">
                    {project.createdAt}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                    진단 업종
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">
                    {project.industry}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                    구분
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">
                    {project.type}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                    필요 면허
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">
                    {project.requirements}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap">
                    자산규모
                  </td>
                  <td className="px-3 py-1.5">{project.budget}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 기업 정보 - 엑셀 스타일 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              기업 정보
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-28">
                    기업명
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    {project.company.name}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-28">
                    사업자 유형
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">
                    {project.company.businessType}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    사업자등록번호
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-mono">
                    {project.company.businessNumber}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    대표자명
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">
                    {project.company.representative}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    대표 전화
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    {project.company.phone}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    휴대전화
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">-</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    주소
                  </td>
                  <td colSpan={3} className="px-3 py-1.5">
                    {project.company.address}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 의뢰인 정보 - 엑셀 스타일 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              의뢰인 정보
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-28">
                    이름
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    {project.client.name}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-28">
                    회원 유형
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs ${project.client.isGuest ? "bg-gray-100 text-gray-600" : "bg-teal-50 text-teal-700"}`}
                    >
                      {project.client.isGuest ? "비회원" : "정회원"}
                    </span>
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    이메일
                  </td>
                  <td className="border-r border-gray-200 px-3 py-1.5">
                    {project.client.email}
                  </td>
                  <td className="border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    연락처
                  </td>
                  <td className="px-3 py-1.5">{project.client.phone}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 선택된 전문가 - 엑셀 스타일 */}
          {project.selectedExpert && (
            <div className="border border-blue-300 rounded overflow-hidden">
              <div className="bg-blue-50 border-b border-blue-300 px-3 py-1.5 text-xs font-semibold text-blue-700">
                ✓ 선택된 전문가
              </div>
              <table className="w-full text-xs border-collapse">
                <tbody>
                  <tr className="bg-white">
                    <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-24">
                      전문가명
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-blue-700">
                      {project.selectedExpert.name}
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-24">
                      소속
                    </td>
                    <td className="border-b border-gray-200 px-3 py-1.5">
                      {project.selectedExpert.company}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                      연락처
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-1.5">
                      {project.selectedExpert.phone}
                    </td>
                    <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                      이메일
                    </td>
                    <td className="border-b border-gray-200 px-3 py-1.5">
                      {project.selectedExpert.email}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                      확정금액
                    </td>
                    <td className="border-r border-gray-200 px-3 py-1.5 font-bold text-blue-700">
                      {project.selectedExpert.price}
                    </td>
                    <td className="border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                      선택일
                    </td>
                    <td className="px-3 py-1.5">
                      {project.selectedExpert.selectedAt}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 입찰 전문가 목록 - 엑셀 스타일 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              입찰 전문가 목록 (총 {project.bids.length}명 · 최저가순)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {[
                      "전문가명",
                      "소속",
                      "연락처",
                      "이메일",
                      "입찰가",
                      "예상기간",
                      "입찰일시",
                      "인증",
                      "상태",
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
                  {sortedBids.map((bid, index) => (
                    <tr
                      key={bid.id}
                      className={`hover:bg-teal-50 transition-colors ${bid.isSelected ? "bg-blue-50" : index % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                    >
                      <td className="border-b border-r border-gray-200 px-2 py-1 font-medium whitespace-nowrap">
                        {bid.expertName}
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                        {bid.company}
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                        {bid.phone}
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1">
                        {bid.email}
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1 font-semibold text-teal-700 whitespace-nowrap">
                        {bid.price}
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                        {bid.estimatedDays}일
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                        {bid.bidAt}
                      </td>
                      <td className="border-b border-r border-gray-200 px-2 py-1 text-center">
                        {bid.verified ? "✓" : "-"}
                      </td>
                      <td className="border-b border-gray-200 px-2 py-1">
                        {bid.isSelected ? (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs">
                            선택됨
                          </span>
                        ) : index < 3 ? (
                          <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-xs">
                            TOP{index + 1}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* 의뢰 정보 - 엑셀 스타일 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              의뢰 정보
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {[
                  ["예상 예산", project.budget],
                  ["희망 완료일", project.deadline],
                  ["지역", project.location],
                  ["입찰 전문가", `${project.bids.length}명`],
                  ["등록일", project.createdAt],
                  ["최종 수정", project.updatedAt],
                ].map(([label, value], i) => (
                  <tr
                    key={label}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap last:border-b-0">
                      {label}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-1.5 font-medium last:border-b-0">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 입찰 통계 - 엑셀 스타일 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              입찰 통계
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {[
                  ["최저 입찰가", sortedBids[0]?.price ?? "-"],
                  [
                    "최고 입찰가",
                    sortedBids[sortedBids.length - 1]?.price ?? "-",
                  ],
                  [
                    "평균 입찰가",
                    `₩${Math.round(sortedBids.reduce((s, b) => s + parseInt(b.price.replace(/[^0-9]/g, "")), 0) / sortedBids.length).toLocaleString()}`,
                  ],
                  [
                    "인증 전문가",
                    `${project.bids.filter((b) => b.verified).length}명 / ${project.bids.length}명`,
                  ],
                ].map(([label, value], i) => (
                  <tr
                    key={label}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap last:border-b-0">
                      {label}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-1.5 font-medium last:border-b-0">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 진행 타임라인 - 엑셀 스타일 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 border-b border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700">
              진행 타임라인
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {[
                  ["의뢰 등록", project.createdAt],
                  ["입찰 시작", `${project.createdAt} 14:30`],
                  ...(project.selectedExpert
                    ? [["전문가 선택", project.selectedExpert.selectedAt]]
                    : []),
                ].map(([label, date], i) => (
                  <tr
                    key={label}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap last:border-b-0">
                      <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-1.5" />
                      {label}
                    </td>
                    <td className="border-b border-gray-200 px-3 py-1.5 last:border-b-0">
                      {date}
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
