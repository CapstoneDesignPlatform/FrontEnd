import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { MyBidCard } from "../../components/expert/MyBidCard";
import { getMyBids } from "../../../api/expert";
import type { MyBidItemVM } from "../../../types/expert";

export function MyBids() {
  const [bids, setBids] = useState<MyBidItemVM[]>([]);

  useEffect(() => {
    void getMyBids().then(setBids);
  }, []);

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

  const activeBids = bids.filter((bid) => bid.status === "대기 중" || bid.status === "선정됨");
  const pastBids = bids.filter((bid) => bid.status === "거절됨");
  const winRate = bids.length > 0
    ? Math.round((bids.filter((b) => b.status === "선정됨").length / bids.length) * 100)
    : 0;

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

      {/* 통계 */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">활성 입찰</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {bids.filter((b) => b.status === "대기 중").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">대기 중</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">선정된 의뢰</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {bids.filter((b) => b.status === "선정됨").length}
            </div>
            <p className="text-xs text-gray-600 mt-1">진행 중</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">입찰 성공률</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {winRate}
              %
            </div>
            <p className="text-xs text-gray-600 mt-1">전체 입찰 대비</p>
          </CardContent>
        </Card>
      </div>

      {/* 활성 입찰 */}
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

          {activeBids.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 mb-4">활성 입찰이 없습니다.</p>
                <Button asChild>
                  <Link to="/expert/jobs">공고 찾아보기</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
