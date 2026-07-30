import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Separator } from "../components/ui/separator";
import { CreditCard, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function Payment() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  // 데모 데이터
  const paymentInfo = {
    projectTitle: "식품 제조업 영업 면허 취득",
    expertName: "김전문",
    expertCompany: "케이법무법인",
    agreedPrice: "₩2,800,000",
    platformFee: "₩140,000",
    totalPrice: "₩2,940,000",
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      toast.success("결제가 완료되었습니다!");
      setTimeout(() => {
        navigate("/client/dashboard");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">결제</h1>
          <p className="text-gray-600">
            전문가와 협상이 완료되었습니다. 결제를 진행해주세요.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 결제 정보 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>결제 정보</CardTitle>
                <CardDescription>결제 방법을 선택하고 정보를 입력해주세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  {/* 결제 방법 선택 */}
                  <div className="space-y-3">
                    <Label>결제 방법</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                          <span>신용/체크카드</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value="transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex-1 cursor-pointer flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-gray-600" />
                          <span>계좌이체</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* 카드 정보 */}
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">카드 번호</Label>
                        <Input
                          id="cardNumber"
                          placeholder="0000-0000-0000-0000"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">유효기간</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="000"
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardHolder">카드 소유자명</Label>
                        <Input
                          id="cardHolder"
                          placeholder="홍길동"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* 계좌이체 정보 */}
                  {paymentMethod === "transfer" && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-3">입금 계좌 정보</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">은행:</span>
                            <span className="font-medium">국민은행</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">계좌번호:</span>
                            <span className="font-medium">123-456-789012</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">예금주:</span>
                            <span className="font-medium">전문가매칭플랫폼(주)</span>
                          </div>
                        </div>
                        <p className="text-xs text-blue-800 mt-4">
                          입금 후 자동으로 확인되며, 확인까지 1-2시간 소요될 수 있습니다.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* 약관 동의 */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="agree"
                        className="mt-1"
                        required
                      />
                      <Label htmlFor="agree" className="text-sm cursor-pointer">
                        결제 진행에 동의하며, 플랫폼 이용약관 및 환불 정책을 확인했습니다.
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "처리 중..." : `₩2,940,000 결제하기`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 주문 요약 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>주문 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">의뢰</p>
                  <p className="font-medium">{paymentInfo.projectTitle}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-600 mb-1">선택된 전문가</p>
                  <p className="font-medium">{paymentInfo.expertName}</p>
                  <p className="text-sm text-gray-600">{paymentInfo.expertCompany}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">서비스 금액</span>
                    <span>{paymentInfo.agreedPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">플랫폼 수수료 (5%)</span>
                    <span>{paymentInfo.platformFee}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">총 결제 금액</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {paymentInfo.totalPrice}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 bg-gray-50">
              <CardContent className="pt-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  안전한 결제
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• 에스크로 결제 시스템</li>
                  <li>• 의뢰 완료 후 전문가에게 지급</li>
                  <li>• 안전한 암호화 통신</li>
                </ul>
              </CardContent>
            </Card>

            <div className="mt-4 text-center">
              <Button asChild variant="ghost" size="sm">
                <Link to={`/client/projects/${projectId}`}>취소하고 돌아가기</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}