import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, FileText, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

type ProjectStatus = "all" | "unmatched" | "matched" | "paid" | "completed";

interface Project {
  id: string;
  code: string;
  title: string;
  industry: string;
  company: string;
  clientName: string;
  status: "unmatched" | "matched" | "paid" | "completed";
  bidCount: number;
  createdAt: string;
}

export function AdminProjectList() {
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>("all");
  const [searchCode, setSearchCode] = useState("");

  // 데모 데이터
  const allProjects: Project[] = [
    {
      id: "1",
      code: "REQ-L5X9K2M",
      title: "건설업 일반건설업(토목공사업) 면허 취득",
      industry: "건설업",
      company: "(주)대한건설",
      clientName: "김철수",
      status: "matched",
      bidCount: 8,
      createdAt: "2026-04-05",
    },
    {
      id: "2",
      code: "REQ-M3P7N1K",
      title: "제조업 실태 조사",
      industry: "실태 조사",
      company: "한국제조(주)",
      clientName: "이영희",
      status: "paid",
      bidCount: 5,
      createdAt: "2026-04-04",
    },
    {
      id: "3",
      code: "REQ-K9L2M5P",
      title: "전기공사업 면허 신청 대행",
      industry: "전기공사업",
      company: "전기산업(주)",
      clientName: "박민수",
      status: "completed",
      bidCount: 12,
      createdAt: "2026-04-03",
    },
    {
      id: "4",
      code: "REQ-N7M4K1L",
      title: "정보통신공사업 등록",
      industry: "정보통신공사업",
      company: "(주)IT솔루션",
      clientName: "정수현",
      status: "unmatched",
      bidCount: 3,
      createdAt: "2026-04-02",
    },
    {
      id: "5",
      code: "REQ-P2K9M3L",
      title: "소방시설공사업 면허",
      industry: "소방시설공사업",
      company: "안전소방(주)",
      clientName: "최영수",
      status: "matched",
      bidCount: 7,
      createdAt: "2026-04-01",
    },
    {
      id: "6",
      code: "REQ-L1M8K5N",
      title: "의약품도매상 허가",
      industry: "의약품도매상",
      company: "헬스케어(주)",
      clientName: "강민지",
      status: "unmatched",
      bidCount: 2,
      createdAt: "2026-03-31",
    },
    {
      id: "7",
      code: "REQ-K5M2L9P",
      title: "건설업 전문건설업(실내건축공사업) 면허",
      industry: "건설업",
      company: "인테리어건설(주)",
      clientName: "윤성호",
      status: "paid",
      bidCount: 10,
      createdAt: "2026-03-30",
    },
    {
      id: "8",
      code: "REQ-M9L3K7N",
      title: "기업 자본금 변동 진단",
      industry: "기타",
      company: "(주)글로벌무역",
      clientName: "임지연",
      status: "matched",
      bidCount: 4,
      createdAt: "2026-03-29",
    },
  ];

  // 필터링된 프로젝트
  const filteredProjects = allProjects.filter((project) => {
    // 상태 필터
    if (selectedStatus !== "all" && project.status !== selectedStatus) {
      return false;
    }
    // 검색어 필터
    if (searchCode && !project.code.toLowerCase().includes(searchCode.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status: Project["status"]) => {
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
      case "all":
        return "전체";
      case "unmatched":
        return "매칭 대기";
      case "matched":
        return "전문가 매칭됨";
      case "paid":
        return "결제 완료";
      case "completed":
        return "의뢰 완료";
      default:
        return "전체";
    }
  };

  const statusCounts = {
    all: allProjects.length,
    unmatched: allProjects.filter((p) => p.status === "unmatched").length,
    matched: allProjects.filter((p) => p.status === "matched").length,
    paid: allProjects.filter((p) => p.status === "paid").length,
    completed: allProjects.filter((p) => p.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">총 공고 목록</h1>
        <p className="text-gray-600">모든 의뢰 공고를 확인하고 관리합니다.</p>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            필터 및 검색
          </CardTitle>
          <CardDescription>진행 상태별로 공고를 필터링하거나 의뢰 코드로 검색하세요.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 상태 필터 버튼 */}
          <div className="flex flex-wrap gap-2">
            {(["all", "unmatched", "matched", "paid", "completed"] as ProjectStatus[]).map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                className={selectedStatus === status ? "bg-[#009689] hover:bg-[#007d71]" : ""}
                onClick={() => setSelectedStatus(status)}
              >
                {getStatusLabel(status)} ({statusCounts[status]})
              </Button>
            ))}
          </div>

          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="의뢰 코드로 검색 (예: REQ-L5X9K2M)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* 통계 요약 */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">전체</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.all}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">매칭 대기</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">{statusCounts.unmatched}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">전문가 매칭됨</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{statusCounts.matched}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">결제 완료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{statusCounts.paid}건</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-gray-600">의뢰 완료</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">{statusCounts.completed}건</div>
          </CardContent>
        </Card>
      </div>

      {/* 공고 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            공고 목록
          </CardTitle>
          <CardDescription>
            총 {filteredProjects.length}건의 공고가 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>조건에 맞는 공고가 없습니다.</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/admin/projects/${project.id}`}
                  className="block"
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            {getStatusBadge(project.status)}
                            <Badge variant="outline">{project.industry}</Badge>
                          </div>
                          <div className="grid md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">의뢰 코드:</span> {project.code}
                            </div>
                            <div>
                              <span className="font-medium">기업명:</span> {project.company}
                            </div>
                            <div>
                              <span className="font-medium">의뢰인:</span> {project.clientName}
                            </div>
                            <div>
                              <span className="font-medium">입찰 수:</span> {project.bidCount}명
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            등록일: {project.createdAt}
                          </div>
                        </div>
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
