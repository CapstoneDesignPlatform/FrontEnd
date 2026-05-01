import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { MyBidCard } from "../../components/expert/MyBidCard";
import { getMyBids } from "../../../api/expert";
import type { MyBidItemVM } from "../../../types/expert";
import { useAsyncData } from "../../hooks/useAsyncData";

const emptyBids: MyBidItemVM[] = [];
type BidStatusFilter = "all" | MyBidItemVM["status"];

export function MyBids() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BidStatusFilter>("all");
  const { data, error, isLoading } = useAsyncData(getMyBids, {
    initialData: emptyBids,
  });
  const bids = data ?? [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "선정됨":
        return "bg-green-100 text-green-700";
      case "대기 중":
        return "bg-yellow-100 text-yellow-700";
      case "거절됨":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const pendingBidCount = bids.filter((bid) => bid.status === "대기 중").length;
  const selectedBidCount = bids.filter((bid) => bid.status === "선정됨").length;
  const rejectedBidCount = bids.filter((bid) => bid.status === "거절됨").length;
  const winRate = bids.length > 0
    ? Math.round((selectedBidCount / bids.length) * 100)
    : 0;
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredBids = bids.filter((bid) => {
    const matchesStatus = statusFilter === "all" || bid.status === statusFilter;
    const searchableText = [
      bid.projectTitle,
      bid.myBid,
      bid.status,
      bid.bidDate,
      `${bid.totalBids}명`,
    ].join(" ").toLowerCase();

    return (
      matchesStatus &&
      (!normalizedSearchQuery || searchableText.includes(normalizedSearchQuery))
    );
  });
  const activeBids = filteredBids.filter(
    (bid) => bid.status === "대기 중" || bid.status === "선정됨",
  );
  const pastBids = filteredBids.filter((bid) => bid.status === "거절됨");
  const hasNoBids = !isLoading && !error && bids.length === 0;
  const hasNoFilteredResults =
    !isLoading && !error && bids.length > 0 && filteredBids.length === 0;
  const statusFilterOptions: Array<{
    count: number;
    label: string;
    value: BidStatusFilter;
  }> = [
    { value: "all", label: "전체", count: bids.length },
    { value: "대기 중", label: "대기 중", count: pendingBidCount },
    { value: "선정됨", label: "선정됨", count: selectedBidCount },
    { value: "거절됨", label: "거절됨", count: rejectedBidCount },
  ];

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const handleCopyContact = (contact: string) => {
    navigator.clipboard.writeText(contact).then(() => {
      toast.success("연락처가 클립보드에 복사되었습니다!");
    }).catch(() => {
      toast.error("연락처 복사에 실패했습니다.");
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">내 입찰 내역</h1>
          <p className="text-gray-600">제출한 입찰을 관리하고 상태를 확인하세요.</p>
        </div>
        <Button asChild>
          <Link to="/expert/jobs">새 공고 찾기</Link>
        </Button>
      </div>

      {isLoading ? (
        <AsyncStateCard message="입찰 내역을 불러오는 중입니다." />
      ) : null}

      {error ? (
        <AsyncStateCard message="입찰 내역을 불러오지 못했습니다." tone="danger" />
      ) : null}

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <Card>
          <CardHeader className="px-2 pb-1 pt-3 text-center md:px-6 md:pb-3 md:pt-6 md:text-left">
            <CardTitle className="whitespace-nowrap text-[11px] leading-tight tracking-[-0.04em] text-gray-600 md:text-sm md:tracking-normal">
              활성 입찰
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3 text-center md:px-6 md:pb-6 md:text-left">
            <div className="text-xl font-semibold leading-none md:text-2xl">
              {pendingBidCount}
            </div>
            <p className="mt-1 text-[10px] leading-none text-gray-500 md:text-xs">
              대기 중
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-2 pb-1 pt-3 text-center md:px-6 md:pb-3 md:pt-6 md:text-left">
            <CardTitle className="whitespace-nowrap text-[11px] leading-tight tracking-[-0.04em] text-gray-600 md:text-sm md:tracking-normal">
              선정된 의뢰
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3 text-center md:px-6 md:pb-6 md:text-left">
            <div className="text-xl font-semibold leading-none md:text-2xl">
              {selectedBidCount}
            </div>
            <p className="mt-1 text-[10px] leading-none text-gray-500 md:text-xs">
              진행 중
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-2 pb-1 pt-3 text-center md:px-6 md:pb-3 md:pt-6 md:text-left">
            <CardTitle className="whitespace-nowrap text-[11px] leading-tight tracking-[-0.04em] text-gray-600 md:text-sm md:tracking-normal">
              입찰 성공률
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 pb-3 text-center md:px-6 md:pb-6 md:text-left">
            <div className="text-xl font-semibold leading-none md:text-2xl">
              {winRate}
              %
            </div>
            <p className="mt-1 text-[10px] leading-none text-gray-500 md:text-xs">
              전체 대비
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="relative md:max-w-md md:flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-10 bg-white pl-9"
                placeholder="공고명, 입찰가, 상태로 검색"
              />
            </div>
            <p className="text-xs text-gray-500">
              총 {filteredBids.length}건 표시
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {statusFilterOptions.map((option) => {
              const isActive = statusFilter === option.value;

              return (
                <Button
                  key={option.value}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(option.value)}
                  className={`shrink-0 rounded-full px-3 ${
                    isActive
                      ? "bg-teal-600 text-white hover:bg-teal-700"
                      : "bg-white text-gray-700"
                  }`}
                >
                  <span>{option.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                      isActive ? "bg-white/20" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {option.count}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 활성 입찰 */}
      {activeBids.length > 0 && (
        <div>
          <h2 className="text-xl mb-4">활성 입찰</h2>
          <div className="grid gap-4">
            {activeBids.map((bid) => (
              <MyBidCard
                key={bid.id}
                bid={bid}
                variant="active"
                getStatusColor={getStatusColor}
                onCopyContact={handleCopyContact}
              />
            ))}
          </div>
        </div>
      )}

      {hasNoBids && (
        <AsyncStateCard
          action={
            <Button asChild>
              <Link to="/expert/jobs">공고 찾아보기</Link>
            </Button>
          }
          message="입찰 내역이 없습니다."
        />
      )}

      {hasNoFilteredResults && (
        <AsyncStateCard
          action={
            <Button type="button" variant="outline" onClick={resetFilters}>
              필터 초기화
            </Button>
          }
          message="검색 조건에 맞는 입찰 내역이 없습니다."
        />
      )}

      {/* 이전 입찰 */}
      {pastBids.length > 0 && (
        <div>
          <h2 className="text-xl mb-4">이전 입찰</h2>
          <div className="grid gap-4">
            {pastBids.map((bid) => (
              <MyBidCard
                key={bid.id}
                bid={bid}
                variant="past"
                getStatusColor={getStatusColor}
                onCopyContact={handleCopyContact}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
