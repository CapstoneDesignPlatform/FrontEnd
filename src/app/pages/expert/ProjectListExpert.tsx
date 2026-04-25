import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Search, Bell } from "lucide-react";
import { JobCard } from "../../components/expert/JobCard";
import { getExpertJobs } from "../../../api/expert";
import type { ExpertJobListItemVM } from "../../../types/expert";

export function ProjectListExpert() {
  const { setUser } = useOutletContext<{ user: unknown; setUser: (user: unknown) => void }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [projects, setProjects] = useState<ExpertJobListItemVM[]>([]);

  // 컴포넌트 마운트 시 전문가로 user 설정
  useEffect(() => {
    setUser({ type: "expert", name: "전문가" });
  }, [setUser]);

  useEffect(() => {
    void getExpertJobs().then(setProjects);
  }, []);

  // 필터링된 의뢰
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || project.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">공고 목록</h1>
          <p className="text-gray-600">관심있는 의뢰에 입찰하세요.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          알림 서비스 (유료)
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="의뢰 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="필요 면허">필요 면허</SelectItem>
                <SelectItem value="실태 조사">실태 조사</SelectItem>
                <SelectItem value="주기적 신고">주기적 신고</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 공고 목록 */}
      <div className="grid gap-4">
        {filteredProjects.map((project) => (
          <JobCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">검색 결과가 없습니다.</p>
          </CardContent>
        </Card>
      )}

      {/* 알림 서비스 안내 */}
      <Card className="bg-teal-50 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-900">
            <Bell className="h-5 w-5 text-teal-600" />
            알림 서비스 (유료)
          </CardTitle>
          <CardDescription className="text-teal-800">
            새로운 공고가 등록되면 즉시 알림을 받을 수 있습니다. 경쟁자보다 빠르게 입찰하세요!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-teal-600 hover:bg-teal-700">알림 서비스 신청하기</Button>
        </CardContent>
      </Card>
    </div>
  );
}
