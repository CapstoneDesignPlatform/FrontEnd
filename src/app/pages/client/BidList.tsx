import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Star, Phone, Mail, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function BidList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedBid, setSelectedBid] = useState<number | null>(null);

  // 데모 데이터
  const project = {
    id: 1,
    title: "식품 제조업 영업 면허 취득",
    budget: "₩3,000,000",
  };

  const bids = [
    {
      id: 1,
      expertName: "김전문",
      company: "케이법무법인",
      phone: "010-1234-5678",
      email: "expert1@example.com",
      price: "₩2,500,000",
      estimatedDays: 30,
      rating: 4.8,
      reviews: 24,
      message:
        "식품 관련 면허 취득 경력 10년 이상입니다. 신속하고 정확하게 처리해드리겠습니다.",
      verified: true,
    },
    {
      id: 2,
      expertName: "이컨설턴트",
      company: "프로컨설팅",
      phone: "010-2345-6789",
      email: "expert2@example.com",
      price: "₩2,700,000",
      estimatedDays: 25,
      rating: 4.9,
      reviews: 31,
      message: "최단 기간 내 면허 취득을 보장합니다. 성공률 100%입니다.",
      verified: true,
    },
    {
      id: 3,
      expertName: "박행정사",
      company: "믿음행정사사무소",
      phone: "010-3456-7890",
      email: "expert3@example.com",
      price: "₩2,800,000",
      estimatedDays: 35,
      rating: 4.7,
      reviews: 18,
      message: "합리적인 가격으로 최상의 서비스를 제공합니다.",
      verified: true,
    },
    {
      id: 4,
      expertName: "최법무사",
      company: "성공법무사사무소",
      phone: "010-4567-8901",
      email: "expert4@example.com",
      price: "₩2,900,000",
      estimatedDays: 28,
      rating: 4.6,
      reviews: 15,
      message: "정확한 서류 작성과 신속한 처리가 강점입니다.",
      verified: false,
    },
    {
      id: 5,
      expertName: "정컨설팅",
      company: "글로벌컨설팅그룹",
      phone: "010-5678-9012",
      email: "expert5@example.com",
      price: "₩3,200,000",
      estimatedDays: 20,
      rating: 4.9,
      reviews: 42,
      message: "프리미엄 서비스로 완벽한 결과를 보장합니다.",
      verified: true,
    },
  ];

  // 최저가 기준 정렬
  const sortedBids = [...bids].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[^0-9]/g, ""));
    const priceB = parseInt(b.price.replace(/[^0-9]/g, ""));
    return priceA - priceB;
  });

  // 최저가 3-5명만 표시
  const displayBids = sortedBids.slice(0, 5);

  const handleSelectExpert = (bidId: number) => {
    setSelectedBid(bidId);
  };

  const handleProceedToPayment = () => {
    if (!selectedBid) {
      toast.error("전문가를 선택해주세요.");
      return;
    }
    toast.success("전문가가 선택되었습니다. 협상을 진행해주세요.");
    // 실제로는 협상 단계로 이동하지만, 여기서는 결제 페이지로 이동
    setTimeout(() => {
      navigate(`/payment/${id}`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl">{project.title}</h1>
          <Button asChild variant="outline">
            <Link to={`/client/projects/${id}`}>의뢰 상세</Link>
          </Button>
        </div>
        <p className="text-gray-600">
          총 {displayBids.length}명의 전문가가 입찰했습니다. (최저가 순)
        </p>
      </div>

      {/* 안내 메시지 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                💡
              </div>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-1">전문가 선택 안내</h3>
              <p className="text-sm text-blue-800">
                최저가 기준 3-5명의 전문가가 표시됩니다. 전문가를 선택한 후 직접 연락하여
                최종 가격을 협상하세요.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 입찰 목록 */}
      <div className="grid gap-4">
        {displayBids.map((bid, index) => (
          <Card
            key={bid.id}
            className={`transition-all ${
              selectedBid === bid.id
                ? "border-blue-500 border-2 shadow-lg"
                : "hover:shadow-md"
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                      {bid.expertName[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-xl">{bid.expertName}</CardTitle>
                      {bid.verified && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          인증됨
                        </Badge>
                      )}
                      {index === 0 && (
                        <Badge className="bg-yellow-100 text-yellow-700">최저가</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        <span>{bid.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          {bid.rating} ({bid.reviews}개 리뷰)
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{bid.message}</p>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{bid.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{bid.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 mb-1">{bid.price}</p>
                  <p className="text-sm text-gray-600">예상 기간: {bid.estimatedDays}일</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={selectedBid === bid.id ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleSelectExpert(bid.id)}
                >
                  {selectedBid === bid.id ? "선택됨" : "전문가 선택"}
                </Button>
                <Button variant="ghost" asChild>
                  <a href={`tel:${bid.phone}`}>전화하기</a>
                </Button>
                <Button variant="ghost" asChild>
                  <a href={`mailto:${bid.email}`}>이메일</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 선택 완료 버튼 */}
      {selectedBid && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-900 mb-1">
                  전문가가 선택되었습니다
                </h3>
                <p className="text-sm text-green-800">
                  연락처를 통해 전문가와 협상을 진행한 후 결제를 진행하세요.
                </p>
              </div>
              <Button size="lg" onClick={handleProceedToPayment}>
                협상 완료 및 결제하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}