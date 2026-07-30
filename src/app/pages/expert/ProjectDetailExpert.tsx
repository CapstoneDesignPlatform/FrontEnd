import { useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Users } from "lucide-react";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { getExpertJobDetail } from "../../../api/expert";
import { useAsyncData } from "../../hooks/useAsyncData";
import {
  canBidOnExpertJob,
  getExpertBidAvailability,
} from "../../components/expert/jobStatus";

export function ProjectDetailExpert() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loadProject = useCallback(() => getExpertJobDetail(id ?? 1), [id]);
  const {
    data: project,
    error,
    isLoading,
  } = useAsyncData(loadProject, {
    keepPreviousData: true,
  });

  if (error) {
    return (
      <div className="space-y-6">
        <AsyncStateCard message="의뢰 정보를 불러오지 못했습니다." tone="danger" />
      </div>
    );
  }

  if (isLoading && !project) {
    return (
      <div className="space-y-6">
        <AsyncStateCard message="의뢰 정보를 불러오는 중입니다." />
      </div>
    );
  }

  if (!project) return null;

  const hasMyBid = project.hasMyBid === true;
  const bidStatus = getExpertBidAvailability(project);
  const canBid = canBidOnExpertJob(project);
  const bidPath = `/expert/jobs/${encodeURIComponent(project.announcementCode)}/bid`;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-1.5 md:mb-3 md:gap-2">
            <Badge
              variant="outline"
              className="border-blue-200 bg-blue-50 text-[11px] text-blue-700 md:text-xs"
            >
              {project.industry}
            </Badge>
            <Badge variant="outline" className="text-[11px] md:text-xs">
              {project.type}
            </Badge>
            <Badge
              className={
                bidStatus === "입찰 가능"
                  ? "bg-green-100 text-[11px] text-green-700 md:text-xs"
                  : "bg-slate-100 text-[11px] text-slate-600 md:text-xs"
              }
            >
              {bidStatus}
            </Badge>
          </div>
          <h1 className="mb-1.5 break-keep text-xl font-semibold leading-snug text-slate-950 md:mb-2 md:text-3xl md:font-normal">
            {project.title}
          </h1>
          <p className="text-xs text-gray-600 md:text-base">
            등록일: {project.createdAt}
          </p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <Button asChild variant="outline" className="h-8 px-3 text-xs md:h-9 md:text-sm">
            <Link to="/expert/jobs">목록으로</Link>
          </Button>
          {canBid && !hasMyBid ? (
            <Button
              className="h-8 bg-blue-600 px-3 text-xs hover:bg-blue-700 md:h-9 md:text-sm"
              onClick={() => navigate(bidPath)}
            >
              입찰 시작
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="h-8 px-3 text-xs md:h-9 md:text-sm"
              disabled
            >
              {hasMyBid ? "입찰 완료" : "입찰 마감"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:gap-6 lg:grid-cols-3">
        {/* 주요 정보 */}
        <div className="space-y-3 md:space-y-6 lg:col-span-2">
          {/* 의뢰인이 입력한 정보 */}
          <Card className="gap-3 md:gap-6">
            <CardHeader className="p-3 md:px-6 md:pt-6">
              <CardTitle className="text-base md:text-lg">의뢰 정보</CardTitle>
              <CardDescription className="hidden text-xs md:block md:text-sm">
                의뢰인이 입력한 상세 정보입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3 text-[13px] [&:last-child]:pb-3 md:px-6 md:pb-6 md:text-base md:[&:last-child]:pb-6">
              <div className="space-y-2 md:space-y-4">
                <div className="grid grid-cols-2 gap-2 border-b pb-2 md:gap-4 md:pb-4">
                  <div className="min-w-0">
                    <p className="mb-0.5 text-[11px] text-gray-600 md:mb-1 md:text-sm">업종</p>
                    <p className="font-medium leading-snug">{project.industry}</p>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-0.5 text-[11px] text-gray-600 md:mb-1 md:text-sm">의뢰 유형</p>
                    <p className="font-medium leading-snug">{project.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-b pb-2 md:gap-4 md:pb-4">
                  <div className="min-w-0">
                    <p className="mb-0.5 text-[11px] text-gray-600 md:mb-1 md:text-sm">사업자 유형</p>
                    <p className="font-medium leading-snug">
                      {project.businessType ?? "사업자 유형 미공개"}
                    </p>
                  </div>
                  {project.classification && (
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[11px] text-gray-600 md:mb-1 md:text-sm">구분</p>
                      <p className="font-medium leading-snug">{project.classification}</p>
                    </div>
                  )}
                </div>

                {/* 필요 면허 유형일 때 */}
                {project.type === "필요 면허" && (
                  <>
                    {project.requiredLicense && (
                      <div className="border-b pb-2 md:pb-4">
                        <p className="mb-0.5 text-[11px] text-gray-600 md:mb-1 md:text-sm">필요 면허</p>
                        <p className="font-medium leading-snug">{project.requiredLicense}</p>
                      </div>
                    )}
                    {project.currentIndustry && (
                      <div className="border-b pb-2 md:pb-4">
                        <p className="mb-0.5 text-[11px] text-gray-600 md:mb-1 md:text-sm">현재 업종</p>
                        <p className="font-medium leading-snug">{project.currentIndustry}</p>
                      </div>
                    )}
                  </>
                )}

                {/* 실태 조사 유형일 때 */}
                {project.type === "실태 조사" && project.currentLicense && (
                  <div className="border-b pb-2 md:pb-4">
                    <p className="mb-0.5 text-[11px] text-gray-600 md:mb-1 md:text-sm">보유 면허</p>
                    <p className="font-medium leading-snug">{project.currentLicense}</p>
                  </div>
                )}

                {/* 기타 유형일 때 */}
                {project.type === "기타" && project.reason && (
                  <div className="border-b pb-2 md:pb-4">
                    <p className="mb-0.5 text-[11px] text-gray-600 md:mb-1 md:text-sm">진단 사유</p>
                    <p className="font-medium leading-snug">{project.reason}</p>
                  </div>
                )}

                {/* 자산 규모 */}
                {project.assetScale && project.assetScale !== "-" && (
                  <div>
                    <p className="mb-0.5 text-[11px] text-gray-600 md:mb-1 md:text-sm">자산 규모</p>
                    <p className="font-medium leading-snug">{project.assetScale}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-3 md:space-y-4 lg:col-start-3 lg:row-start-1">
          <Card className="gap-2 md:gap-6">
            <CardHeader className="p-3 md:px-6 md:pt-6">
              <CardTitle className="text-base md:text-lg">입찰 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3 pb-3 [&:last-child]:pb-3 md:space-y-4 md:px-6 md:pb-6 md:[&:last-child]:pb-6">
              <div className="flex items-start gap-2 md:gap-3">
                <Users className="mt-0.5 h-4 w-4 text-blue-600 md:h-5 md:w-5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-600 md:text-sm">현재 입찰 수</p>
                  <p className="text-base font-medium md:text-lg">{project.bids}개</p>
                  <p className="mt-1 text-[11px] text-gray-500 md:text-xs">
                    경쟁이 치열할수록 빠른 입찰이 유리합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-0 border-blue-200 bg-blue-50">
            <CardContent className="px-3 py-3 [&:last-child]:pb-3 md:px-6 md:pt-6 md:[&:last-child]:pb-6">
              <h4 className="mb-1.5 text-sm font-medium text-blue-900 md:mb-2 md:text-base">
                입찰 안내
              </h4>
              {canBid ? (
                <ul className="space-y-0.5 text-xs leading-snug text-blue-800 md:space-y-1 md:text-sm">
                  <li>• 입찰가는 협상 전 가격입니다</li>
                  <li>• 의뢰인이 선택하면 연락처가 공개됩니다</li>
                  <li>• 최종 가격은 직접 협상으로 결정됩니다</li>
                </ul>
              ) : (
                <p className="text-xs leading-snug text-blue-800 md:text-sm">
                  마감된 의뢰는 입찰을 시작하거나 수정할 수 없습니다.
                </p>
              )}
            </CardContent>
          </Card>

          {canBid && !hasMyBid ? (
            <Button
              className="h-9 w-full bg-blue-600 text-sm hover:bg-blue-700 md:h-10 md:text-base"
              size="lg"
              onClick={() => navigate(bidPath)}
            >
              지금 입찰하기
            </Button>
          ) : (
            <Button
              type="button"
              className="h-9 w-full text-sm md:h-10 md:text-base"
              size="lg"
              variant="outline"
              disabled
            >
              {hasMyBid ? "입찰 완료" : "입찰 마감"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
