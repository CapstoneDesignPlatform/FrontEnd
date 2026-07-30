import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Copy, Mail, Phone, Search, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { getMyBids } from "../../../api/expert";
import type { MyBidItemVM } from "../../../types/expert";
import { useAsyncData } from "../../hooks/useAsyncData";
import { Badge } from "../../components/ui/badge";

const emptyBids: MyBidItemVM[] = [];
type BidStatusFilter = "all" | MyBidItemVM["status"];

export function MyBids() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BidStatusFilter>("all");
  const { data, error, isLoading } = useAsyncData(getMyBids, {
    initialData: emptyBids,
  });
  const bids = data ?? [];

  const getStatusColor = (status: MyBidItemVM["status"]) => {
    switch (status) {
      case "선정됨":
        return "border-green-200 bg-green-50 text-green-700";
      case "대기 중":
        return "border-amber-200 bg-amber-50 text-amber-700";
      case "거절됨":
        return "border-slate-200 bg-slate-50 text-slate-500";
      default:
        return "border-blue-200 bg-blue-50 text-blue-700";
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
          <Link to="/expert/jobs">새 의뢰 찾기</Link>
        </Button>
      </div>

      {isLoading ? (
        <AsyncStateCard message="입찰 내역을 불러오는 중입니다." />
      ) : null}

      {error ? (
        <AsyncStateCard message="입찰 내역을 불러오지 못했습니다." tone="danger" />
      ) : null}

      <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:grid-cols-3">
        <SummaryMetric label="대기 중인 입찰" value={pendingBidCount} helper="대기 중" />
        <SummaryMetric label="선정된 의뢰" value={selectedBidCount} helper="진행 중" />
        <SummaryMetric label="입찰 성공률" value={`${winRate}%`} helper="전체 대비" />
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
                placeholder="의뢰명, 입찰가, 상태로 검색"
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
                      ? "bg-blue-600 text-white hover:bg-blue-700"
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

      {filteredBids.length > 0 && (
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="border-b bg-white px-4 py-3">
            <CardTitle className="text-base">입찰 목록</CardTitle>
            <p className="text-sm text-slate-500">
              현재 입찰 중인 의뢰 목록입니다.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <MyBidTable
              bids={filteredBids}
              getStatusColor={getStatusColor}
              onCopyContact={handleCopyContact}
            />
          </CardContent>
        </Card>
      )}

      {hasNoBids && (
        <AsyncStateCard
          action={
            <Button asChild>
              <Link to="/expert/jobs">의뢰 찾아보기</Link>
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
    </div>
  );
}

function SummaryMetric({
  helper,
  label,
  value,
}: {
  helper: string;
  label: string;
  value: number | string;
}) {
  return (
    <div className="flex min-h-16 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="mt-1 text-xl font-semibold leading-none text-slate-950">
          {value}
        </p>
      </div>
      <span className="rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-500">
        {helper}
      </span>
    </div>
  );
}

interface MyBidTableProps {
  bids: MyBidItemVM[];
  getStatusColor: (status: MyBidItemVM["status"]) => string;
  onCopyContact: (contact: string) => void;
}

function MyBidTable({ bids, getStatusColor, onCopyContact }: MyBidTableProps) {
  const [expandedContactBidId, setExpandedContactBidId] = useState<
    number | null
  >(null);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-sm">
        <thead className="bg-slate-50 text-xs font-medium text-slate-500">
          <tr>
            <th className="w-[300px] border-b px-4 py-3 text-left">의뢰명</th>
            <th className="w-[96px] border-b px-4 py-3 text-center">상태</th>
            <th className="w-[130px] border-b px-4 py-3 text-left">내 입찰가</th>
            <th className="w-[120px] border-b px-4 py-3 text-center">입찰일</th>
            <th className="w-[90px] border-b px-4 py-3 text-center">경쟁</th>
            <th className="w-[140px] border-b px-4 py-3 text-center">의뢰인 정보</th>
            <th className="w-[120px] border-b px-4 py-3 text-center">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {bids.map((bid) => {
            const canViewContact = bid.status === "선정됨" && bid.clientContact;
            const canEditBid = false;
            const isContactOpen = expandedContactBidId === bid.id;

            return (
              <Fragment key={bid.id}>
                <tr className="hover:bg-slate-50">
                  <td className="max-w-[300px] px-4 py-3">
                    <p className="truncate font-medium text-slate-950">
                      {bid.projectTitle}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className={getStatusColor(bid.status)}>
                      {bid.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-950">
                    {bid.myBid}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">
                    {formatShortDate(bid.bidDate)}
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">
                    {bid.totalBids}명
                  </td>
                  <td className="px-4 py-3 text-center">
                    {canViewContact ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        aria-expanded={isContactOpen}
                        onClick={() =>
                          setExpandedContactBidId((currentId) =>
                            currentId === bid.id ? null : bid.id,
                          )
                        }
                      >
                        의뢰인 정보
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform ${
                            isContactOpen ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {canEditBid ? (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                      >
                        <Link
                          to={`/expert/jobs/${encodeURIComponent(
                            bid.announcementCode ?? String(bid.projectId),
                          )}/bid`}
                        >
                          입찰 수정
                        </Link>
                      </Button>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
                {canViewContact && isContactOpen ? (
                  <tr className="bg-blue-50/40">
                    <td colSpan={7} className="px-4 py-3">
                      <ClientContactPanel
                        bid={bid}
                        onCopyContact={onCopyContact}
                      />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ClientContactPanel({
  bid,
  onCopyContact,
}: {
  bid: MyBidItemVM;
  onCopyContact: (contact: string) => void;
}) {
  if (!bid.clientContact) return null;

  const contactItems = [
    { icon: UserRound, label: "담당자", value: bid.clientContact.name },
    { icon: Phone, label: "전화", value: bid.clientContact.phone },
    { icon: Mail, label: "이메일", value: bid.clientContact.email },
  ].filter((item) => item.value);

  return (
    <div className="rounded-lg border border-blue-100 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="grid flex-1 gap-2 md:grid-cols-3">
          {contactItems.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex min-w-0 items-center gap-2">
              <Icon className="h-4 w-4 shrink-0 text-blue-700" />
              <div className="min-w-0">
                <p className="text-[11px] text-slate-500">{label}</p>
                <p className="truncate text-sm font-medium text-slate-950">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          className="h-8 bg-slate-950 px-3 text-xs text-white hover:bg-slate-800"
          onClick={() => onCopyContact(bid.clientContact!.copyText)}
        >
          <Copy className="h-3.5 w-3.5" />
          연락처 복사
        </Button>
      </div>
    </div>
  );
}

function formatShortDate(date: string) {
  return date.length >= 10 ? date.slice(5, 10) : date;
}
