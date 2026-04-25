import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  CheckCircle,
  Calendar,
  Briefcase,
  MapPin,
  IdCard,
  FileText,
  TrendingUp,
  DollarSign,
  Ban,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

export function AdminExpertDetail() {
  const { id } = useParams();
  const [expertStatus, setExpertStatus] = useState<"active" | "inactive">("active");
  const [isProcessing, setIsProcessing] = useState(false);

  // 데모 데이터
  const expert = {
    id: id || "101",
    // 기본 정보
    personalInfo: {
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1111-1111",
      birthDate: "1985-03-15",
      address: "서울특별시 강남구 테헤란로 123, 101동 202호",
      registeredAt: "2026-02-15 14:30",
    },
    
    // 전문가 정보
    expertInfo: {
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
      approvedAt: "2026-03-25 10:00",
    },

    // 활동 통계
    stats: {
      totalBids: 24,
      wonBids: 18,
      completedProjects: 18,
      ongoingProjects: 0,
      totalEarnings: "₩54,000,000",
      averageBidPrice: "₩3,000,000",
    },
  };

  // 입찰/진행 의뢰 목록
  const projects = [
    {
      id: 1,
      code: "REQ-L5X9K2M",
      title: "건설업 일반건설업(토목공사업) 면허 취득",
      company: "(주)대한건설",
      bidPrice: "₩2,500,000",
      bidAt: "2026-04-05 14:30",
      status: "selected",
      selectedAt: "2026-04-06",
    },
    {
      id: 2,
      code: "REQ-M3P7N1K",
      title: "전문건설업(실내건축공사업) 면허",
      company: "인테리어건설(주)",
      bidPrice: "₩2,800,000",
      bidAt: "2026-04-03 10:20",
      status: "completed",
      completedAt: "2026-04-25",
    },
    {
      id: 3,
      code: "REQ-K9L2M5P",
      title: "건설업 실태 조사 대행",
      company: "건축자재(주)",
      bidPrice: "₩3,200,000",
      bidAt: "2026-04-01 16:45",
      status: "completed",
      completedAt: "2026-04-20",
    },
    {
      id: 4,
      code: "REQ-N7M4K1L",
      title: "일반건설업 면허 갱신",
      company: "(주)세진건설",
      bidPrice: "₩2,600,000",
      bidAt: "2026-03-28 11:30",
      status: "bidding",
    },
    {
      id: 5,
      code: "REQ-P2K9M3L",
      title: "건설업 등록 신청",
      company: "미래건설(주)",
      bidPrice: "₩3,000,000",
      bidAt: "2026-03-25 14:00",
      status: "completed",
      completedAt: "2026-04-15",
    },
    {
      id: 6,
      code: "REQ-L1M8K5N",
      title: "건설업 자본금 증자",
      company: "(주)청년건설",
      bidPrice: "₩2,700,000",
      bidAt: "2026-03-20 09:15",
      status: "completed",
      completedAt: "2026-04-10",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "selected":
        return <Badge className="bg-blue-600">선택됨</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700">완료</Badge>;
      case "bidding":
        return <Badge variant="outline" className="bg-gray-100 text-gray-700">입찰 중</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const handleStatusChange = async () => {
    if (expertStatus === "active") {
      const reason = prompt("전문가 비활성화 사유를 입력해주세요:");
      if (!reason) {
        return;
      }
      
      const confirmed = confirm(
        `${expert.personalInfo.name} 전문가를 비활성화하시겠습니까?\n\n` +
        `비활성화 사유: ${reason}\n\n` +
        `비활성화 시 전문가는 입찰 및 모든 활동이 제한됩니다.`
      );
      
      if (!confirmed) {
        return;
      }
    } else {
      const confirmed = confirm(
        `${expert.personalInfo.name} 전문가를 다시 활성화하시겠습니까?\n\n` +
        `활성화 시 전문가는 정상적으로 플랫폼을 이용할 수 있습니다.`
      );
      
      if (!confirmed) {
        return;
      }
    }

    setIsProcessing(true);
    
    // 실제 서버 요청 시뮬레이션
    setTimeout(() => {
      setExpertStatus(expertStatus === "active" ? "inactive" : "active");
      setIsProcessing(false);
      alert(
        expertStatus === "active" 
          ? "전문가가 비활성화되었습니다." 
          : "전문가가 활성화되었습니다."
      );
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/experts/list">
                <ArrowLeft className="h-4 w-4 mr-1" />
                전문가 목록으로
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Badge className="bg-green-100 text-green-700">승인 완료</Badge>
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              인증됨
            </Badge>
            {expertStatus === "inactive" && (
              <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 gap-1">
                <Ban className="h-3 w-3" />
                비활성화됨
              </Badge>
            )}
          </div>
          <h1 className="text-3xl mb-2">{expert.personalInfo.name}</h1>
          <p className="text-gray-600">{expert.expertInfo.expertise} 전문가</p>
        </div>
        <div>
          <Button
            size="sm"
            variant="outline"
            className={expertStatus === "active" ? "text-red-600 border-red-200 hover:bg-red-50" : "text-green-600 border-green-200 hover:bg-green-50"}
            onClick={handleStatusChange}
            disabled={isProcessing}
          >
            {expertStatus === "active" ? (
              <>
                <Ban className="h-4 w-4 mr-1" />
                전문가 자격 비활성화
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                전문가 자격 활성화
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 왼쪽 메인 컨텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 활동 통계 */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">총 입찰</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expert.stats.totalBids}건</div>
                <p className="text-xs text-gray-600 mt-1">전체 입찰 건수</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">낙찰</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{expert.stats.wonBids}건</div>
                <p className="text-xs text-gray-600 mt-1">
                  낙찰률: {Math.round((expert.stats.wonBids / expert.stats.totalBids) * 100)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-gray-600">완료</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{expert.stats.completedProjects}건</div>
                <p className="text-xs text-gray-600 mt-1">
                  완료율: {Math.round((expert.stats.completedProjects / expert.stats.wonBids) * 100)}%
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                기본 정보
              </CardTitle>
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
                  <p className="text-sm text-gray-600 mb-1">가입일</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="font-medium">{expert.personalInfo.registeredAt}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">승인일</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <p className="font-medium">{expert.expertInfo.approvedAt}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 전문가 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IdCard className="h-5 w-5" />
                전문가 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">전문 분야</p>
                    <Badge variant="outline" className="bg-[#009689]/10 text-[#009689]">
                      {expert.expertInfo.expertise}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">경력</p>
                    <p className="font-medium">{expert.expertInfo.experience}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">자격 정보</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">면허 종류</p>
                      <p className="font-medium">{expert.expertInfo.licenseType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">면허 번호</p>
                      <p className="font-medium font-mono">{expert.expertInfo.licenseNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">발급일</p>
                      <p className="font-medium">{expert.expertInfo.issueDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">만료일</p>
                      <p className="font-medium">{expert.expertInfo.expiryDate}</p>
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
                        <p className="font-medium">{expert.expertInfo.companyName}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">직책</p>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <p className="font-medium">{expert.expertInfo.position}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">사업자등록번호</p>
                      <p className="font-medium font-mono">{expert.expertInfo.businessNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">회사 전화</p>
                      <p className="font-medium">{expert.expertInfo.companyPhone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600 mb-1">회사 주소</p>
                      <p className="font-medium">{expert.expertInfo.companyAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">자기소개</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{expert.expertInfo.description}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 입찰/진행 의뢰 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                입찰 및 진행 의뢰
              </CardTitle>
              <CardDescription>
                전문가가 입찰하거나 진행한 의뢰 목록입니다. (총 {projects.length}건)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/admin/projects/${project.id}`}
                    className="block"
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold">{project.title}</h3>
                              {getStatusBadge(project.status)}
                            </div>
                            <div className="grid md:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-600 mb-2">
                              <div>
                                <span className="font-medium">의뢰 코드:</span> {project.code}
                              </div>
                              <div>
                                <span className="font-medium">기업:</span> {project.company}
                              </div>
                              <div>
                                <span className="font-medium">입찰가:</span>{" "}
                                <span className="font-semibold text-[#009689]">{project.bidPrice}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>입찰일: {project.bidAt}</span>
                              {project.status === "selected" && project.selectedAt && (
                                <>
                                  <span>•</span>
                                  <span>선택일: {project.selectedAt}</span>
                                </>
                              )}
                              {project.status === "completed" && project.completedAt && (
                                <>
                                  <span>•</span>
                                  <span>완료일: {project.completedAt}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="space-y-4">
          {/* 수익 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                수익 통계
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">총 수익</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <p className="text-xl font-bold text-green-600">{expert.stats.totalEarnings}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">평균 입찰가</p>
                <p className="text-lg font-semibold">{expert.stats.averageBidPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">진행 중인 의뢰</p>
                <p className="text-lg font-semibold">{expert.stats.ongoingProjects}건</p>
              </div>
            </CardContent>
          </Card>

          {/* 활동 요약 */}
          <Card>
            <CardHeader>
              <CardTitle>활동 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">총 입찰</span>
                <span className="font-semibold">{expert.stats.totalBids}건</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">낙찰</span>
                <span className="font-semibold text-blue-600">{expert.stats.wonBids}건</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">완료</span>
                <span className="font-semibold text-green-600">{expert.stats.completedProjects}건</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">진행 중</span>
                <span className="font-semibold">{expert.stats.ongoingProjects}건</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-gray-600">낙찰률</span>
                <span className="font-semibold">
                  {Math.round((expert.stats.wonBids / expert.stats.totalBids) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">완료율</span>
                <span className="font-semibold">
                  {Math.round((expert.stats.completedProjects / expert.stats.wonBids) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 가입 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>가입 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">가입일</p>
                <p className="font-semibold">{expert.personalInfo.registeredAt}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">승인일</p>
                <p className="font-semibold">{expert.expertInfo.approvedAt}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">상태</p>
                {expertStatus === "active" ? (
                  <Badge className="bg-green-100 text-green-700">활성화</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700">비활성화</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}