import { Fragment, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  CircleAlert,
  ClipboardList,
  Clock,
  ChevronDown,
  Mail,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import type { ExpertVerificationStatus } from "../../../types/expertVerification";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { getExpertProfile, getMyBids } from "../../../api/expert";
import type { ExpertProfileFormVM, MyBidItemVM } from "../../../types/expert";
import { useAsyncData } from "../../hooks/useAsyncData";
import { cn } from "../../components/ui/utils";

type ExpertDashboardData = {
  bids: MyBidItemVM[];
  bidsError: boolean;
  profile: ExpertProfileFormVM;
};

export function ExpertDashboard() {
  const [expandedContactBidId, setExpandedContactBidId] = useState<
    number | null
  >(null);
  const loadDashboardData = useCallback(
    async () => {
      const profile = await getExpertProfile();
      let bidsError = false;
      let bids: MyBidItemVM[] = [];

      try {
        bids = await getMyBids();
      } catch {
        bidsError = true;
      }

      return {
        bids,
        bidsError,
        profile,
      };
    },
    [],
  );
  const { data, error, isLoading } = useAsyncData<ExpertDashboardData>(
    loadDashboardData,
  );
  const profile = data?.profile ?? null;
  const bids = data?.bids ?? [];
  const bidsError = data?.bidsError ?? false;
  const selectedBids = useMemo(() => {
    const visibleBids = bids.filter((bid) => bid.status === "선정됨");

    return sortSelectedBids(visibleBids);
  }, [bids]);

  if (error) {
    return (
      <div className="space-y-6">
        <AsyncStateCard
          message="전문가 마이페이지 정보를 불러오지 못했습니다."
          tone="danger"
        />
      </div>
    );
  }

  if (isLoading && !profile) {
    return (
      <div className="space-y-6">
        <AsyncStateCard message="전문가 마이페이지 정보를 불러오는 중입니다." />
      </div>
    );
  }

  if (!profile) return null;

  const verification = getVerificationMeta(profile.verificationStatus);
  const VerificationIcon = verification.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
              전문가 마이페이지
            </h1>
            <Badge
              variant="outline"
              className={cn("border px-2.5 py-1 text-xs", verification.badgeClassName)}
            >
              <VerificationIcon className="h-3.5 w-3.5" />
              {verification.label}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-600">
            {profile.companyName || "소속 미등록"} · {profile.name} ·{" "}
            {profile.email}
          </p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="grid gap-3 p-4 md:grid-cols-3">
          <DashboardAction
            description="조건에 맞는 새 의뢰를 확인합니다."
            href="/expert/jobs"
            icon={Search}
            label="입찰 가능한 의뢰보기"
          />
          <DashboardAction
            description="제출한 입찰과 선정 여부를 관리합니다."
            href="/expert/bids"
            icon={ClipboardList}
            label="내 입찰"
          />
          <DashboardAction
            description="자격, 연락처, 소개 정보를 확인합니다."
            href="/expert/profile"
            icon={UserRound}
            label="프로필 상세"
          />
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-base">선정된 의뢰 목록</CardTitle>
              <CardDescription className="text-xs">
                선정된 의뢰의 핵심 정보와 의뢰인 정보를 확인하세요.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="h-7 w-fit px-2 text-xs">
              <Link to="/expert/bids">전체 입찰 관리</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {bidsError ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              입찰 내역을 잠시 불러오지 못했습니다. 프로필과 인증 상태는
              정상적으로 표시됩니다.
            </div>
          ) : null}

          {!bidsError && selectedBids.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
              <p className="font-medium text-slate-900">
                선정된 의뢰가 없습니다.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                선정 결과는 내 입찰 목록에서 함께 확인할 수 있습니다.
              </p>
              <Button asChild className="mt-4">
                <Link to="/expert/bids">내 입찰 목록 보기</Link>
              </Button>
            </div>
          ) : null}

          {!bidsError && selectedBids.length > 0 ? (
            <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
              {selectedBids.map((bid) => (
                <SelectedBidRow
                  key={bid.id}
                  bid={bid}
                  isContactOpen={expandedContactBidId === bid.id}
                  onToggleContact={() =>
                    setExpandedContactBidId((currentId) =>
                      currentId === bid.id ? null : bid.id,
                    )
                  }
                />
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function SelectedBidRow({
  bid,
  isContactOpen,
  onToggleContact,
}: {
  bid: MyBidItemVM;
  isContactOpen: boolean;
  onToggleContact: () => void;
}) {
  const canViewContact = Boolean(bid.clientContact);
  const detailPath = `/expert/jobs/${encodeURIComponent(
    bid.announcementCode ?? String(bid.projectId),
  )}`;

  return (
    <Fragment>
      <div className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={getBidStatusClassName(bid.status)}>
              {bid.status}
            </Badge>
            <span className="text-[11px] text-slate-500">
              {formatShortDate(bid.bidDate)} 제출 · 경쟁 {bid.totalBids}명
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-medium text-slate-950">
              {bid.projectTitle}
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
            >
              <Link to={detailPath}>상세</Link>
            </Button>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            <DeadlineSummary deadline={bid.deadline} />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4">
          <div className="w-fit rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-left">
            <p className="text-[10px] font-medium text-slate-500">제안 금액</p>
            <p className="text-sm font-semibold leading-tight text-slate-950">
              {bid.myBid}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={!canViewContact}
            aria-expanded={isContactOpen}
            onClick={onToggleContact}
          >
            의뢰인 정보
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                isContactOpen ? "rotate-180" : "",
              )}
            />
          </Button>
        </div>
      </div>
      {canViewContact && isContactOpen ? (
        <ClientContactPanel bid={bid} />
      ) : null}
    </Fragment>
  );
}

function ClientContactPanel({ bid }: { bid: MyBidItemVM }) {
  if (!bid.clientContact) return null;

  const contactItems = [
    { icon: UserRound, label: "담당자", value: bid.clientContact.name },
    { icon: Phone, label: "전화", value: bid.clientContact.phone },
    { icon: Mail, label: "이메일", value: bid.clientContact.email },
  ].filter((item) => item.value);

  return (
    <div className="border-t border-blue-100 bg-blue-50/40 px-4 py-3">
      <div className="grid gap-3 rounded-lg border border-blue-100 bg-white p-3 md:grid-cols-3">
        {contactItems.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex min-w-0 items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-blue-700" />
            <div className="min-w-0">
              <p className="text-[10px] text-slate-500">{label}</p>
              <p className="truncate text-xs font-medium text-slate-950">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardAction({
  description,
  href,
  icon: Icon,
  label,
}: {
  description: string;
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="h-auto w-full justify-start px-3 py-3 text-left"
    >
      <Link to={href}>
        <span className="rounded-md bg-slate-50 p-2 text-slate-600">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-slate-950">
            {label}
          </span>
          <span className="block truncate text-[11px] font-normal text-slate-500">
            {description}
          </span>
        </span>
      </Link>
    </Button>
  );
}

function DeadlineSummary({ deadline }: { deadline?: string }) {
  if (!deadline) {
    return <span className="text-slate-400">마감일 미정</span>;
  }

  const daysLeft = getDaysLeft(deadline);

  return (
    <span className="inline-flex items-center gap-1.5">
      <span>마감 {formatShortDate(deadline)}</span>
      {daysLeft !== null ? (
        <Badge
          variant="outline"
          className={cn(
            "px-1.5 py-0 text-[10px]",
            daysLeft < 0
              ? "border-slate-200 bg-slate-50 text-slate-500"
              : daysLeft <= 3
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-blue-200 bg-blue-50 text-blue-700",
          )}
        >
          {formatDaysLeft(daysLeft)}
        </Badge>
      ) : null}
    </span>
  );
}

function formatShortDate(date: string) {
  return date.length >= 10 ? date.slice(5, 10) : date;
}

function sortSelectedBids(bids: MyBidItemVM[]) {
  return [...bids].sort((a, b) => compareDateDesc(a.bidDate, b.bidDate));
}

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

function compareDateDesc(a?: string, b?: string) {
  return (parseDateToTime(b) ?? 0) - (parseDateToTime(a) ?? 0);
}

function parseDateToTime(value?: string) {
  if (!value) return null;

  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day).getTime();
}

function getDaysLeft(deadline: string) {
  const deadlineTime = parseDateToTime(deadline);

  if (deadlineTime === null) return null;

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();

  return Math.ceil((deadlineTime - todayStart) / MILLISECONDS_PER_DAY);
}

function formatDaysLeft(daysLeft: number) {
  if (daysLeft < 0) return "마감 지남";
  if (daysLeft === 0) return "D-Day";

  return `D-${daysLeft}`;
}

function getVerificationMeta(status: ExpertVerificationStatus): {
  actionHref: string;
  actionLabel: string;
  actionVariant: "default" | "outline";
  badgeClassName: string;
  icon: LucideIcon;
  label: string;
} {
  if (status === "APPROVED") {
    return {
      actionHref: "/expert/jobs",
      actionLabel: "입찰 가능한 의뢰 보기",
      actionVariant: "default",
      badgeClassName: "border-blue-200 bg-blue-50 text-blue-700",
      icon: ShieldCheck,
      label: "인증 완료",
    };
  }

  if (status === "PENDING") {
    return {
      actionHref: "/expert/verification/status",
      actionLabel: "인증 진행 상태 보기",
      actionVariant: "outline",
      badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
      icon: Clock,
      label: "검토 중",
    };
  }

  if (status === "REJECTED") {
    return {
      actionHref: "/expert/verification/apply",
      actionLabel: "인증 정보 보완하기",
      actionVariant: "default",
      badgeClassName: "border-red-200 bg-red-50 text-red-700",
      icon: CircleAlert,
      label: "보완 필요",
    };
  }

  return {
    actionHref: "/expert/verification/apply",
    actionLabel: "전문가 인증 신청",
    actionVariant: "default",
    badgeClassName: "border-red-200 bg-red-50 text-red-700",
    icon: ShieldAlert,
    label: "인증 필요",
  };
}

function getBidStatusClassName(status: MyBidItemVM["status"]) {
  if (status === "선정됨") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "거절됨") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}
