import { useState } from "react";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { persistAuthTokens } from "../../api/authTokens";
import { userInstance } from "../../api/instance"; 
import Cookies from "js-cookie";


type OutletContext = {
  setUser: (user: { type: "client" | "expert"; name: string }) => void;
};

const BASE_URL = window.location.origin; 
const SOCIAL_CONFIGS = {
  kakao: {
    url: `https://kauth.kakao.com/oauth/authorize?client_id=${
      import.meta.env.VITE_KAKAO_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      `${BASE_URL}/oauth/callback/kakao`
    )}&response_type=code`,
  },
  naver: {
    url: `https://nid.naver.com/oauth2.0/authorize?client_id=${
      import.meta.env.VITE_NAVER_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      `${BASE_URL}/oauth/callback/naver`
    )}&response_type=code&state=naverState`,
  },
  google: {
    url: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
      import.meta.env.VITE_GOOGLE_CLIENT_ID
    }&redirect_uri=${encodeURIComponent(
      `${BASE_URL}/oauth/callback/google`
    )}&response_type=code&scope=email%20profile`,
  },
};

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return null;
  }

  return nextPath;
}

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useOutletContext<OutletContext>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await userInstance.post("auth/login", {
        email,
        password,
      });

      const { success, data, message } = response.data;

      if (success) {
        persistAuthTokens(data);
        Cookies.set("ACCESS_TOKEN", data.accessToken, { expires: 1 });
        Cookies.set("REFRESH_TOKEN", data.refreshToken, { expires: 7 });
        Cookies.set("USER_ROLE", data.role, { expires: 1 });
        if (data.clientInfoId) {
          Cookies.set("CLIENT_INFO_ID", String(data.clientInfoId), { expires: 1 });
        }

        const userType = data.role.toLowerCase() as "client" | "expert";

        // 실제 이름 조회
        let userName = email.split("@")[0];
        try {
          const myInfoRes = await userInstance.get("/users/myInfo");
          if (myInfoRes.data?.success) {
            userName = myInfoRes.data.data.name;
          }
        } catch {
          // myInfo 실패 시 이메일 앞부분으로 폴백
        }

        setUser({
          type: userType,
          name: userName,
        });

        toast.success(message || "로그인에 성공했습니다.");

        navigate(
          getSafeNextPath(searchParams.get("next")) ??
            (userType === "client" ? "/client/mypage" : "/expert/dashboard"),
        );
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "로그인 중 오류가 발생했습니다.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: keyof typeof SOCIAL_CONFIGS) => {
    window.location.href = SOCIAL_CONFIGS[provider].url;
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
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-pointer"
              onClick={() => navigate("/check-request")}
            >
              의뢰코드로 조회하기
            </Button>

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

            <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">계정이 없으신가요? </span>
              <Link to="/register" className="text-blue-600 hover:underline">
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
                className="w-full cursor-pointer"
                style={{ backgroundColor: "#FEE500", borderColor: "#FEE500", color: "#000000" }}
                onClick={() => handleSocialLogin("kakao")}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                </svg>
                카카오로 시작하기
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                style={{ backgroundColor: "#03C75A", borderColor: "#03C75A", color: "#FFFFFF" }}
                onClick={() => handleSocialLogin("naver")}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
                </svg>
                네이버로 시작하기
              </Button>

              <Button
                type="button"
                className="w-full cursor-pointer"
                style={{ backgroundColor: "#F2F2F2", color: "#1f1f1f" }}
                onClick={() => handleSocialLogin("google")}
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google"
                  className="mr-2 h-5 w-5"
                />
                Google로 시작하기
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
