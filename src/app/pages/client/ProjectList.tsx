import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Calendar, DollarSign, MapPin, Users } from "lucide-react";

export function ProjectList() {
  // 데모 데이터
  const projects = [
    {
      id: 1,
      title: "식품 제조업 영업 면허 취득",
      type: "필요 면허",
      description: "식품 제조 및 판매를 위한 영업 면허 취득이 필요합니다.",
      budget: "₩3,000,000",
      deadline: "2026-05-15",
      location: "서울특별시 강남구",
      bids: 5,
      status: "입찰 중",
    },
    {
      id: 2,
      title: "제조업 실태 조사",
      type: "실태 조사",
      description: "제조업 현황 파악 및 개선 방안 도출을 위한 실태 조사",
      budget: "₩5,000,000",
      deadline: "2026-05-30",
      location: "경기도 수원시",
      bids: 3,
      status: "진행 중",
    },
    {
      id: 3,
      title: "환경 관련 인증 컨설팅",
      type: "기타",
      description: "ISO 14001 환경경영시스템 인증 취득을 위한 컨설팅",
      budget: "₩7,000,000",
      deadline: "2026-04-20",
      location: "인천광역시",
      bids: 4,
      status: "완료",
    },
    {
      id: 4,
      title: "건설업 면허 신청 대행",
      type: "필요 면허",
      description: "건설업 면허 신청 및 취득 대행 서비스",
      budget: "₩4,000,000",
      deadline: "2026-06-10",
      location: "부산광역시",
      bids: 7,
      status: "입찰 중",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "입찰 중":
        return "bg-green-100 text-green-700";
      case "진행 중":
        return "bg-yellow-100 text-yellow-700";
      case "완료":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">내 의뢰 목록</h1>
          <p className="text-gray-600">등록한 의뢰를 관리하고 입찰을 확인하세요.</p>
        </div>
        <Button asChild>
          <Link to="/client/create-project">새 의뢰 작성</Link>
        </Button>
      </div>

      {/* 의뢰 목록 */}
      <div className="grid gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{project.type}</Badge>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  <span>{project.budget}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{project.deadline}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="h-4 w-4" />
                  <span>입찰 {project.bids}개</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/client/projects/${project.id}`}>상세보기</Link>
                </Button>
                {project.status === "입찰 중" && (
                  <Button asChild size="sm">
                    <Link to={`/client/projects/${project.id}/bids`}>
                      입찰 확인하기
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}