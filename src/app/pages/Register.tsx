import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Upload, CheckCircle2, User, FileText, X } from "lucide-react";
import { TERMS_DATA, TermType } from "../../data/terms";
import { toast } from "sonner";

type OutletContext = {
  setUser: (user: { type: "client" | "expert"; name: string }) => void;
};

// 전문보기 모달 컴포넌트
function TermsModal({
  onClose,
  userType,
}: {
  onClose: () => void;
  userType: "client" | "expert";
}) {
  const [activeTab, setActiveTab] = useState<TermType>("termsOfService");
  const currentTerms = TERMS_DATA[userType];

  const tabs: { key: TermType; label: string }[] = [
    { key: "termsOfService", label: "이용약관" },
    { key: "privacyPolicy", label: "개인정보 수집" },
    { key: "marketing", label: "마케팅 수신" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 본체 */}
      <div className="relative bg-white rounded-xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh] shadow-xl">
        {/* 헤더: 탭 + 닫기 버튼 */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`text-sm font-medium pb-1 transition-colors ${
                  activeTab === tab.key
                    ? "text-teal-600 border-b-2 border-teal-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 약관 본문 */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">
            {currentTerms[activeTab].title}
          </h3>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed font-sans">
            {currentTerms[activeTab].content}
          </pre>
        </div>

        {/* 푸터: 닫기 버튼 */}
        <div className="border-t px-6 py-4 flex justify-end">
          <Button type="button" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}

// 약관 미리보기 박스 컴포넌트
function TermsPreviewBox({
  content,
  onOpenModal,
}: {
  content: string;
  onOpenModal: () => void;
}) {
  return (
    <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
      <div className="h-28 overflow-y-auto px-4 py-3">
        <pre className="text-xs text-gray-500 whitespace-pre-wrap leading-relaxed font-sans">
          {content}
        </pre>
      </div>
      <div className="border-t border-gray-200 px-4 py-2 bg-white flex justify-end">
        <button
          type="button"
          onClick={onOpenModal}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium hover:underline transition-colors"
        >
          전문보기 →
        </button>
      </div>
    </div>
  );
}

export function Register() {
  const navigate = useNavigate();
  const { setUser } = useOutletContext<OutletContext>();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"client" | "expert" | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const currentTerms = userType ? TERMS_DATA[userType] : null;
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    marketing: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    expertiseArea: "",
    licenseType: "",
    licenseNumber: "",
  });
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const handleUserTypeSelect = (type: "client" | "expert") => {
    setUserType(type);
    setStep(2);
  };

  const handleAgreementNext = () => {
    if (!agreements.termsOfService || !agreements.privacyPolicy) {
      toast.error("필수 약관에 동의해주세요.");
      return;
    }
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    setUser({ type: userType!, name: formData.name });
    setStep(4);
  };

  const handleComplete = () => {
    toast.success("회원가입이 완료되었습니다!");
    if (userType === "client") {
      navigate("/client/company-info");
    } else {
      navigate("/expert/dashboard");
    }
  };

  return (
    <>
      {/* 전문보기 모달 */}
      {showTermsModal && userType && (
        <TermsModal onClose={() => setShowTermsModal(false)} userType={userType} />
      )}

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              {step === 1 && "회원 유형을 선택해주세요"}
              {step === 2 && "이용약관에 동의해주세요"}
              {step === 3 && "정보를 입력해주세요"}
              {step === 4 && "회원가입이 완료되었습니다"}
            </CardDescription>

            {/* 진행 상태 표시 */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      step >= num ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {num}
                  </div>
                  {num < 4 && (
                    <div className={`w-12 h-1 ${step > num ? "bg-teal-600" : "bg-gray-200"}`} />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            {/* 1단계: 회원 유형 선택 */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleUserTypeSelect("client")}
                    className="p-8 border-2 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center"
                  >
                    <User className="h-16 w-16 mx-auto mb-4 text-teal-600" />
                    <h3 className="font-bold mb-2">개인회원</h3>
                    <p className="text-sm text-gray-600">서비스를 의뢰하고 싶어요</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeSelect("expert")}
                    className="p-8 border-2 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-center"
                  >
                    <FileText className="h-16 w-16 mx-auto mb-4 text-teal-600" />
                    <h3 className="font-bold mb-2">전문가</h3>
                    <p className="text-sm text-gray-600">전문 서비스를 제공하고 싶어요</p>
                  </button>
                </div>
                <div className="text-center text-sm">
                  <span className="text-gray-600">이미 계정이 있으신가요? </span>
                  <Link to="/login" className="text-teal-600 hover:underline">
                    로그인
                  </Link>
                </div>
              </div>
            )}

            {/* 2단계: 약관 동의 */}
            {step === 2 && currentTerms && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {/* 전체 동의 */}
                  <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50">
                    <Checkbox
                      id="all"
                      checked={
                        agreements.termsOfService &&
                        agreements.privacyPolicy &&
                        agreements.marketing
                      }
                      onCheckedChange={(checked) => {
                        setAgreements({
                          termsOfService: !!checked,
                          privacyPolicy: !!checked,
                          marketing: !!checked,
                        });
                      }}
                    />
                    <Label htmlFor="all" className="font-bold cursor-pointer">
                      전체 동의
                    </Label>
                  </div>

                  <div className="space-y-5 pl-1">
                    {/* 이용약관 */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="terms"
                          checked={agreements.termsOfService}
                          onCheckedChange={(checked) =>
                            setAgreements({ ...agreements, termsOfService: !!checked })
                          }
                        />
                        <Label htmlFor="terms" className="cursor-pointer">
                          <span className="text-red-500">(필수)</span> 이용약관 동의
                        </Label>
                      </div>
                      {/* ✅ 버그 수정 1: termsContent → currentTerms */}
                      <TermsPreviewBox
                        content={currentTerms.termsOfService.content}
                        onOpenModal={() => setShowTermsModal(true)}
                      />
                    </div>

                    {/* 개인정보 수집 동의 */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="privacy"
                          checked={agreements.privacyPolicy}
                          onCheckedChange={(checked) =>
                            setAgreements({ ...agreements, privacyPolicy: !!checked })
                          }
                        />
                        <Label htmlFor="privacy" className="cursor-pointer">
                          <span className="text-red-500">(필수)</span> 개인정보 수집 및 이용 동의
                        </Label>
                      </div>
                      {/* ✅ 버그 수정 1: termsContent → currentTerms */}
                      <TermsPreviewBox
                        content={currentTerms.privacyPolicy.content}
                        onOpenModal={() => setShowTermsModal(true)}
                      />
                    </div>

                    {/* 마케팅 동의 */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="marketing"
                          checked={agreements.marketing}
                          onCheckedChange={(checked) =>
                            setAgreements({ ...agreements, marketing: !!checked })
                          }
                        />
                        <Label htmlFor="marketing" className="cursor-pointer">
                          (선택) 마케팅 정보 수신 동의
                        </Label>
                      </div>
                      {/* ✅ 버그 수정 1: termsContent → currentTerms */}
                      <TermsPreviewBox
                        content={currentTerms.marketing.content}
                        onOpenModal={() => setShowTermsModal(true)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button type="button" onClick={handleAgreementNext} className="flex-1">
                    다음
                  </Button>
                </div>
              </div>
            )}

            {/* 3단계: 정보 입력 */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="010-0000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button type="submit" className="flex-1">
                    가입하기
                  </Button>
                </div>
              </form>
            )}

            {/* 4단계: 완료 */}
            {step === 4 && (
              <div className="text-center space-y-6 py-8">
                <CheckCircle2 className="h-20 w-20 text-teal-600 mx-auto" />
                <div>
                  <h3 className="text-xl font-bold mb-2">회원가입이 완료되었습니다!</h3>
                  <p className="text-gray-600">
                    {userType === "client"
                      ? "이제 다양한 전문가 서비스를 이용하실 수 있습니다."
                      : "전문가 인증이 완료되면 서비스를 제공하실 수 있습니다."}
                  </p>
                </div>
                <Button onClick={handleComplete} className="w-full" size="lg">
                  시작하기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}