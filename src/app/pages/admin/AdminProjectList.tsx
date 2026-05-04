import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, FileText, Filter } from "lucide-react";

type ProjectStatus =
  | "all"
  | "bidding"
  | "closed"
  | "paid"
  | "in_progress"
  | "association"
  | "sent"
  | "completed";
type ClientType = "all" | "member" | "guest";

interface Project {
  id: string;
  code: string;
  title: string;
  industry: string;
  company: string;
  clientName: string;
  clientType: "member" | "guest";
  status:
    | "bidding"
    | "closed"
    | "paid"
    | "in_progress"
    | "association"
    | "sent"
    | "completed";
  bidCount: number;
  createdAt: string;
}

export function AdminProjectList() {
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>("all");
  const [selectedClientType, setSelectedClientType] =
    useState<ClientType>("all");
  const [searchCode, setSearchCode] = useState("");

  const allProjects: Project[] = [
    {
      id: "1",
      code: "REQ-L5X9K2M",
      title: "건설업 일반건설업(토목공사업) 면허 취득",
      industry: "건설업",
      company: "(주)대한건설",
      clientName: "김철수",
      clientType: "member",
      status: "bidding",
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
      clientType: "guest",
      status: "closed",
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
      clientType: "member",
      status: "paid",
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
      clientType: "member",
      status: "in_progress",
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
      clientType: "guest",
      status: "association",
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
      clientType: "member",
      status: "sent",
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
      clientType: "member",
      status: "completed",
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
      clientType: "guest",
      status: "bidding",
      bidCount: 4,
      createdAt: "2026-03-29",
    },
  ];

  const filteredProjects = allProjects.filter((project) => {
    if (selectedStatus !== "all" && project.status !== selectedStatus)
      return false;
    if (
      selectedClientType !== "all" &&
      project.clientType !== selectedClientType
    )
      return false;
    if (
      searchCode &&
      !project.code.toLowerCase().includes(searchCode.toLowerCase())
    )
      return false;
    return true;
  });

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "bidding":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-700">
            입찰 중
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            마감
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-700">
            결제
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
            진단시작
          </Badge>
        );
      case "association":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-700">
            협회경유
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-700">
            발송
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-teal-100 text-teal-700">
            완료
          </Badge>
        );
    }
  };

  const getClientTypeBadge = (type: Project["clientType"]) => {
    return type === "member" ? (
      <Badge variant="outline" className="bg-teal-50 text-teal-700">
        회원
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-100 text-gray-600">
        비회원
      </Badge>
    );
  };

  const statusOptions: { value: ProjectStatus; label: string }[] = [
    { value: "all", label: "전체" },
    { value: "bidding", label: "입찰 중" },
    { value: "closed", label: "마감" },
    { value: "paid", label: "결제" },
    { value: "in_progress", label: "진단시작" },
    { value: "association", label: "협회경유" },
    { value: "sent", label: "발송" },
    { value: "completed", label: "완료" },
  ];

  const statusCounts = {
    all: allProjects.length,
    bidding: allProjects.filter((p) => p.status === "bidding").length,
    closed: allProjects.filter((p) => p.status === "closed").length,
    paid: allProjects.filter((p) => p.status === "paid").length,
    in_progress: allProjects.filter((p) => p.status === "in_progress").length,
    association: allProjects.filter((p) => p.status === "association").length,
    sent: allProjects.filter((p) => p.status === "sent").length,
    completed: allProjects.filter((p) => p.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">의뢰현황 조회</h1>
        <p className="text-gray-600">모든 의뢰 공고를 확인하고 관리합니다.</p>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {statusOptions.map((s) => (
          <Card
            key={s.value}
            className="cursor-pointer"
            onClick={() => setSelectedStatus(s.value)}
          >
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-xs text-gray-600">{s.label}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div
                className={`text-xl font-bold ${selectedStatus === s.value ? "text-teal-600" : "text-gray-800"}`}
              >
                {statusCounts[s.value]}건
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            필터 및 검색
          </CardTitle>
          <CardDescription>
            진행 상태, 회원 구분으로 필터링하거나 의뢰 코드로 검색하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 진행상태 필터 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">진행상태</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((s) => (
                <Button
                  key={s.value}
                  size="sm"
                  variant={selectedStatus === s.value ? "default" : "outline"}
                  className={
                    selectedStatus === s.value
                      ? "bg-[#009689] hover:bg-[#007d71]"
                      : ""
                  }
                  onClick={() => setSelectedStatus(s.value)}
                >
                  {s.label} ({statusCounts[s.value]})
                </Button>
              ))}
            </div>
          </div>

          {/* 회원/비회원 필터 */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              의뢰인 구분
            </p>
            <div className="flex gap-2">
              {(
                [
                  { value: "all", label: "전체" },
                  { value: "member", label: "회원" },
                  { value: "guest", label: "비회원" },
                ] as { value: ClientType; label: string }[]
              ).map((t) => (
                <Button
                  key={t.value}
                  size="sm"
                  variant={
                    selectedClientType === t.value ? "default" : "outline"
                  }
                  className={
                    selectedClientType === t.value
                      ? "bg-[#009689] hover:bg-[#007d71]"
                      : ""
                  }
                  onClick={() => setSelectedClientType(t.value)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
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
          <div className="space-y-3">
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
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold">{project.title}</h3>
                            {getStatusBadge(project.status)}
                            <Badge variant="outline">{project.industry}</Badge>
                            {getClientTypeBadge(project.clientType)}
                          </div>
                          <div className="grid md:grid-cols-4 gap-x-4 gap-y-1 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">의뢰 코드:</span>{" "}
                              {project.code}
                            </div>
                            <div>
                              <span className="font-medium">기업명:</span>{" "}
                              {project.company}
                            </div>
                            <div>
                              <span className="font-medium">의뢰인:</span>{" "}
                              {project.clientName}
                            </div>
                            <div>
                              <span className="font-medium">입찰 수:</span>{" "}
                              {project.bidCount}명
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">
                            등록일: {project.createdAt}
                          </p>
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
