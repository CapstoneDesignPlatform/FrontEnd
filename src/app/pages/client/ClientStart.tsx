import { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import type { RootOutletContext } from "../../types/rootContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { UserCircle, FileText } from "lucide-react";

const requestNext = "/client/company-info";
const loginPath = `/login?next=${encodeURIComponent(requestNext)}`;
const registerPath = `/register?type=client&next=${encodeURIComponent(requestNext)}`;

export function ClientStart() {
  const [showGuestGuide, setShowGuestGuide] = useState(false);
  const { user } = useOutletContext<RootOutletContext>();
  const isLoggedIn = user?.type === "client";

  return (
    <div className="desktop-client-start container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">기업진단 의뢰하기</h1>
          <p className="text-gray-600">회원가입 후 의뢰하거나, 비회원 의뢰 방법을 확인해 주세요.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="client-member flex flex-col border-blue-100">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-blue-600" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl">{isLoggedIn ? "회원으로 의뢰" : "회원가입 후 의뢰"}</CardTitle>
              <CardDescription>계정으로 의뢰 내역과 진행 상황을 관리하세요.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <ul className="space-y-2 text-sm text-gray-600">
                <li>등록한 의뢰와 기업 정보 관리</li>
                <li>전문가 제안 및 진행 상황 확인</li>
              </ul>
              <div className="space-y-3 mt-auto pt-4">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to={isLoggedIn ? requestNext : registerPath}>
                    {isLoggedIn ? "회원으로 의뢰하기" : "회원가입하고 의뢰하기"}
                  </Link>
                </Button>
                {!isLoggedIn && (
                  <p className="text-center text-sm text-gray-600">
                    이미 계정이 있으신가요?{" "}
                    <Link to={loginPath} className="text-blue-600 hover:underline font-medium">로그인</Link>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="client-guest flex flex-col border-blue-100">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-blue-600" aria-hidden="true" />
              </div>
              <CardTitle className="text-xl">비회원으로 의뢰</CardTitle>
              <CardDescription>회원가입 없이 휴대폰 인증으로 의뢰하는 방식입니다.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-6">
              <p className="text-sm text-gray-600">현재 비회원 휴대폰 인증은 준비 중이며, 의뢰 접수는 회원 로그인 후 이용할 수 있습니다.</p>
              <div className="mt-auto pt-4 space-y-3">
                <Button type="button" variant="outline" className="w-full" onClick={() => setShowGuestGuide(true)} aria-expanded={showGuestGuide} aria-controls="guest-request-guide">
                  비회원 의뢰 안내
                </Button>
                {showGuestGuide && (
                  <div id="guest-request-guide" role="status" className="rounded-lg border p-4 text-sm text-gray-600 space-y-3">
                    <p>비회원 의뢰는 아직 이용할 수 없습니다. 지금 의뢰하려면 {isLoggedIn ? "회원으로 의뢰하기를 선택해 주세요." : "회원가입 또는 로그인 후 진행해 주세요."}</p>
                    {!isLoggedIn && <Link to={loginPath} className="inline-block text-blue-600 font-medium hover:underline">로그인하고 의뢰하기</Link>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
