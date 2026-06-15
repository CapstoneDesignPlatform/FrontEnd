import { useCallback, useMemo, useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Info,
  Search,
  SlidersHorizontal,
  Table2,
} from "lucide-react";

import { getExpertJobs } from "../../../api/expert";
import type {
  ExpertJobListItemVM,
  ExpertJobListResultVM,
  JobPostSort,
} from "../../../types/expert";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { JobTable } from "../../components/expert/JobTable";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useAsyncData } from "../../hooks/useAsyncData";

const emptyProjects: ExpertJobListItemVM[] = [];
const emptyProjectResult: ExpertJobListResultVM = {
  hasNext: false,
  items: emptyProjects,
  page: 1,
  size: 20,
  totalCount: 0,
  totalPages: 1,
};
type ProjectSortKey =
  | "postedDateDesc"
  | "postedDateAsc"
  | "bidsDesc"
  | "bidsAsc";

const projectSortOptions: Array<{ label: string; value: ProjectSortKey }> = [
  { value: "postedDateDesc", label: "등록일 최신순" },
  { value: "postedDateAsc", label: "등록일 오래된순" },
  { value: "bidsDesc", label: "입찰 인원 많은순" },
  { value: "bidsAsc", label: "입찰 인원 적은순" },
];
const pageSizeOptions = [20, 50, 100];

export function ProjectListExpert() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortKey, setSortKey] = useState<ProjectSortKey>("postedDateDesc");
  const loadProjects = useCallback(
    () =>
      getExpertJobs({
        page,
        size: pageSize,
        sort: getApiSort(sortKey),
      }),
    [page, pageSize, sortKey],
  );
  const { data, error, isLoading } = useAsyncData(loadProjects, {
    initialData: emptyProjectResult,
    keepPreviousData: true,
  });
  const projects = data?.items ?? [];
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const searchableText = [
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
      }),
    [filterType, normalizedSearchTerm, projects],
  );
  const sortedProjects = useMemo(
    () => sortProjects(filteredProjects, sortKey),
    [filteredProjects, sortKey],
  );
  const newProjectCount = filteredProjects.filter((project) => project.isNew).length;
  const averageBidCount =
    filteredProjects.length > 0
      ? Math.round(
          filteredProjects.reduce((sum, project) => sum + project.bids, 0) /
            filteredProjects.length,
        )
      : 0;
  const currentPage = page;
  const totalPages = Math.max(data?.totalPages ?? 1, 1);
  const totalCount = data?.totalCount ?? 0;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleFilterTypeChange = (value: string) => {
    setFilterType(value);
    setPage(1);
  };

  const handleSortKeyChange = (value: string) => {
    setSortKey(value as ProjectSortKey);
    setPage(1);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setPage(1);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              Expert Board
            </Badge>
            <span className="text-sm text-gray-500">스프레드시트형 의뢰 탐색</span>
          </div>
          <h1 className="text-3xl">의뢰 목록</h1>
        </div>
        <div className="group relative flex w-fit items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Bell className="h-4 w-4" />
            알림 서비스
          </Button>
          <button
            type="button"
            aria-describedby="notification-service-info"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
              새로운 의뢰가 등록되면 조건에 맞는 전문가에게 빠르게 알림을 보내는
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
                placeholder="업종, 유형, 면허 조건 검색"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={handleFilterTypeChange}>
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
                표시 {sortedProjects.length}건
              </span>
              <span className="rounded-md border bg-slate-50 px-3 py-2">
                전체 {totalCount}건
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
                <Table2 className="h-4 w-4 text-blue-600" />
                실시간 의뢰 목록
              </CardTitle>
              <CardDescription>
                "입찰 가능" 상태에서만 입찰할 수 있으며, 이미 입찰한 공고는 완료 상태로 표시됩니다.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="md:hidden">유형, 핵심조건, 자산, 상태, 액션만 표시됩니다.</span>
                <span className="hidden md:inline">
                  원하는 기준으로 의뢰를 정렬할 수 있습니다.
                </span>
              </div>
              <Select
                value={sortKey}
                onValueChange={handleSortKeyChange}
              >
                <SelectTrigger className="h-9 w-full bg-white sm:w-[180px]">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  {projectSortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <AsyncStateCard message="의뢰 목록을 불러오는 중입니다." />
            </div>
          ) : null}

          {error ? (
            <div className="p-4">
              <AsyncStateCard message="의뢰 목록을 불러오지 못했습니다." tone="danger" />
            </div>
          ) : null}

          {!isLoading && !error && sortedProjects.length === 0 ? (
            <div className="p-4">
              <AsyncStateCard message="검색 결과가 없습니다." />
            </div>
          ) : null}

          {!isLoading && !error && sortedProjects.length > 0 ? (
            <JobTable projects={sortedProjects} />
          ) : null}

          {!error && totalCount > 0 ? (
            <PaginationBar
              currentPage={currentPage}
              isLoading={isLoading}
              pageSize={pageSize}
              totalCount={totalCount}
              totalPages={totalPages}
              onNextPage={() =>
                setPage((current) => Math.min(current + 1, totalPages))
              }
              onPageSizeChange={handlePageSizeChange}
              onPreviousPage={() =>
                setPage((current) => Math.max(current - 1, 1))
              }
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function PaginationBar({
  currentPage,
  isLoading,
  onNextPage,
  onPageSizeChange,
  onPreviousPage,
  pageSize,
  totalCount,
  totalPages,
}: {
  currentPage: number;
  isLoading: boolean;
  onNextPage: () => void;
  onPageSizeChange: (value: string) => void;
  onPreviousPage: () => void;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}) {
  return (
    <div className="flex flex-col gap-3 border-t bg-white px-4 py-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span>
          전체 {totalCount}건 · {currentPage}/{totalPages}페이지
        </span>
        <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
          <SelectTrigger className="h-8 w-[112px] bg-white">
            <SelectValue placeholder="표시 개수" />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}개씩
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2 text-xs"
          disabled={isLoading || currentPage <= 1}
          onClick={onPreviousPage}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          이전
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2 text-xs"
          disabled={isLoading || currentPage >= totalPages}
          onClick={onNextPage}
        >
          다음
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function sortProjects(
  projects: ExpertJobListItemVM[],
  sortKey: ProjectSortKey,
) {
  return [...projects].sort((left, right) => {
    if (sortKey === "postedDateAsc") {
      return compareDateAsc(left.postedDate, right.postedDate);
    }

    if (sortKey === "bidsDesc") {
      return right.bids - left.bids || compareDateDesc(left.postedDate, right.postedDate);
    }

    if (sortKey === "bidsAsc") {
      return left.bids - right.bids || compareDateDesc(left.postedDate, right.postedDate);
    }

    return compareDateDesc(left.postedDate, right.postedDate);
  });
}

function getApiSort(sortKey: ProjectSortKey): JobPostSort {
  return sortKey === "postedDateAsc" ? "posted_at_asc" : "posted_at_desc";
}

function compareDateAsc(left?: string, right?: string) {
  return (parseDateToTime(left) ?? 0) - (parseDateToTime(right) ?? 0);
}

function compareDateDesc(left?: string, right?: string) {
  return (parseDateToTime(right) ?? 0) - (parseDateToTime(left) ?? 0);
}

function parseDateToTime(value?: string) {
  if (!value) return null;

  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day).getTime();
}
