import { useParams, Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
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
  IdCard
} from "lucide-react";
import { useState } from "react";

export function AdminExpertApproval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // 데모 데이터
  const expert = {
    id: id || "1",
    // 회원가입 정보
    personalInfo: {
      name: "김전문",
      email: "expert1@example.com",
      phone: "010-1234-5678",
      birthDate: "1985-03-15",
      address: "서울특별시 강남구 테헤란로 123, 101동 202호",
      registeredAt: "2026-04-05 10:30",
    },
    
    // 전문가 인증 요청 정보
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
      description: "건설업 관련 면허 취득 및 컨설팅 전문가입니다. 10년 이상의 경력을 바탕으로 고객님께 최상의 서비스를 제공하겠습니다.",
      appliedAt: "2026-04-05 11:00",
    },

    // 첨부 파일
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
      {
        id: 4,
        name: "경력증명서.pdf",
        type: "경력증명서",
        size: "950 KB",
        uploadedAt: "2026-04-05 11:08",
      },
      {
        id: 5,
        name: "포트폴리오.pdf",
        type: "기타",
        size: "4.5 MB",
        uploadedAt: "2026-04-05 11:10",
      },
    ],

    status: "pending",
  };

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
        alert(`${expert.personalInfo.name} 전문가를 거절했습니다.\n사유: ${reason}`);
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
      {/* 헤더 */}
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
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              승인 대기
            </Badge>
          </div>
          <h1 className="text-3xl mb-2">{expert.personalInfo.name} 전문가 승인 요청</h1>
          <p className="text-gray-600">신청일: {expert.verificationInfo.appliedAt}</p>
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
        {/* 왼쪽 메인 컨텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 회원가입 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                회원 기본 정보
              </CardTitle>
              <CardDescription>전문가가 회원가입 시 입력한 정보입니다.</CardDescription>
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
                    <p className="font-medium">{expert.personalInfo.registeredAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 전문가 인증 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard className="h-5 w-5" />
                전문가 인증 정보
              </CardTitle>
              <CardDescription>전문가 승인 요청 시 작성한 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">전문 분야</p>
                    <Badge variant="outline" className="bg-[#009689]/10 text-[#009689]">
                      {expert.verificationInfo.expertise}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">경력</p>
                    <p className="font-medium">{expert.verificationInfo.experience}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">자격 정보</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">면허 종류</p>
                      <p className="font-medium">{expert.verificationInfo.licenseType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">면허 번호</p>
                      <p className="font-medium font-mono">{expert.verificationInfo.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">발급일</p>
                      <p className="font-medium">{expert.verificationInfo.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">만료일</p>
                      <p className="font-medium">{expert.verificationInfo.expiryDate}</p>
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
                        <p className="font-medium">{expert.verificationInfo.companyName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">직책</p>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <p className="font-medium">{expert.verificationInfo.position}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">사업자등록번호</p>
                      <p className="font-medium font-mono">{expert.verificationInfo.businessNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">회사 전화</p>
                      <p className="font-medium">{expert.verificationInfo.companyPhone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">회사 주소</p>
                      <p className="font-medium">{expert.verificationInfo.companyAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">자기소개</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{expert.verificationInfo.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 첨부 파일 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                첨부 서류
              </CardTitle>
              <CardDescription>
                전문가가 제출한 서류를 확인하세요. (총 {expert.documents.length}개)
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

        {/* 오른쪽 사이드바 */}
        <div className="space-y-4">
          {/* 승인 안내 */}
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-amber-800">승인 안내</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">제출된 모든 서류를 확인해주세요.</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">자격증과 면허증의 유효성을 검증해주세요.</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">사업자등록번호가 유효한지 확인해주세요.</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">경력 증빙 자료를 검토해주세요.</p>
              </div>
            </CardContent>
          </Card>

          {/* 요약 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>요약 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">전문가명</p>
                <p className="font-semibold">{expert.personalInfo.name}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">전문 분야</p>
                <p className="font-semibold">{expert.verificationInfo.expertise}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">경력</p>
                <p className="font-semibold">{expert.verificationInfo.experience}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">소속</p>
                <p className="font-semibold">{expert.verificationInfo.companyName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">신청일시</p>
                <p className="font-semibold">{expert.verificationInfo.appliedAt}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">제출 서류</p>
                <p className="font-semibold">{expert.documents.length}개</p>
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
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
