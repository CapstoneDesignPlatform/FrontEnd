import { Link } from "react-router-dom";
import { Calendar, Copy, DollarSign } from "lucide-react";
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
          <Card className="bg-green-50 border-green-200 mb-4">
            <CardContent className="pt-4">
              <p className="text-sm text-green-900 mb-2">
                🎉 축하합니다! 의뢰인이 회원님을 선택했습니다.
              </p>
              <p className="text-sm text-green-800">
                의뢰인 연락처:{" "}
                <span className="font-medium">{bid.clientContact.displayText}</span>
              </p>
              <p className="text-xs text-green-700 mt-1">
                연락하여 최종 가격을 협상해주세요.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/expert/jobs/${bid.projectId}`}>의뢰 보기</Link>
          </Button>
          {bid.status === "선정됨" && bid.clientContact && (
            <Button
              size="sm"
              onClick={() => onCopyContact(bid.clientContact!.copyText)}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              의뢰인 연락처 복사하기
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
