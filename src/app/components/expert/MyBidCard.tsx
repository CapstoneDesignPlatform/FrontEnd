import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Copy,
  DollarSign,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { MyBidItemVM } from "../../../types/expert";

interface MyBidCardProps {
  bid: MyBidItemVM;
  variant: "active" | "past";
  getStatusColor: (status: string) => string;
  onCopyContact: (contact: string) => void;
}

export function MyBidCard({ bid, variant, getStatusColor, onCopyContact }: MyBidCardProps) {
  const [isContactDetailsOpen, setIsContactDetailsOpen] = useState(false);
  const selectedContactItems = bid.clientContact
    ? [
        { label: "담당자", value: bid.clientContact.name, icon: UserRound },
        { label: "전화", value: bid.clientContact.phone, icon: Phone },
        { label: "이메일", value: bid.clientContact.email, icon: Mail },
      ].filter((item) => item.value)
    : [];
  const contactDetailsId = `selected-contact-details-${bid.id}`;

  if (variant === "past") {
    return (
      <Card className="opacity-75">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getStatusColor(bid.status)}>{bid.status}</Badge>
                <span className="text-sm text-gray-500">
                  입찰일: {bid.bidDate}
                </span>
              </div>
              <CardTitle className="text-xl">{bid.projectTitle}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>입찰가: {bid.myBid}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(bid.status)}>{bid.status}</Badge>
              <span className="text-sm text-gray-500">
                입찰일: {bid.bidDate}
              </span>
            </div>
            <CardTitle className="text-xl mb-2">{bid.projectTitle}</CardTitle>
            <CardDescription>
              현재 {bid.totalBids}개의 입찰이 제출되었습니다.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-gray-600" />
            <div>
              <p className="text-gray-600">내 입찰가</p>
              <p className="font-medium">{bid.myBid}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-600" />
            <div>
              <p className="text-gray-600">입찰일</p>
              <p className="font-medium">{bid.bidDate}</p>
            </div>
          </div>
        </div>

        {bid.status === "선정됨" && bid.clientContact && (
          <div className="mb-4 overflow-hidden rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-emerald-50">
            <div className="flex flex-wrap items-center gap-3 p-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">
                    의뢰인 선정 완료
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-600">
                    후속 협의가 필요한 입찰입니다.
                  </p>
                </div>
              </div>

              <div className="ml-auto flex shrink-0 items-center gap-1.5">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onCopyContact(bid.clientContact!.copyText)}
                  className="h-9 bg-slate-950 px-3 text-xs text-white hover:bg-slate-800"
                >
                  <Copy className="h-4 w-4" />
                  연락처 복사
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-controls={contactDetailsId}
                  aria-expanded={isContactDetailsOpen}
                  onClick={() => setIsContactDetailsOpen((isOpen) => !isOpen)}
                  className="h-9 w-9 rounded-full bg-white/80"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isContactDetailsOpen ? "rotate-180" : ""
                    }`}
                  />
                  <span className="sr-only">의뢰인 연락처 상세 보기</span>
                </Button>
              </div>
            </div>

            {isContactDetailsOpen ? (
              <div
                id={contactDetailsId}
                className="grid gap-2 border-t border-teal-100 bg-white/60 p-3 md:grid-cols-3"
              >
                {selectedContactItems.length > 0 ? (
                  selectedContactItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-teal-700" />
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-500">
                            {item.label}
                          </p>
                          <p className="truncate font-medium text-slate-900">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900 md:col-span-3">
                    {bid.clientContact.displayText}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/expert/jobs/${bid.projectId}`}>의뢰 보기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
