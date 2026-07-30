import { useState, useEffect } from "react";
import { Link, useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { CheckCircle2, User, FileText, X, Eye, EyeOff } from "lucide-react";
import { TERMS_DATA, TermType } from "../../data/terms";
import { toast } from "sonner";
import { persistAuthTokens } from "../../api/authTokens";
import { userInstance } from "../../api/instance";

// ─── 타입 정의 ────────────────────────────────────────────────────────────
type OutletContext = {
  setUser: (user: { type: "client" | "expert"; name: string }) => void;
};

type PendingSocialUser = {
  provider: string;
  name: string;
  email: string;
  socialId: string;
  storageKey: string;
};

// ─── 전문보기 모달 ────────────────────────────────────────────────────────
function TermsModal({ onClose, userType }: { onClose: () => void; userType: "client" | "expert" }) {
  const [activeTab, setActiveTab] = useState<TermType>("termsOfService");
  const currentTerms = TERMS_DATA[userType];
  const tabs: { key: TermType; label: string }[] = [
    { key: "termsOfService", label: "이용약관" },
    { key: "privacyPolicy", label: "개인정보 수집" },
    { key: "marketing", label: "마케팅 수신" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh] shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
                className={`text-sm font-medium pb-1 transition-colors ${activeTab === tab.key ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">{currentTerms[activeTab].title}</h3>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed font-sans">{currentTerms[activeTab].content}</pre>
        </div>
        <div className="border-t px-6 py-4 flex justify-end"><Button type="button" onClick={onClose}>닫기</Button></div>
      </div>
    </div>
  );
}

// ─── 약관 미리보기 박스 ───────────────────────────────────────────────────
function TermsPreviewBox({ content, onOpenModal }: { content: string; onOpenModal: () => void }) {
  return (
    <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
      <div className="h-28 overflow-y-auto px-4 py-3">
        <pre className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed font-sans">{content}</pre>
      </div>
      <div className="border-t border-gray-200 px-4 py-2 bg-white flex justify-end">
        <button type="button" onClick={onOpenModal} className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline">전문보기 →</button>
      </div>
    </div>
  );
}

const STEP_LABELS: Record<number, string> = {
  1: "회원 유형을 선택해주세요",
  2: "이용약관에 동의해주세요",
  3: "정보를 입력해주세요",
  4: "회원가입이 완료되었습니다",
};


// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────
export function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useOutletContext<OutletContext>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSocial = searchParams.get("social") === "true";
  const [pendingSocial, setPendingSocial] = useState<PendingSocialUser | null>(null);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"client" | "expert" | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [agreements, setAgreements] = useState({ termsOfService: false, privacyPolicy: false, marketing: false });
  const [formData, setFormData] = useState({
    businessName: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  useEffect(() => {
    if (isSocial) {
      const raw = sessionStorage.getItem("pendingSocialUser");
      if (!raw) {
        toast.error("소셜 로그인 세션이 만료되었습니다.");
        navigate("/login");
        return;
      }
      const social = JSON.parse(raw) as PendingSocialUser;
      setPendingSocial(social);
      setFormData((prev) => ({ ...prev, name: social.name, email: social.email }));
    }
  }, [isSocial, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ─── 회원가입 API 연동 ───
  const handleSignupSubmit = async (isSocialSignup: boolean) => {
    if (!userType) return;
    setIsLoading(true);
    try {
      if (userType === "expert" && !isSocialSignup && !formData.businessName.trim()) {
        toast.error("전문가 회원가입은 상호명이 필요합니다.");
        return;
      }

      const payload = {
        userType: userType.toUpperCase() as "CLIENT" | "EXPERT",
        name: isSocialSignup ? pendingSocial?.name : formData.name,
        email: isSocialSignup ? pendingSocial?.email : formData.email,
        phone: isSocialSignup ? "01000000000" : formData.phone,
        password: isSocialSignup ? `SOCIAL_${pendingSocial?.socialId}` : formData.password,
        ...(userType === "expert"
          ? {
              businessName:
                formData.businessName || pendingSocial?.name || formData.name,
            }
          : {}),
      };

      const res = await userInstance.post("/auth/signup", payload);
      if (res.data.success) {
        const hasAccessToken = persistAuthTokens(res.data.data ?? res.data);
        if (isSocialSignup) sessionStorage.removeItem("pendingSocialUser");

        if (userType === "expert" && !hasAccessToken) {
          toast.success("회원가입이 완료되었습니다. 로그인 후 전문가 인증을 진행해주세요.");
          navigate("/login?next=/expert/verification/apply");
          return;
        }

        setUser({ type: userType, name: payload.name || "" });
        setStep(4);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "회원가입에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgreementNext = () => {
    if (!agreements.termsOfService || !agreements.privacyPolicy) {
      toast.error("필수 약관에 동의해주세요.");
      return;
    }
    if (isSocial) handleSignupSubmit(true);
    else setStep(3);
  };

  const totalSteps = isSocial ? 3 : 4;
  const displayStep = isSocial && step === 4 ? 3 : step;

  return (
    <>
      {showTermsModal && userType && <TermsModal onClose={() => setShowTermsModal(false)} userType={userType} />}

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-2xl shadow-lg border-blue-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{isSocial ? "소셜 회원가입" : "회원가입"}</CardTitle>
            <CardDescription>{STEP_LABELS[step]}</CardDescription>
            <div className="flex items-center justify-center gap-2 mt-4">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${displayStep >= num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>{num}</div>
                  {num < totalSteps && <div className={`w-12 h-1 ${displayStep > num ? "bg-blue-600" : "bg-gray-200"}`} />}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            {/* 1단계: 유형 선택 */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { setUserType("client"); setStep(2); }} className="p-8 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center group">
                  <User className="h-16 w-16 mx-auto mb-4 text-gray-400 group-hover:text-blue-600" />
                  <h3 className="font-bold mb-1">의뢰인</h3>
                  <p className="text-xs text-gray-500">서비스를 의뢰하고 싶어요</p>
                </button>
                <button onClick={() => { setUserType("expert"); setStep(2); }} className="p-8 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center group">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400 group-hover:text-blue-600" />
                  <h3 className="font-bold mb-1">전문가</h3>
                  <p className="text-xs text-gray-500">전문 서비스를 제공하고 싶어요</p>
                </button>
              </div>
            )}

            {/* 2단계: 약관 동의 */}
            {step === 2 && userType && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* 전체 동의 박스 */}
                  <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50">
                    <Checkbox 
                      id="all" 
                      checked={agreements.termsOfService && agreements.privacyPolicy && agreements.marketing} 
                      onCheckedChange={(c) => setAgreements({ termsOfService: !!c, privacyPolicy: !!c, marketing: !!c })} 
                    />
                    <Label htmlFor="all" className="font-bold cursor-pointer">전체 동의</Label>
                  </div>

                  <div className="space-y-5">
                    {/* 1. 이용약관 (필수) */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="terms" checked={agreements.termsOfService} onCheckedChange={(c) => setAgreements({...agreements, termsOfService: !!c})} />
                        <Label htmlFor="terms" className="cursor-pointer font-medium"><span className="text-red-500">(필수)</span> 이용약관 동의</Label>
                      </div>
                      <TermsPreviewBox content={TERMS_DATA[userType].termsOfService.content} onOpenModal={() => setShowTermsModal(true)} />
                    </div>

                    {/* 2. 개인정보 수집 (필수) */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="privacy" checked={agreements.privacyPolicy} onCheckedChange={(c) => setAgreements({...agreements, privacyPolicy: !!c})} />
                        <Label htmlFor="privacy" className="cursor-pointer font-medium"><span className="text-red-500">(필수)</span> 개인정보 수집 및 이용 동의</Label>
                      </div>
                      <TermsPreviewBox content={TERMS_DATA[userType].privacyPolicy.content} onOpenModal={() => setShowTermsModal(true)} />
                    </div>

                    {/* 3. 마케팅 수신 (선택) */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox id="marketing" checked={agreements.marketing} onCheckedChange={(c) => setAgreements({...agreements, marketing: !!c})} />
                        <Label htmlFor="marketing" className="cursor-pointer font-medium">(선택) 마케팅 정보 수신 동의</Label>
                      </div>
                      <TermsPreviewBox content={TERMS_DATA[userType].marketing.content} onOpenModal={() => setShowTermsModal(true)} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">이전</Button>
                  <Button onClick={handleAgreementNext} className="flex-1" disabled={isLoading}>
                    {isLoading ? "처리 중..." : (isSocial ? "가입 완료" : "다음")}
                  </Button>
                </div>
              </div>
            )}

            {/* 3단계: 정보 입력 */}
            {step === 3 && !isSocial && (
              <form onSubmit={(e) => { e.preventDefault(); handleSignupSubmit(false); }} className="space-y-4">
	                <div className="space-y-2">
	                  <Label htmlFor="name">이름</Label>
	                  <Input id="name" name="name" placeholder="홍길동" value={formData.name} onChange={handleChange} required />
	                </div>
                  {userType === "expert" && (
                    <div className="space-y-2">
                      <Label htmlFor="businessName">상호명</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        placeholder="케이법무법인"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}
	                <div className="space-y-2">
	                  <Label htmlFor="email">이메일</Label>
                  <Input id="email" name="email" type="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="01012345678" value={formData.phone} onChange={handleChange} required />
                  
                </div>
               <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <p className="text-[11px] text-red-500">영문, 숫자, 특수문자 포함 8자 이상</p>
                </div>
                <div className="relative">
                  <Input
                    id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={formData.password} onChange={handleChange} className="pr-10" required/>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* 비밀번호 확인 입력 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="pr-10" required/>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
                <div className="flex gap-3 pt-6">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">이전</Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>{isLoading ? "가입 중..." : "가입하기"}</Button>
                </div>
              </form>
            )}

            {/* 4단계: 완료 */}
            {step === 4 && (
              <div className="text-center space-y-6 py-8">
                <CheckCircle2 className="h-20 w-20 text-blue-600 mx-auto animate-bounce" />
                <h3 className="text-2xl font-bold">회원가입이 완료되었습니다!</h3>
                <p className="text-gray-500">이제 다양한 진단매치의 서비스를 이용하실 수 있습니다.</p>
                <Button onClick={() => navigate(userType === "client" ? "/client/company-info" : "/expert/dashboard")} className="w-full" size="lg">시작하기</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
