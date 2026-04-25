import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Calendar, DollarSign, MapPin, FileText, Users } from "lucide-react";

export function ProjectDetail() {
  const { id } = useParams();

  // 데모 데이터
  const project = {
    id: 1,
    title: "식품 제조업 영업 면허 취득",
    type: "필요 면허",
    description:
      "식품 제조 및 판매를 위한 영업 면허 취득이 필요합니다. 관련 법규 및 절차에 대한 전문적인 지식을 갖춘 전문가의 도움이 필요합니다.",
    budget: "₩3,000,000",
    deadline: "2026-05-15",
    location: "서울특별시 강남구",
    bids: 5,
    status: "입찰 중",
    requirements:
      "- 식품 관련 면허 취득 경험 보유\n- 관련 법규에 대한 전문 지식\n- 최소 3년 이상의 경력",
    createdAt: "2026-04-01",
    company: {
      name: "(주)홍길동푸드",
      representative: "홍길동",
      phone: "02-1234-5678",
    },
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline">{project.type}</Badge>
            <Badge
              className={
                project.status === "입찰 중"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }
            >
              {project.status}
            </Badge>
          </div>
          <h1 className="text-3xl mb-2">{project.title}</h1>
          <p className="text-gray-600">등록일: {project.createdAt}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/client/projects">목록으로</Link>
          </Button>
          {project.status === "입찰 중" && (
            <Button asChild>
              <Link to={`/client/projects/${id}/bids`}>입찰 확인하기</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 주요 정보 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>필수 요구사항</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{project.requirements}</p>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>프로젝트 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">예상 예산</p>
                  <p className="font-medium">{project.budget}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">완료 희망일</p>
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
                  <p className="text-sm text-gray-600">받은 입찰</p>
                  <p className="font-medium">{project.bids}개</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>의뢰 기업 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">회사명</p>
                <p className="font-medium">{project.company.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">대표자</p>
                <p className="font-medium">{project.company.representative}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">연락처</p>
                <p className="font-medium">{project.company.phone}</p>
              </div>
            </CardContent>
          </Card>

          {project.status === "입찰 중" && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-900 mb-3">
                  현재 {project.bids}명의 전문가가 입찰했습니다.
                </p>
                <Button asChild className="w-full">
                  <Link to={`/client/projects/${id}/bids`}>입찰 내역 확인</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}