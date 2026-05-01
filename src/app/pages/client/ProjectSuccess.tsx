import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle2, Copy, Home } from "lucide-react";
import { toast } from "sonner";

export function ProjectSuccess() {
  const navigate = useNavigate();
  const { projectCode } = useParams<{ projectCode: string }>();
  const [copied, setCopied] = useState(false);

  // 프로젝트 코드가 없으면 랜덤으로 생성 (실제로는 서버에서 받아와야 함)
  const code = projectCode || `REQ-${Date.now().toString(36).toUpperCase()}`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("의뢰 코드가 복사되었습니다!");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("복사에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="max-w-2xl w-full">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <CardTitle className="text-3xl">의뢰가 성공적으로 등록되었습니다!</CardTitle>
            <CardDescription className="text-base mt-2">
              전문가들이 곧 입찰을 시작할 예정입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 의뢰 코드 */}
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <p className="text-sm text-gray-600 mb-2">의뢰 코드</p>
              <div className="flex items-center justify-center gap-3">
                <code className="text-2xl font-mono font-bold text-blue-600 tracking-wider">
                  {code}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  className="h-10 w-10"
                >
                  <Copy className={`h-5 w-5 ${copied ? 'text-green-600' : ''}`} />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                이 코드로 의뢰 진행 상황을 확인하실 수 있습니다.
              </p>
            </div>

            {/* 안내 메시지 */}
            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">다음 단계 안내</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>전문가들이 입찰을 시작하면 이메일로 알림을 받으실 수 있습니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>의뢰 코드를 보관하시면 언제든지 진행 상황을 확인하실 수 있습니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>입찰이 시작되면 최저가 순으로 3~5명의 전문가를 확인하실 수 있습니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>전문가를 선택하신 후 직접 협상을 통해 최종 가격을 결정하세요.</span>
                </li>
              </ul>
            </div>

            {/* 회원가입 권유 */}
            <div className="bg-purple-50 rounded-lg p-4 text-left border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">💡 회원가입 하시겠어요?</h3>
              <p className="text-sm text-purple-800 mb-3">
                회원가입 시 의뢰 관리, 전문가와의 소통, 알림 등의 기능을 이용하실 수 있습니다.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-purple-300 hover:bg-purple-100"
                onClick={() => navigate("/register")}
              >
                회원가입 하러 가기
              </Button>
            </div>

            {/* 메인으로 버튼 */}
            <div className="pt-4">
              <Button
                onClick={() => navigate("/")}
                size="lg"
                className="w-full"
              >
                <Home className="mr-2 h-5 w-5" />
                메인으로
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}