import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Calendar,
  Briefcase,
  MapPin,
  IdCard,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getExpertDetail,
  getExpertCertificates,
  getExpertBusinessInfo,
  updateExpertVerificationStatus,
} from "../../../api/admin/expertApi";
import type {
  AdminExpertDetail as ExpertDetailType,
  AdminExpertCertificate,
  AdminExpertBusinessInfo,
} from "../../../api/admin/expertApi";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  registeredAt: string;
}
interface VerificationInfo {
  expertise: string;
  licenseNumber: string;
  licenseType: string;
  issueDate: string;
  expiryDate: string;
  experience: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  businessNumber: string;
  position: string;
  description: string;
  appliedAt: string;
}
interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}
interface Expert {
  id: string;
  personalInfo: PersonalInfo;
  verificationInfo: VerificationInfo;
  documents: Document[];
  status: string;
}

export function AdminExpertApproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const allExperts: Expert[] = [
    {
      id: "1",
      personalInfo: {
        name: "김전문",
        email: "expert1@example.com",
        phone: "010-1234-5678",
        birthDate: "1985-03-15",
        address: "서울특별시 강남구 테헤란로 123, 101동 202호",
        registeredAt: "2026-04-05 10:30",
      },
      verificationInfo: {
        expertise: "건설업 면허",
        licenseNumber: "건설-2020-12345",
        licenseType: "일반건설업(토목공사업)",
        issueDate: "2020-03-10",
        expiryDate: "2025-03-09",
        experience: "10년",
        companyName: "케이법무법인",
        companyAddress: "서울특별시 서초구 서초대로 123",
        companyPhone: "02-1234-5678",
        businessNumber: "123-45-67890",
        position: "대표 행정사",
        description: "건설업 관련 면허 취득 및 컨설팅 전문가입니다.",
        appliedAt: "2026-04-05 11:00",
      },
      documents: [
        {
          id: 1,
          name: "행정사_자격증.pdf",
          type: "자격증",
          size: "2.3 MB",
          uploadedAt: "2026-04-05 11:05",
        },
        {
          id: 2,
          name: "건설업_면허증.pdf",
          type: "면허증",
          size: "1.8 MB",
          uploadedAt: "2026-04-05 11:06",
        },
        {
          id: 3,
          name: "사업자등록증.pdf",
          type: "사업자등록증",
          size: "1.2 MB",
          uploadedAt: "2026-04-05 11:07",
        },
      ],
      status: "pending",
    },
    {
      id: "2",
      personalInfo: {
        name: "이기술",
        email: "expert2@example.com",
        phone: "010-2345-6789",
        birthDate: "1990-07-22",
        address: "서울특별시 서초구 반포대로 456",
        registeredAt: "2026-04-04 09:20",
      },
      verificationInfo: {
        expertise: "전기공사업",
        licenseNumber: "전기-2021-55678",
        licenseType: "전기공사업 면허",
        issueDate: "2021-05-15",
        expiryDate: "2026-05-14",
        experience: "7년",
        companyName: "프로컨설팅",
        companyAddress: "서울특별시 강서구 마곡로 200",
        companyPhone: "02-2345-6789",
        businessNumber: "234-56-78901",
        position: "이사",
        description: "전기공사업 면허 취득 전문가입니다.",
        appliedAt: "2026-04-04 10:00",
      },
      documents: [
        {
          id: 1,
          name: "전기면허증.pdf",
          type: "면허증",
          size: "1.5 MB",
          uploadedAt: "2026-04-04 10:05",
        },
        {
          id: 2,
          name: "사업자등록증.pdf",
          type: "사업자등록증",
          size: "1.1 MB",
          uploadedAt: "2026-04-04 10:06",
        },
      ],
      status: "pending",
    },
    {
      id: "3",
      personalInfo: {
        name: "박컨설",
        email: "expert3@example.com",
        phone: "010-3456-7890",
        birthDate: "1988-11-30",
        address: "경기도 성남시 분당구 판교로 789",
        registeredAt: "2026-04-03 14:10",
      },
      verificationInfo: {
        expertise: "실태 조사",
        licenseNumber: "경영-2019-33210",
        licenseType: "경영지도사",
        issueDate: "2019-08-20",
        expiryDate: "2024-08-19",
        experience: "8년",
        companyName: "비즈컨설팅",
        companyAddress: "경기도 성남시 분당구 대왕판교로 100",
        companyPhone: "031-345-6789",
        businessNumber: "345-67-89012",
        position: "대표",
        description: "실태조사 전문 컨설팅 회사를 운영하고 있습니다.",
        appliedAt: "2026-04-03 15:00",
      },
      documents: [
        {
          id: 1,
          name: "경영지도사자격증.pdf",
          type: "자격증",
          size: "2.0 MB",
          uploadedAt: "2026-04-03 15:05",
        },
        {
          id: 2,
          name: "사업자등록증.pdf",
          type: "사업자등록증",
          size: "1.0 MB",
          uploadedAt: "2026-04-03 15:06",
        },
      ],
      status: "pending",
    },
    {
      id: "4",
      personalInfo: {
        name: "최자격",
        email: "expert4@example.com",
        phone: "010-4567-8901",
        birthDate: "1992-03-05",
        address: "서울특별시 마포구 홍익로 321",
        registeredAt: "2026-04-02 11:30",
      },
      verificationInfo: {
        expertise: "정보통신공사업",
        licenseNumber: "정통-2022-11234",
        licenseType: "정보통신공사업 면허",
        issueDate: "2022-01-10",
        expiryDate: "2027-01-09",
        experience: "5년",
        companyName: "IT솔루션",
        companyAddress: "서울특별시 마포구 월드컵북로 400",
        companyPhone: "02-4567-8901",
        businessNumber: "456-78-90123",
        position: "팀장",
        description: "정보통신공사업 면허 관련 전문가입니다.",
        appliedAt: "2026-04-02 12:00",
      },
      documents: [
        {
          id: 1,
          name: "정통면허증.pdf",
          type: "면허증",
          size: "1.7 MB",
          uploadedAt: "2026-04-02 12:05",
        },
        {
          id: 2,
          name: "사업자등록증.pdf",
          type: "사업자등록증",
          size: "1.3 MB",
          uploadedAt: "2026-04-02 12:06",
        },
      ],
      status: "pending",
    },
    {
      id: "5",
      personalInfo: {
        name: "정면허",
        email: "expert5@example.com",
        phone: "010-5678-9012",
        birthDate: "1987-09-18",
        address: "부산광역시 해운대구 센텀로 100",
        registeredAt: "2026-04-01 16:00",
      },
      verificationInfo: {
        expertise: "소방시설공사업",
        licenseNumber: "소방-2020-77890",
        licenseType: "소방시설공사업 면허",
        issueDate: "2020-06-01",
        expiryDate: "2025-05-31",
        experience: "9년",
        companyName: "안전소방",
        companyAddress: "부산광역시 해운대구 우동 500",
        companyPhone: "051-567-8901",
        businessNumber: "567-89-01234",
        position: "소장",
        description: "소방시설공사업 면허 취득 전문가입니다.",
        appliedAt: "2026-04-01 16:30",
      },
      documents: [
        {
          id: 1,
          name: "소방면허증.pdf",
          type: "면허증",
          size: "1.9 MB",
          uploadedAt: "2026-04-01 16:35",
        },
        {
          id: 2,
          name: "사업자등록증.pdf",
          type: "사업자등록증",
          size: "1.1 MB",
          uploadedAt: "2026-04-01 16:36",
        },
      ],
      status: "pending",
    },
  ];

  const expert = allExperts.find((e) => e.id === id) ?? allExperts[0];

  const [apiDetail, setApiDetail] = useState<ExpertDetailType | null>(null);
  const [apiCertificates, setApiCertificates] = useState<
    AdminExpertCertificate[]
  >([]);
  const [apiBusinessInfo, setApiBusinessInfo] =
    useState<AdminExpertBusinessInfo | null>(null);

  useEffect(() => {
    const userId = Number(id);
    if (!userId) return;
    Promise.all([
      getExpertDetail(userId),
      getExpertCertificates(userId),
      getExpertBusinessInfo(userId).catch(() => ({ data: null })),
    ])
      .then(([detailRes, certRes, bizRes]) => {
        setApiDetail(detailRes.data);
        setApiCertificates(certRes.data ?? []);
        setApiBusinessInfo(bizRes.data);
      })
      .catch(() => {});
  }, [id]);

  const handleApprove = async () => {
    if (
      !confirm(
        `${apiDetail?.email ?? expert.personalInfo.name} 전문가를 승인하시겠습니까?`,
      )
    )
      return;
    setIsProcessing(true);
    try {
      await updateExpertVerificationStatus(Number(id), "APPROVED");
      alert("승인이 완료되었습니다.");
      navigate("/admin/experts");
    } catch {
      alert("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt("반려 사유를 입력해주세요:");
    if (!reason) return;
    setIsProcessing(true);
    try {
      await updateExpertVerificationStatus(Number(id), "REJECTED", reason);
      alert("반려 처리가 완료되었습니다.");
      navigate("/admin/experts");
    } catch {
      alert("반려 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (documentName: string) => {
    alert(`${documentName} 파일을 다운로드합니다.`);
  };

  const handleExport = () => {
    import("xlsx").then((XLSX) => {
      const wb = XLSX.utils.book_new();

      // 시트1: 기본 정보 + 인증 정보
      const ws1 = XLSX.utils.aoa_to_sheet([
        ["항목", "내용"],
        ["=== 기본 정보 ===", ""],
        ["이름", expert.personalInfo.name],
        ["생년월일", expert.personalInfo.birthDate],
        ["이메일", expert.personalInfo.email],
        ["연락처", expert.personalInfo.phone],
        ["주소", expert.personalInfo.address],
        ["가입일", expert.personalInfo.registeredAt],
        ["", ""],
        ["=== 인증 정보 ===", ""],
        ["전문분야", expert.verificationInfo.expertise],
        ["경력", expert.verificationInfo.experience],
        ["면허 종류", expert.verificationInfo.licenseType],
        ["면허 번호", expert.verificationInfo.licenseNumber],
        ["발급일", expert.verificationInfo.issueDate],
        ["만료일", expert.verificationInfo.expiryDate],
        ["", ""],
        ["=== 소속 정보 ===", ""],
        ["회사명", expert.verificationInfo.companyName],
        ["직책", expert.verificationInfo.position],
        ["사업자번호", expert.verificationInfo.businessNumber],
        ["회사 전화", expert.verificationInfo.companyPhone],
        ["회사 주소", expert.verificationInfo.companyAddress],
        ["신청일", expert.verificationInfo.appliedAt],
        ["", ""],
        ["=== 자기소개 ===", ""],
        ["내용", expert.verificationInfo.description],
      ]);
      ws1["!cols"] = [{ wch: 16 }, { wch: 50 }];
      XLSX.utils.book_append_sheet(wb, ws1, "전문가정보");

      // 시트2: 첨부서류 목록
      const ws2 = XLSX.utils.aoa_to_sheet([
        ["번호", "파일명", "종류", "크기", "업로드일시"],
        ...expert.documents.map((doc, i) => [
          i + 1,
          doc.name,
          doc.type,
          doc.size,
          doc.uploadedAt,
        ]),
      ]);
      ws2["!cols"] = [6, 25, 15, 10, 18].map((wch) => ({ wch }));
      XLSX.utils.book_append_sheet(wb, ws2, "첨부서류");

      XLSX.writeFile(
        wb,
        `전문가승인요청_${expert.personalInfo.name}_${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    });
  };

  return (
    <div className="space-y-3">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/experts">
              <ArrowLeft className="h-4 w-4 mr-1" />
              전문가 관리로
            </Link>
          </Button>
          <h1 className="text-xl font-bold">
            {expert.personalInfo.name} 전문가 승인 요청
          </h1>
          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-medium">
            승인 대기
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1 text-xs"
            onClick={handleExport}
          >
            <Download className="h-3 w-3" />
            Excel 다운로드
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleReject}
            disabled={isProcessing}
          >
            <XCircle className="h-3 w-3 mr-1" />
            거절
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
            disabled={isProcessing}
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            승인
          </Button>
        </div>
      </div>

      {/* 신청자 요약 - 엑셀 스타일 */}
      <div className="border border-gray-300 rounded overflow-hidden">
        <table className="w-full text-xs border-collapse">
          <tbody>
            <tr className="bg-gray-50">
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-24">
                이름
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5">
                {expert.personalInfo.name}
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600 whitespace-nowrap w-24">
                신청일
              </td>
              <td className="border-b border-gray-300 px-3 py-1.5">
                {expert.verificationInfo.appliedAt}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                이메일
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5">
                {expert.personalInfo.email}
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                연락처
              </td>
              <td className="border-b border-gray-300 px-3 py-1.5">
                {expert.personalInfo.phone}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                전문분야
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5">
                {expert.verificationInfo.expertise}
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                경력
              </td>
              <td className="border-b border-gray-300 px-3 py-1.5">
                {expert.verificationInfo.experience}
              </td>
            </tr>
            <tr className="bg-white">
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                회사명
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5">
                {expert.verificationInfo.companyName}
              </td>
              <td className="border-b border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                사업자번호
              </td>
              <td className="border-b border-gray-300 px-3 py-1.5 font-mono">
                {expert.verificationInfo.businessNumber}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="border-r border-gray-300 px-3 py-1.5 font-semibold text-gray-600">
                주소
              </td>
              <td colSpan={3} className="px-3 py-1.5">
                {expert.personalInfo.address}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 border-b border-gray-300">
              전문가 인증 정보
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 w-28 whitespace-nowrap">
                    면허 종류
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    {expert.verificationInfo.licenseType}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600 w-28 whitespace-nowrap">
                    면허 번호
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5 font-mono">
                    {expert.verificationInfo.licenseNumber}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    발급일
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    {expert.verificationInfo.issueDate}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    만료일
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">
                    {expert.verificationInfo.expiryDate}
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    직책
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5">
                    {expert.verificationInfo.position}
                  </td>
                  <td className="border-b border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    회사 전화
                  </td>
                  <td className="border-b border-gray-200 px-3 py-1.5">
                    {expert.verificationInfo.companyPhone}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border-r border-gray-200 px-3 py-1.5 font-semibold text-gray-600">
                    회사 주소
                  </td>
                  <td colSpan={3} className="px-3 py-1.5">
                    {expert.verificationInfo.companyAddress}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 border-b border-gray-300">
              자기소개
            </div>
            <div className="px-3 py-2 text-xs text-gray-700 bg-white">
              {expert.verificationInfo.description}
            </div>
          </div>

          {/* 첨부 서류 - 엑셀 스타일 */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 border-b border-gray-300">
              첨부 서류 (총 {expert.documents.length}개)
            </div>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {["파일명", "종류", "크기", "업로드일시", "다운로드"].map(
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
                {expert.documents.map((doc, i) => (
                  <tr
                    key={doc.id}
                    className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border-b border-r border-gray-200 px-2 py-1">
                      {doc.name}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {doc.type}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {doc.size}
                    </td>
                    <td className="border-b border-r border-gray-200 px-2 py-1 whitespace-nowrap">
                      {doc.uploadedAt}
                    </td>
                    <td className="border-b border-gray-200 px-2 py-1">
                      <button
                        onClick={() => handleDownload(doc.name)}
                        className="text-blue-600 hover:underline"
                      >
                        다운로드
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 이전 Card 제거 후 여기서 닫기 */}
        </div>

        <div className="space-y-4">
          <div className="border border-amber-200 bg-amber-50 rounded p-3 text-xs">
            <p className="font-semibold text-amber-800 mb-2">승인 안내</p>
            {[
              "제출된 모든 서류를 확인해주세요.",
              "자격증과 면허증의 유효성을 검증해주세요.",
              "사업자등록번호가 유효한지 확인해주세요.",
              "경력 증빙 자료를 검토해주세요.",
            ].map((text, i) => (
              <p key={i} className="text-gray-700 mb-1">
                ✓ {text}
              </p>
            ))}
          </div>

          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 border-b border-gray-300">
              요약 정보
            </div>
            <table className="w-full text-xs border-collapse">
              <tbody>
                {[
                  ["전문가명", expert.personalInfo.name],
                  ["전문 분야", expert.verificationInfo.expertise],
                  ["경력", expert.verificationInfo.experience],
                  ["소속", expert.verificationInfo.companyName],
                  ["신청일시", expert.verificationInfo.appliedAt],
                  ["제출 서류", `${expert.documents.length}개`],
                ].map(([label, value]) => (
                  <tr
                    key={label}
                    className="border-b border-gray-200 last:border-b-0"
                  >
                    <td className="border-r border-gray-200 px-2 py-1.5 font-semibold text-gray-600 w-20 whitespace-nowrap">
                      {label}
                    </td>
                    <td className="px-2 py-1.5">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-sm"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              전문가 승인
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 text-sm"
              onClick={handleReject}
              disabled={isProcessing}
            >
              <XCircle className="h-4 w-4 mr-2" />
              승인 거절
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
