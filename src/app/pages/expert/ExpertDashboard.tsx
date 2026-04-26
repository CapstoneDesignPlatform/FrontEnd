import { useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileText, DollarSign, CheckCircle2, ClipboardList } from "lucide-react";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { getExpertProfile, getMyBids } from "../../../api/expert";
import type { ExpertProfileFormVM, MyBidItemVM } from "../../../types/expert";
import { useAsyncData } from "../../hooks/useAsyncData";

type ExpertDashboardData = {
  profile: ExpertProfileFormVM;
  recentBids: MyBidItemVM[];
};

export function ExpertDashboard() {
  const loadDashboardData = useCallback(
    async () => {
      const [profile, bids] = await Promise.all([getExpertProfile(), getMyBids()]);
      return {
        profile,
        recentBids: bids.slice(0, 3),
      };
    },
    [],
  );
  const { data, error, isLoading } = useAsyncData<ExpertDashboardData>(
    loadDashboardData,
  );
  const profile = data?.profile ?? null;
  const recentBids = data?.recentBids ?? [];

  const stats = profile?.stats ?? {
    activeBids: 0,
    wonProjects: 0,
    completedProjects: 0,
    totalEarned: "₩0",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">전문가 마이페이지</h1>
      </div>

      {isLoading ? (
        <AsyncStateCard message="대시보드 정보를 불러오는 중입니다." />
      ) : null}

      {error ? (
        <AsyncStateCard
          message="대시보드 정보를 불러오지 못했습니다."
          tone="danger"
        />
      ) : null}

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">대기 중인 입찰</CardTitle>
            <ClipboardList className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activeBids}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">진행 중인 의뢰</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.wonProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">완료된 의뢰</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.completedProjects}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">총 수익</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalEarned}</div>
            <p className="text-xs text-gray-600 mt-1">누적 수익</p>
          </CardContent>
        </Card>
      </div>

      {/* 최근 입찰 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 입찰 내역</CardTitle>
          <CardDescription>가장 최근에 입찰한 의뢰 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBids.map((bid) => (
              <div
                key={bid.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="mb-1">{bid.projectTitle}</h3>
                  <p className="text-sm text-gray-600">입찰가: {bid.myBid}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      bid.status === "선정됨"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {bid.status}
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/expert/jobs/${bid.projectId}`}>상세보기</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button asChild variant="ghost">
              <Link to="/expert/bids">모든 입찰 내역 보기 →</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
