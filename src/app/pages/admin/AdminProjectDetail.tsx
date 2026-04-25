import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
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
  Briefcase
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useState } from "react";

type ProjectStatus = "unmatched" | "matched" | "paid" | "completed";

export function AdminProjectDetail() {
  const { id } = useParams();
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>("matched");

  // 데모 데이터 - 의뢰 공고 정보
  const project = {
    id: id || "1",
    code: "REQ-L5X9K2M",
    title: "건설업 일반건설업(토목공사업) 면허 취득",
    type: "필요 면허",
    industry: "건설업",
    description: "토목공사업을 시작하기 위한 일반건설업 면허 취득이 필요합니다. 관련 법규 및 절차에 대한 전문적인 지식을 갖춘 전문가의 도움이 필요합니다.",
    budget: "₩3,000,000",
    deadline: "2026-05-15",
    location: "서울특별시 강남구",
    status: projectStatus,
    requirements: "- 건설업 관련 면허 취득 경험 보유\n- 관련 법규에 대한 전문 지식\n- 최소 3년 이상의 경력\n- 서울/경기 지역 활동 가능자",
    createdAt: "2026-04-05",
    updatedAt: "2026-04-06",
    
    // 의뢰인 정보
    client: {
      name: "김철수",
      email: "client@example.com",
      phone: "010-1111-2222",
      isGuest: false,
    },
    
    // 기업 정보
    company: {
      name: "(주)대한건설",
      businessType: "법인사업자",
      businessNumber: "123-45-67890",
      representative: "김철수",
      address: "서울특별시 강남구 테헤란로 123",
      phone: "02-1234-5678",
      establishedDate: "2020-03-15",
      capital: "₩100,000,000",
      employees: 15,
    },
    
    // 선택된 전문가 (매칭된 경우)
    selectedExpert: {
      id: 1,
      name: "김전문",
      company: "케이법무법인",
      phone: "010-1234-5678",
      email: "expert1@example.com",
      price: "₩2,500,000",
      selectedAt: "2026-04-06",
    },
  };

  // 입찰 전문가 목록
  const bids = [
    {
      id: 1,
      expertName: "김전문",
      company: "케이법무법인",
      phone: "010-1234-5678",
      email: "expert1@example.com",
      price: "₩2,500,000",
      estimatedDays: 30,
      message: "건설업 관련 면허 취득 경력 10년 이상입니다. 신속하고 정확하게 처리해드리겠습니다.",
      verified: true,
      bidAt: "2026-04-05 14:30",
      isSelected: true,
    },
    {
      id: 2,
      expertName: "이컨설턴트",
      company: "프로컨설팅",
      phone: "010-2345-6789",
      email: "expert2@example.com",
      price: "₩2,700,000",
      estimatedDays: 25,
      message: "최단 기간 내 면허 취득을 보장합니다. 성공률 100%입니다.",
      verified: true,
      bidAt: "2026-04-05 15:20",
      isSelected: false,
    },
    {
      id: 3,
      expertName: "박행정사",
      company: "믿음행정사사무소",
      phone: "010-3456-7890",
      email: "expert3@example.com",
      price: "₩2,800,000",
      estimatedDays: 35,
      message: "합리적인 가격으로 최상의 서비스를 제공합니다.",
      verified: true,
      bidAt: "2026-04-05 16:10",
      isSelected: false,
    },
    {
      id: 4,
      expertName: "최법무사",
      company: "성공법무사사무소",
      phone: "010-4567-8901",
      email: "expert4@example.com",
      price: "₩2,900,000",
      estimatedDays: 28,
      message: "정확한 서류 작성과 신속한 처리가 강점입니다.",
      verified: false,
      bidAt: "2026-04-05 17:05",
      isSelected: false,
    },
    {
      id: 5,
      expertName: "정컨설팅",
      company: "글로벌컨설팅그룹",
      phone: "010-5678-9012",
      email: "expert5@example.com",
      price: "₩3,200,000",
      estimatedDays: 20,
      message: "프리미엄 서비스로 완벽한 결과를 보장합니다.",
      verified: true,
      bidAt: "2026-04-05 18:30",
      isSelected: false,
    },
    {
      id: 6,
      expertName: "강기술",
      company: "한국건설컨설팅",
      phone: "010-6789-0123",
      email: "expert6@example.com",
      price: "₩2,600,000",
      estimatedDays: 32,
      message: "건설업 면허 전문가입니다. 최선을 다하겠습니다.",
      verified: true,
      bidAt: "2026-04-05 19:00",
      isSelected: false,
    },
    {
      id: 7,
      expertName: "윤서비스",
      company: "원스톱행정사",
      phone: "010-7890-1234",
      email: "expert7@example.com",
      price: "₩3,100,000",
      estimatedDays: 22,
      message: "신속하고 정확한 업무 처리를 약속드립니다.",
      verified: true,
      bidAt: "2026-04-05 20:15",
      isSelected: false,
    },
    {
      id: 8,
      expertName: "조전문가",
      company: "탑클래스컨설팅",
      phone: "010-8901-2345",
      email: "expert8@example.com",
      price: "₩2,750,000",
      estimatedDays: 27,
      message: "풍부한 경험으로 완벽한 서비스를 제공합니다.",
      verified: true,
      bidAt: "2026-04-05 21:40",
      isSelected: false,
    },
  ];

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "unmatched":
        return <Badge variant="outline" className="bg-gray-100 text-gray-700">매칭 대기</Badge>;
      case "matched":
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">전문가 매칭됨</Badge>;
      case "paid":
        return <Badge variant="outline" className="bg-green-100 text-green-700">결제 완료</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-purple-100 text-purple-700">의뢰 완료</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getStatusLabel = (status: ProjectStatus) => {
    switch (status) {
      case "unmatched":
        return "매칭 대기";
      case "matched":
        return "전문가 매칭됨";
      case "paid":
        return "결제 완료";
      case "completed":
        return "의뢰 완료";
      default:
        return "알 수 없음";
    }
  };

  const handleStatusChange = (value: string) => {
    setProjectStatus(value as ProjectStatus);
    alert(`공고 상태를 "${getStatusLabel(value as ProjectStatus)}"로 변경했습니다.`);
  };

  // 최저가 기준 정렬
  const sortedBids = [...bids].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
    const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
    return priceA - priceB;
  });

  return (
    <div className="space-y-6">
      {/* 헤더 */}
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
            <span>의뢰 코드: <span className="font-mono font-semibold">{project.code}</span></span>
            <span>•</span>
            <span>등록일: {project.createdAt}</span>
            <span>•</span>
            <span>최종 수정: {project.updatedAt}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-600">진행 상태 변경</label>
            <Select value={projectStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unmatched">매칭 대기</SelectItem>
                <SelectItem value="matched">전문가 매칭됨</SelectItem>
                <SelectItem value="paid">결제 완료</SelectItem>
                <SelectItem value="completed">의뢰 완료</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 왼쪽 메인 컨텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 의뢰 내용 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                의뢰 내용
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">설명</p>
                <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">필수 요구사항</p>
                <p className="text-gray-700 whitespace-pre-wrap">{project.requirements}</p>
              </div>
            </CardContent>
          </Card>

          {/* 기업 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                기업 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">기업명</p>
                  <p className="font-medium">{project.company.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">사업자 유형</p>
                  <p className="font-medium">{project.company.businessType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">사업자등록번호</p>
                  <p className="font-medium font-mono">{project.company.businessNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">대표자명</p>
                  <p className="font-medium">{project.company.representative}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">주소</p>
                  <p className="font-medium">{project.company.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">대표 전화</p>
                  <p className="font-medium">{project.company.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">설립일</p>
                  <p className="font-medium">{project.company.establishedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">자본금</p>
                  <p className="font-medium">{project.company.capital}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">직원 수</p>
                  <p className="font-medium">{project.company.employees}명</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 의뢰인 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                의뢰인 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">이름</p>
                  <p className="font-medium">{project.client.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">회원 유형</p>
                  <Badge variant="outline">
                    {project.client.isGuest ? "비회원" : "정회원"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">이메일</p>
                  <p className="font-medium">{project.client.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">연락처</p>
                  <p className="font-medium">{project.client.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 선택된 전문가 (매칭된 경우) */}
          {(projectStatus === "matched" || projectStatus === "paid" || projectStatus === "completed") && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <CheckCircle2 className="h-5 w-5" />
                  선택된 전문가
                </CardTitle>
                <CardDescription>
                  의뢰인이 선택한 전문가입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {project.selectedExpert.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{project.selectedExpert.name}</h3>
                        <Badge className="bg-blue-600">선택됨</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{project.selectedExpert.company}</p>
                      <div className="grid md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          {project.selectedExpert.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          {project.selectedExpert.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="font-semibold text-blue-700">{project.selectedExpert.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          선택일: {project.selectedExpert.selectedAt}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 입찰 전문가 목록 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                입찰 전문가 목록
              </CardTitle>
              <CardDescription>
                총 {bids.length}명의 전문가가 입찰했습니다. (최저가 순으로 정렬)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedBids.map((bid, index) => (
                  <Card 
                    key={bid.id} 
                    className={`${
                      bid.isSelected 
                        ? "border-blue-500 bg-blue-50/50" 
                        : index < 3 
                        ? "border-green-200 bg-green-50/30" 
                        : ""
                    }`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className={bid.isSelected ? "bg-blue-600 text-white" : ""}>
                            {bid.expertName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg">{bid.expertName}</h3>
                            {bid.isSelected && <Badge className="bg-blue-600">선택됨</Badge>}
                            {index < 3 && !bid.isSelected && (
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                                최저가 TOP {index + 1}
                              </Badge>
                            )}
                            {bid.verified && (
                              <Badge variant="outline" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                인증
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{bid.company}</p>
                          
                          <div className="grid md:grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold text-[#009689]">{bid.price}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              예상 기간: {bid.estimatedDays}일
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              입찰일시: {bid.bidAt}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-4 w-4" />
                              {bid.phone}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4" />
                              {bid.email}
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded p-3">
                            <p className="text-sm text-gray-700">{bid.message}</p>
                          </div>
                        </div>
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
          {/* 의뢰 정보 요약 */}
          <Card>
            <CardHeader>
              <CardTitle>의뢰 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">예상 예산</p>
                  <p className="font-semibold text-lg">{project.budget}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">희망 완료일</p>
                  <p className="font-medium">{project.deadline}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">지역</p>
                  <p className="font-medium">{project.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">입찰 전문가</p>
                  <p className="font-semibold text-lg">{bids.length}명</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 통계 */}
          <Card>
            <CardHeader>
              <CardTitle>입찰 통계</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">최저 입찰가</span>
                <span className="font-semibold text-green-600">{sortedBids[0]?.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">최고 입찰가</span>
                <span className="font-semibold text-gray-700">{sortedBids[sortedBids.length - 1]?.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">평균 입찰가</span>
                <span className="font-semibold">
                  ₩{Math.round(
                    sortedBids.reduce((sum, bid) => {
                      return sum + parseInt(bid.price.replace(/[^0-9]/g, ""));
                    }, 0) / sortedBids.length
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">인증 전문가</span>
                <span className="font-semibold">
                  {bids.filter(b => b.verified).length}명 / {bids.length}명
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 타임라인 */}
          <Card>
            <CardHeader>
              <CardTitle>진행 타임라인</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#009689]" />
                    <div className="w-0.5 h-full bg-gray-200" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">의뢰 등록</p>
                    <p className="text-xs text-gray-500">{project.createdAt}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#009689]" />
                    <div className="w-0.5 h-full bg-gray-200" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">전문가 입찰 시작</p>
                    <p className="text-xs text-gray-500">2026-04-05 14:30</p>
                  </div>
                </div>
                {(projectStatus === "matched" || projectStatus === "paid" || projectStatus === "completed") && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#009689]" />
                      <div className="w-0.5 h-full bg-gray-200" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">전문가 선택</p>
                      <p className="text-xs text-gray-500">{project.selectedExpert.selectedAt}</p>
                    </div>
                  </div>
                )}
                {(projectStatus === "paid" || projectStatus === "completed") && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#009689]" />
                      {projectStatus === "completed" && <div className="w-0.5 h-full bg-gray-200" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">결제 완료</p>
                      <p className="text-xs text-gray-500">2026-04-06 10:30</p>
                    </div>
                  </div>
                )}
                {projectStatus === "completed" && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-[#009689]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">의뢰 완료</p>
                      <p className="text-xs text-gray-500">2026-05-10 15:00</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}