import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle2, ClipboardList, Home } from "lucide-react";

import { getStoredAccessToken } from "../../../api/authTokens";

export function ProjectSuccess() {
  const navigate = useNavigate();
  const isLoggedIn = !!getStoredAccessToken();

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
              전문가들이 곧 제안을 시작할 예정입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isLoggedIn && <p className="rounded-lg border border-blue-100 bg-blue-50 p-6 text-sm text-gray-600">비회원 휴대폰 조회 기능은 준비 중입니다.</p>}

            <div className="bg-blue-50 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-blue-900 mb-2">다음 단계 안내</h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>전문가 제안과 진행 상황은 내 의뢰 확인하기에서 확인할 수 있습니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>회원은 로그인 후 내 의뢰 목록에서 진행 상황을 확인할 수 있습니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>전문가 제안이 등록되면 제안 내용과 진행 단계를 확인할 수 있습니다.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>전문가 후보와 제안 금액을 비교할 수 있으며, 선정 확정 기능은 준비 중입니다.</span>
                </li>
              </ul>
            </div>

            {!isLoggedIn && <div className="bg-purple-50 rounded-lg p-4 text-left border border-purple-200">
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
            </div>}

            <div className="grid gap-3 pt-4 sm:grid-cols-2">
              <Button variant="outline" size="lg" onClick={() => navigate("/")}>
                <Home className="mr-2 h-5 w-5" />
                메인으로
              </Button>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate(isLoggedIn ? "/client/projects" : "/check-request")}>
                <ClipboardList className="mr-2 h-5 w-5" />
                내 의뢰 확인하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
