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
import { useState } from "react";

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
        description:
          "건설업 관련 면허 취득 및 컨설팅 전문가입니다. 10년 이상의 경력을 바탕으로 고객님께 최상의 서비스를 제공하겠습니다.",
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

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert(`${expert.personalInfo.name} 전문가를 승인했습니다.`);
      setIsProcessing(false);
      navigate("/admin/experts");
    }, 1000);
  };

  const handleReject = () => {
    const reason = prompt("거절 사유를 입력해주세요:");
    if (reason) {
      setIsProcessing(true);
      setTimeout(() => {
        alert(
          `${expert.personalInfo.name} 전문가를 거절했습니다.\n사유: ${reason}`,
        );
        setIsProcessing(false);
        navigate("/admin/experts");
      }, 1000);
    }
  };

  const handleDownload = (documentName: string) => {
    alert(`${documentName} 파일을 다운로드합니다.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/experts">
                <ArrowLeft className="h-4 w-4 mr-1" />
                전문가 관리로 돌아가기
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200"
            >
              승인 대기
            </Badge>
          </div>
          <h1 className="text-3xl mb-2">
            {expert.personalInfo.name} 전문가 승인 요청
          </h1>
          <p className="text-gray-600">
            신청일: {expert.verificationInfo.appliedAt}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleReject}
            disabled={isProcessing}
          >
            <XCircle className="h-4 w-4 mr-1" />
            거절
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
            disabled={isProcessing}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            승인
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                회원 기본 정보
              </CardTitle>
              <CardDescription>
                전문가가 회원가입 시 입력한 정보입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">이름</p>
                  <p className="font-medium">{expert.personalInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">생년월일</p>
                  <p className="font-medium">{expert.personalInfo.birthDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">이메일</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p className="font-medium">{expert.personalInfo.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">연락처</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <p className="font-medium">{expert.personalInfo.phone}</p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">주소</p>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <p className="font-medium">{expert.personalInfo.address}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">가입일시</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="font-medium">
                      {expert.personalInfo.registeredAt}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard className="h-5 w-5" />
                전문가 인증 정보
              </CardTitle>
              <CardDescription>
                전문가 승인 요청 시 작성한 정보입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">전문 분야</p>
                    <Badge
                      variant="outline"
                      className="bg-teal-50 text-teal-700"
                    >
                      {expert.verificationInfo.expertise}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">경력</p>
                    <p className="font-medium">
                      {expert.verificationInfo.experience}
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">자격 정보</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">면허 종류</p>
                      <p className="font-medium">
                        {expert.verificationInfo.licenseType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">면허 번호</p>
                      <p className="font-medium font-mono">
                        {expert.verificationInfo.licenseNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">발급일</p>
                      <p className="font-medium">
                        {expert.verificationInfo.issueDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">만료일</p>
                      <p className="font-medium">
                        {expert.verificationInfo.expiryDate}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">소속 정보</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">회사명</p>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <p className="font-medium">
                          {expert.verificationInfo.companyName}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">직책</p>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <p className="font-medium">
                          {expert.verificationInfo.position}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        사업자등록번호
                      </p>
                      <p className="font-medium font-mono">
                        {expert.verificationInfo.businessNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">회사 전화</p>
                      <p className="font-medium">
                        {expert.verificationInfo.companyPhone}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">회사 주소</p>
                      <p className="font-medium">
                        {expert.verificationInfo.companyAddress}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">자기소개</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {expert.verificationInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                첨부 서류
              </CardTitle>
              <CardDescription>
                전문가가 제출한 서류를 확인하세요. (총 {expert.documents.length}
                개)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expert.documents.map((doc) => (
                  <Card key={doc.id} className="border">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-2 bg-blue-50 rounded">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{doc.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {doc.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-600">
                              <span>{doc.size}</span>
                              <span>•</span>
                              <span>업로드: {doc.uploadedAt}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(doc.name)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          다운로드
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-amber-800">승인 안내</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                "제출된 모든 서류를 확인해주세요.",
                "자격증과 면허증의 유효성을 검증해주세요.",
                "사업자등록번호가 유효한지 확인해주세요.",
                "경력 증빙 자료를 검토해주세요.",
              ].map((text, i) => (
                <div key={i} className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>요약 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ["전문가명", expert.personalInfo.name],
                ["전문 분야", expert.verificationInfo.expertise],
                ["경력", expert.verificationInfo.experience],
                ["소속", expert.verificationInfo.companyName],
                ["신청일시", expert.verificationInfo.appliedAt],
                ["제출 서류", `${expert.documents.length}개`],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-600 mb-1">{label}</p>
                  <p className="font-semibold">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>승인 처리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                전문가 승인
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleReject}
                disabled={isProcessing}
              >
                <XCircle className="h-4 w-4 mr-2" />
                승인 거절
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
