import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useOutletContext } from "react-router-dom";
import { toast } from "sonner";

type OutletContext = {
  setUser: (user: { type: "client" | "expert"; name: string }) => void;
};

type SocialProvider = "kakao" | "naver" | "google";

/** 각 provider별 토큰 교환 엔드포인트 */
const TOKEN_ENDPOINTS: Record<SocialProvider, string> = {
  kakao: "https://kauth.kakao.com/oauth/token",
  naver: "https://nid.naver.com/oauth2.0/token",
  google: "https://oauth2.googleapis.com/token",
};

/** 각 provider별 사용자 정보 엔드포인트 */
const USERINFO_ENDPOINTS: Record<SocialProvider, string> = {
  kakao: "https://kapi.kakao.com/v2/user/me",
  naver: "https://openapi.naver.com/v1/nid/me",
  google: "https://www.googleapis.com/oauth2/v3/userinfo",
};

const CLIENT_IDS: Record<SocialProvider, string> = {
  kakao: import.meta.env.VITE_KAKAO_CLIENT_ID ?? "",
  naver: import.meta.env.VITE_NAVER_CLIENT_ID ?? "",
  google: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
};

/** 유저 정보를 provider별로 정규화 */
function normalizeUserInfo(
  provider: SocialProvider,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
): { name: string; email: string; socialId: string } {
  if (provider === "kakao") {
    return {
      name: data.kakao_account?.profile?.nickname ?? "",
      email: data.kakao_account?.email ?? "",
      socialId: String(data.id),
    };
  }
  if (provider === "naver") {
    return {
      name: data.response?.name ?? "",
      email: data.response?.email ?? "",
      socialId: data.response?.id ?? "",
    };
  }
  // google
  return {
    name: data.name ?? "",
    email: data.email ?? "",
    socialId: data.sub ?? "",
  };
}

export function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useOutletContext<OutletContext>();
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const run = async () => {
      // URL에서 provider, code, error 추출
      const pathSegments = window.location.pathname.split("/");
      const provider = pathSegments[pathSegments.length - 1] as SocialProvider;
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error || !code) {
        toast.error("소셜 로그인이 취소되었습니다.");
        navigate("/login");
        return;
      }

      try {
        const tokenBody = new URLSearchParams({
          grant_type: "authorization_code",
          client_id: CLIENT_IDS[provider],
          redirect_uri: import.meta.env.VITE_REDIRECT_URI,
          code,
        });

        const tokenRes = await fetch(TOKEN_ENDPOINTS[provider], {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: tokenBody.toString(),
        });

        if (!tokenRes.ok) {
          const errJson = await tokenRes.json().catch(() => ({}));
          console.error("[OAuth] 토큰 교환 실패:", errJson);
          throw new Error("토큰 교환에 실패했습니다.");
        }

        const tokenData = await tokenRes.json();
        const accessToken: string = tokenData.access_token;

        // ── 2단계: 토큰으로 사용자 정보 조회 ────────────────────────────
        const userinfoRes = await fetch(USERINFO_ENDPOINTS[provider], {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userinfoRes.ok) {
          throw new Error("사용자 정보 조회에 실패했습니다.");
        }

        const rawUserInfo = await userinfoRes.json();
        const userInfo = normalizeUserInfo(provider, rawUserInfo);

        const existingKey = `social_${provider}_${userInfo.socialId}`;
        const existing = localStorage.getItem(existingKey);

        if (existing) {
          // 기존 유저 → 바로 로그인
          const saved = JSON.parse(existing) as { type: "client" | "expert"; name: string };
          setUser(saved);
          toast.success("로그인 성공!");
          navigate(saved.type === "client" ? "/client/mypage" : "/expert/dashboard");
        } else {
          // 신규 유저 → 유형선택 → 약관동의 플로우로 이동
          // 소셜 정보를 sessionStorage에 임시 저장
          sessionStorage.setItem(
            "pendingSocialUser",
            JSON.stringify({ provider, accessToken, ...userInfo, storageKey: existingKey })
          );
          navigate("/register?social=true");
        }
      } catch (err) {
        console.error("[OAuth] 오류:", err);
        setStatus("error");
        toast.error(err instanceof Error ? err.message : "소셜 로그인 처리 중 오류가 발생했습니다.");
        navigate("/login");
      }
    };

    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "error") return null;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center space-y-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 text-sm">소셜 로그인 처리 중...</p>
      </div>
    </div>
  );
}