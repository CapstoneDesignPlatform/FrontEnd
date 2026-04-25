import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { UserCircle, FileText } from "lucide-react";

export function ClientStart() {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">의뢰인으로 시작하기</h1>
          <p className="text-gray-600">
            회원 가입 후 의뢰하시거나, 비회원으로 빠르게 의뢰를 등록하실 수 있습니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 회원으로 의뢰 등록 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-xl">회원으로 의뢰 등록</CardTitle>
              <CardDescription>
                회원 가입 후 다양한 혜택을 받으세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>의뢰 내역 관리 및 진행 상황 추적</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>전문가와의 원활한 소통</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>이전 의뢰 정보 재사용</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>입찰 알림 및 실시간 업데이트</span>
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <Button asChild className="w-full">
                  <Link to="/login">로그인</Link>
                </Button>
                <div className="text-center text-sm text-gray-600">
                  계정이 없으신가요?{" "}
                  <Link to="/register" className="text-blue-600 hover:underline">
                    회원가입
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 비회원으로 의뢰 등록 */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-green-600" />
              </div>
              <CardTitle className="text-xl">비회원으로 의뢰 등록</CardTitle>
              <CardDescription>
                간편하게 의뢰를 등록하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>회원가입 없이 빠른 의뢰 등록</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>기업 정보만 입력하면 시작</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>전문가의 입찰 확인 및 선택</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-gray-400 font-bold">•</span>
                  <span className="text-gray-400">의뢰 관리 기능은 제한됩니다</span>
                </p>
              </div>

              <div className="pt-4">
                <Button asChild className="w-full" variant="secondary">
                  <Link to="/client/company-info">
                    비회원으로 시작하기
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            비회원으로 등록한 의뢰도 나중에 회원 가입 후 관리할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}