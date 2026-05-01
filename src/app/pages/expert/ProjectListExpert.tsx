import { useState } from "react";
import { Bell, Info, Search, SlidersHorizontal, Table2 } from "lucide-react";

import { getExpertJobs } from "../../../api/expert";
import type { ExpertJobListItemVM } from "../../../types/expert";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { JobTable } from "../../components/expert/JobTable";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAsyncData } from "../../hooks/useAsyncData";

const emptyProjects: ExpertJobListItemVM[] = [];

export function ProjectListExpert() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { data, error, isLoading } = useAsyncData(getExpertJobs, {
    initialData: emptyProjects,
  });
  const projects = data ?? [];
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredProjects = projects.filter((project) => {
    const searchableText = [
      project.title,
      project.companyName,
      project.industry,
      project.type,
      project.businessType,
      project.requiredLicense,
      project.currentLicense,
      project.currentIndustry,
      project.reason,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      normalizedSearchTerm.length === 0 ||
      searchableText.includes(normalizedSearchTerm);
    const matchesType = filterType === "all" || project.type === filterType;

    return matchesSearch && matchesType;
  });
  const newProjectCount = filteredProjects.filter((project) => project.isNew).length;
  const averageBidCount =
    filteredProjects.length > 0
      ? Math.round(
          filteredProjects.reduce((sum, project) => sum + project.bids, 0) /
            filteredProjects.length,
        )
      : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="border-teal-200 bg-teal-50 text-teal-700">
              Expert Board
            </Badge>
            <span className="text-sm text-gray-500">스프레드시트형 공고 탐색</span>
          </div>
          <h1 className="text-3xl">공고 목록</h1>
          <p className="mt-2 text-gray-600">
            많은 공고를 빠르게 비교할 수 있도록 핵심 정보만 촘촘하게 정리했습니다.
          </p>
        </div>
        <div className="group relative flex w-fit items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            알림 서비스
          </Button>
          <button
            type="button"
            aria-describedby="notification-service-info"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-200 bg-teal-50 text-teal-700 transition-colors hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">알림 서비스 안내 보기</span>
          </button>
          <div
            id="notification-service-info"
            role="tooltip"
            className="pointer-events-none absolute left-full top-0 z-20 ml-2 w-72 translate-y-1 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 opacity-0 shadow-xl shadow-slate-900/10 transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
          >
            <p className="font-semibold text-slate-950">알림 서비스</p>
            <p className="mt-1 leading-relaxed">
              새로운 공고가 등록되면 조건에 맞는 전문가에게 빠르게 알림을 보내는
              유료 기능입니다.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-slate-200">
        <CardContent className="pt-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="공고명, 기업명, 업종, 면허 조건 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full xl:w-48">
                <SelectValue placeholder="전체 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 유형</SelectItem>
                <SelectItem value="필요 면허">필요 면허</SelectItem>
                <SelectItem value="실태 조사">실태 조사</SelectItem>
                <SelectItem value="주기적 신고">주기적 신고</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 text-sm text-slate-600 xl:ml-auto">
              <span className="rounded-md border bg-slate-50 px-3 py-2">
                표시 {filteredProjects.length}건
              </span>
              <span className="rounded-md border bg-slate-50 px-3 py-2">
                신규 {newProjectCount}건
              </span>
              <span className="rounded-md border bg-slate-50 px-3 py-2">
                평균 입찰 {averageBidCount}명
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-slate-200">
        <CardHeader className="border-b bg-white px-4 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Table2 className="h-4 w-4 text-teal-600" />
                실시간 공고 보드
              </CardTitle>
              <CardDescription>
                행을 훑으면서 조건을 비교하고, 필요한 공고만 상세로 들어가세요.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="md:hidden">작은 화면에서는 핵심 열만 표시됩니다.</span>
              <span className="hidden md:inline">
                가로 스크롤로 전체 열을 확인할 수 있습니다.
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <AsyncStateCard message="공고 목록을 불러오는 중입니다." />
            </div>
          ) : null}

          {error ? (
            <div className="p-4">
              <AsyncStateCard message="공고 목록을 불러오지 못했습니다." tone="danger" />
            </div>
          ) : null}

          {!isLoading && !error && filteredProjects.length === 0 ? (
            <div className="p-4">
              <AsyncStateCard message="검색 결과가 없습니다." />
            </div>
          ) : null}

          {!isLoading && !error && filteredProjects.length > 0 ? (
            <JobTable projects={filteredProjects} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
