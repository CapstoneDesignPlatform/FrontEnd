import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { grantDemoExpertApproval } from "../demoAccess";

type OutletContext = {
  setUser: (user: { type: "client" | "expert"; name: string }) => void;
};

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useOutletContext<OutletContext>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"client" | "expert">("client");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 데모용 로그인 처리 - 이메일로 자동 구분
    if (email && password) {
      setUser({ type: userType, name: email.split("@")[0] });
      grantDemoExpertApproval();
      toast.success("로그인 성공! 시연용 전문가 승인 권한이 적용되었습니다.");

      if (userType === "client") {
        navigate("/client/mypage");
      } else {
        navigate("/expert/dashboard");
      }
    } else {
      toast.error("이메일과 비밀번호를 입력해주세요.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>계정에 로그인하여 서비스를 이용하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {<Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/check-request")}
            >
              의뢰코드로 조회하기
            </Button>}

            <div className="space-y-2">
              <Label>사용자 유형</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={userType === "client" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setUserType("client")}
                >
                  의뢰인
                </Button>
                <Button
                  type="button"
                  variant={userType === "expert" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setUserType("expert")}
                >
                  전문가
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              로그인
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">계정이 없으신가요? </span>
              <Link to="/register" className="text-teal-600 hover:underline">
                회원가입
              </Link>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">또는</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                style={{ backgroundColor: '#FEE500', borderColor: '#FEE500', color: '#000000' }}
                onClick={() => {
                  toast.info("카카오 로그인은 준비 중입니다.");
                }}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
                </svg>
                카카오로 시작하기
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                style={{ backgroundColor: '#03C75A', borderColor: '#03C75A', color: '#FFFFFF' }}
                onClick={() => {
                  toast.info("네이버 로그인은 준비 중입니다.");
                }}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                </svg>
                네이버로 시작하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
