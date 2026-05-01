import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Search, Users, CheckCircle, ArrowRight } from "lucide-react";

interface Expert {
  id: number;
  name: string;
  email: string;
  phone: string;
  expertise: string;
  company: string;
  status: "approved" | "pending" | "rejected";
  approvedAt?: string;
  totalBids: number;
  completedProjects: number;
}

export function AdminExpertList() {
  const [searchQuery, setSearchQuery] = useState("");

  // 데모 데이터
  const allExperts: Expert[] = [
    {
      id: 101,
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1111-1111",
      expertise: "건설업 면허",
      company: "케이법무법인",
      status: "approved",
      approvedAt: "2026-03-25",
      totalBids: 24,
      completedProjects: 18,
    },
    {
      id: 102,
      name: "강전문",
      email: "kang@example.com",
      phone: "010-2222-2222",
      expertise: "전기공사업",
      company: "프로컨설팅",
      status: "approved",
      approvedAt: "2026-03-28",
      totalBids: 18,
      completedProjects: 12,
    },
    {
      id: 103,
      name: "신기술",
      email: "shin@example.com",
      phone: "010-3333-3333",
      expertise: "정보통신공사업",
      company: "IT솔루션",
      status: "approved",
      approvedAt: "2026-03-30",
      totalBids: 31,
      completedProjects: 25,
    },
    {
      id: 104,
      name: "박행정",
      email: "park@example.com",
      phone: "010-4444-4444",
      expertise: "실태 조사",
      company: "믿음행정사사무소",
      status: "approved",
      approvedAt: "2026-03-15",
      totalBids: 15,
      completedProjects: 10,
    },
    {
      id: 105,
      name: "이컨설",
      email: "lee@example.com",
      phone: "010-5555-5555",
      expertise: "건설업 면허",
      company: "글로벌컨설팅",
      status: "approved",
      approvedAt: "2026-03-20",
      totalBids: 42,
      completedProjects: 35,
    },
    {
      id: 106,
      name: "최면허",
      email: "choi@example.com",
      phone: "010-6666-6666",
      expertise: "소방시설공사업",
      company: "안전소방",
      status: "approved",
      approvedAt: "2026-03-22",
      totalBids: 12,
      completedProjects: 8,
    },
    {
      id: 107,
      name: "정법무",
      email: "jung@example.com",
      phone: "010-7777-7777",
      expertise: "의약품도매상",
      company: "헬스케어법무법인",
      status: "approved",
      approvedAt: "2026-03-18",
      totalBids: 9,
      completedProjects: 6,
    },
    {
      id: 108,
      name: "윤서비스",
      email: "yoon@example.com",
      phone: "010-8888-8888",
      expertise: "전기공사업",
      company: "원스톱행정사",
      status: "approved",
      approvedAt: "2026-03-12",
      totalBids: 27,
      completedProjects: 20,
    },
    {
      id: 109,
      name: "조기술",
      email: "jo@example.com",
      phone: "010-9999-9999",
      expertise: "정보통신공사업",
      company: "탑클래스컨설팅",
      status: "approved",
      approvedAt: "2026-03-10",
      totalBids: 33,
      completedProjects: 28,
    },
    {
      id: 110,
      name: "한전문",
      email: "han@example.com",
      phone: "010-1010-1010",
      expertise: "건설업 면허",
      company: "한국건설컨설팅",
      status: "approved",
      approvedAt: "2026-03-08",
      totalBids: 19,
      completedProjects: 14,
    },
    {
      id: 1,
      name: "김전문",
      email: "expert1@example.com",
      phone: "010-1234-5678",
      expertise: "건설업 면허",
      company: "케이법무법인",
      status: "pending",
      totalBids: 0,
      completedProjects: 0,
    },
    {
      id: 2,
      name: "이기술",
      email: "expert2@example.com",
      phone: "010-2345-6789",
      expertise: "전기공사업",
      company: "프로컨설팅",
      status: "pending",
      totalBids: 0,
      completedProjects: 0,
    },
  ];

  // 검색 필터링
  const filteredExperts = allExperts.filter((expert) => {
    if (!searchQuery) return true;
    return expert.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusBadge = (status: Expert["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">승인 완료</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">승인 대기</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-700">거절됨</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const approvedExperts = filteredExperts.filter((e) => e.status === "approved");
  const pendingExperts = filteredExperts.filter((e) => e.status === "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">전체 전문가 목록</h1>
        <p className="text-gray-600">등록된 모든 전문가를 확인하고 관리합니다.</p>
      </div>

      {/* 통계 */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">전체 전문가</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredExperts.length}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">승인 완료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedExperts.length}명</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">승인 대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingExperts.length}명</div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            전문가 검색
          </CardTitle>
          <CardDescription>이름으로 전문가를 검색하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="전문가 이름 검색 (예: 홍길동)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 전문가 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            전문가 목록
          </CardTitle>
          <CardDescription>
            총 {filteredExperts.length}명의 전문가가 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredExperts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>검색 결과가 없습니다.</p>
              </div>
            ) : (
              filteredExperts.map((expert) => (
                <Link
                  key={expert.id}
                  to={
                    expert.status === "pending"
                      ? `/admin/experts/approval/${expert.id}`
                      : `/admin/experts/detail/${expert.id}`
                  }
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h3 className="font-semibold text-lg">{expert.name}</h3>
                            {getStatusBadge(expert.status)}
                            <Badge variant="outline">{expert.expertise}</Badge>
                            {expert.status === "approved" && (
                              <Badge variant="outline" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                인증됨
                              </Badge>
                            )}
                          </div>
                          <div className="grid md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">이메일:</span> {expert.email}
                            </div>
                            <div>
                              <span className="font-medium">연락처:</span> {expert.phone}
                            </div>
                            <div>
                              <span className="font-medium">소속:</span> {expert.company}
                            </div>
                            {expert.status === "approved" && (
                              <>
                                <div>
                                  <span className="font-medium">승인일:</span> {expert.approvedAt}
                                </div>
                                <div>
                                  <span className="font-medium">총 입찰:</span> {expert.totalBids}건
                                </div>
                                <div>
                                  <span className="font-medium">완료:</span> {expert.completedProjects}건
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
