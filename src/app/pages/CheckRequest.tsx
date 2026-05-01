import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Key, LogIn, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function CheckRequest() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<"code" | "login" | null>(null);
  const [requestCode, setRequestCode] = useState("");

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestCode.trim()) {
      toast.error("의뢰 코드를 입력해주세요.");
      return;
    }

    // 데모용: 의뢰 코드 확인 후 비회원 의뢰 조회 페이지로 이동
    // 실제로는 API 호출하여 코드 검증 후 해당 의뢰 정보 조회
    toast.success("의뢰 정보를 불러옵니다.");
    navigate(`/client/guest-request-view/${requestCode}`, { state: { requestCode } });
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">의뢰 확인하기</h1>
          <p className="text-gray-600">
            의뢰 코드로 조회하거나 로그인하여 확인하실 수 있습니다.
          </p>
        </div>

        {!selectedMethod ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* 비회원 코드 조회 */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              onClick={() => setSelectedMethod("code")}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Key className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">비회원 코드로 조회</CardTitle>
                <CardDescription className="text-base">
                  의뢰 등록 시 받은 코드로 확인할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>회원가입 없이 빠른 조회</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>의뢰 코드만 있으면 OK</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>실시간 진행 상황 확인</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 회원 로그인 */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-500"
              onClick={() => setSelectedMethod("login")}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <LogIn className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">회원 로그인</CardTitle>
                <CardDescription className="text-base">
                  회원으로 로그인하여 모든 의뢰를 관리할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>모든 의뢰 내역 한눈에 확인</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>기업 정보 관리</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>추가 혜택 및 알림 서비스</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedMethod === "code" ? (
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>의뢰 코드 입력</CardTitle>
              <CardDescription>
                의뢰 등록 완료 시 받으신 코드를 입력해주세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requestCode">의뢰 코드</Label>
                  <Input
                    id="requestCode"
                    placeholder="예) REQ-20260406-ABCD"
                    value={requestCode}
                    onChange={(e) => setRequestCode(e.target.value)}
                    className="text-lg"
                    autoFocus
                  />
                  <p className="text-sm text-gray-500">
                    의뢰 등록 완료 화면에서 확인하신 코드를 입력하세요.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2 text-sm">
                    💡 의뢰 코드를 찾을 수 없나요?
                  </h4>
                  <p className="text-sm text-blue-800">
                    의뢰 등록 시 입력하신 이메일로 발송된 코드를 확인하거나, 
                    고객센터(1234-5678)로 문의해주세요.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedMethod(null)}
                  >
                    이전
                  </Button>
                  <Button type="submit" className="flex-1">
                    조회하기
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>회원 로그인</CardTitle>
              <CardDescription>
                로그인 페이지로 이동합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  회원으로 로그인하시면 모든 의뢰 내역을 한 번에 관리하고, 
                  추가 혜택을 받으실 수 있습니다.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedMethod(null)}
                >
                  이전
                </Button>
                <Button className="flex-1" onClick={handleLoginClick}>
                  로그인하기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}