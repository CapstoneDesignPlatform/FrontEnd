import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Users, CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AdminExperts() {
  // 데모 데이터
  const stats = {
    totalExperts: 24,
    pendingExperts: 5,
    approvedExperts: 19,
  };

  const pendingExperts = [
    {
      id: 1,
      name: "김전문",
      email: "expert1@example.com",
      phone: "010-1234-5678",
      expertise: "건설업 면허",
      appliedDate: "2026-04-05",
      hasDocuments: true,
    },
    {
      id: 2,
      name: "이기술",
      email: "expert2@example.com",
      phone: "010-2345-6789",
      expertise: "전기공사업",
      appliedDate: "2026-04-04",
      hasDocuments: true,
    },
    {
      id: 3,
      name: "박컨설",
      email: "expert3@example.com",
      phone: "010-3456-7890",
      expertise: "실태 조사",
      appliedDate: "2026-04-03",
      hasDocuments: true,
    },
    {
      id: 4,
      name: "최자격",
      email: "expert4@example.com",
      phone: "010-4567-8901",
      expertise: "정보통신공사업",
      appliedDate: "2026-04-02",
      hasDocuments: true,
    },
    {
      id: 5,
      name: "정면허",
      email: "expert5@example.com",
      phone: "010-5678-9012",
      expertise: "소방시설공사업",
      appliedDate: "2026-04-01",
      hasDocuments: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">전문가 관리</h1>
        <p className="text-gray-600">전문가 승인 및 관리를 수행합니다.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">총 전문가</CardTitle>
              <Users className="h-4 w-4 text-gray-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExperts}명</div>
            <p className="text-xs text-gray-600 mt-1">
              등록된 전체 전문가 수
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link to="/admin/experts/list">전체 목록 보기</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">승인 대기 중</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingExperts}명</div>
            <p className="text-xs text-gray-600 mt-1">
              신규 전문가 승인 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">승인 완료</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedExperts}명</div>
            <p className="text-xs text-gray-600 mt-1">
              활동 가능한 전문가 수
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 승인 대기 전문가 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            승인 대기 중인 전문가
          </CardTitle>
          <CardDescription>
            전문가 신청을 검토하고 승인 또는 거절하세요.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingExperts.map((expert) => (
              <Card key={expert.id} className="border-l-4 border-l-amber-500">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{expert.name}</h3>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          대기 중
                        </Badge>
                        {expert.hasDocuments && (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            서류 첨부됨
                          </Badge>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">이메일:</span> {expert.email}
                        </div>
                        <div>
                          <span className="font-medium">연락처:</span> {expert.phone}
                        </div>
                        <div>
                          <span className="font-medium">전문 분야:</span> {expert.expertise}
                        </div>
                        <div>
                          <span className="font-medium">신청일:</span> {expert.appliedDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        className="bg-[#009689] hover:bg-[#007d71]"
                      >
                        <Link to={`/admin/experts/approval/${expert.id}`}>
                          상세보기
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {pendingExperts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>승인 대기 중인 전문가가 없습니다.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 최근 승인된 전문가 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 승인된 전문가</CardTitle>
          <CardDescription>최근 7일 이내 승인된 전문가 목록</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Link to="/admin/experts/detail/101" className="flex items-center justify-between py-2 border-b hover:bg-gray-50 px-2 rounded transition-colors">
              <div>
                <p className="font-medium">홍길동</p>
                <p className="text-sm text-gray-600">건설업 면허</p>
              </div>
              <Badge className="bg-green-100 text-green-700">승인 완료</Badge>
            </Link>
            <Link to="/admin/experts/detail/102" className="flex items-center justify-between py-2 border-b hover:bg-gray-50 px-2 rounded transition-colors">
              <div>
                <p className="font-medium">강전문</p>
                <p className="text-sm text-gray-600">전기공사업</p>
              </div>
              <Badge className="bg-green-100 text-green-700">승인 완료</Badge>
            </Link>
            <Link to="/admin/experts/detail/103" className="flex items-center justify-between py-2 border-b hover:bg-gray-50 px-2 rounded transition-colors">
              <div>
                <p className="font-medium">신기술</p>
                <p className="text-sm text-gray-600">정보통신공사업</p>
              </div>
              <Badge className="bg-green-100 text-green-700">승인 완료</Badge>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}