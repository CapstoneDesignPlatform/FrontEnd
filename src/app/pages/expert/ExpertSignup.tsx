import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
import { registerExpert } from "../../../api/expert";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useFormFields } from "../../hooks/useFormFields";
import { useRootOutletContext } from "../../hooks/useRootOutletContext";
import { TERMS_DATA } from "../../../data/terms";

type SignupStep = "agreements" | "account";
type AgreementChoice = "agree" | "disagree" | null;
type AgreementKey =
  | "termsOfService"
  | "privacyPolicy"
  | "uniqueIdentifier"
  | "thirdParty";

type AgreementState = Record<AgreementKey, AgreementChoice>;

const initialExpertSignupForm = {
  companyName: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
};

const initialAgreements: AgreementState = {
  termsOfService: null,
  privacyPolicy: null,
  uniqueIdentifier: null,
  thirdParty: null,
};

const uniqueIdentifierContent = `고유식별정보 수집 및 이용 안내

1. 수집 및 이용 목적
회사는 전문가 자격 확인, 사업자 또는 법인 등록 정보 확인, 입찰 및 계약 진행 과정에서 본인 또는 사업자 식별을 위해 고유식별정보를 수집 및 이용합니다.

2. 수집 항목
- 법인등록번호 또는 주민등록번호
- 사업자등록번호
- 자격증, 면허증, 사업자등록증 등 제출 서류에 포함된 식별 정보

3. 보유 및 이용 기간
회원 탈퇴 또는 전문가 인증 목적 달성 시까지 보유하며, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 별도 보관합니다.

4. 동의 거부 권리 및 불이익
이용자는 고유식별정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수 식별 정보 확인이 어려운 경우 전문가 인증 및 입찰 서비스 이용이 제한될 수 있습니다.`;

const thirdPartyContent = `개인 정보 제3자 제공 동의 안내

1. 제공받는 자
입찰이 진행되는 의뢰 기업 또는 의뢰 담당자

2. 제공 목적
전문가 입찰 검토, 전문가 선정, 계약 협의, 의뢰 진행을 위한 연락 및 확인

3. 제공 항목
전문가 이름, 소속 또는 상호, 연락처, 이메일, 전문 분야, 자격 및 경력 정보, 입찰 관련 정보

4. 보유 및 이용 기간
제공 목적 달성 시까지 보유하며, 계약 또는 분쟁 대응 등 관계 법령상 보존이 필요한 경우 해당 기간 동안 보관할 수 있습니다.

5. 동의 거부 권리
본 동의는 선택사항이며 동의하지 않아도 회원가입은 가능합니다. 다만, 입찰 목적의 정보 제공에 동의하지 않을 경우 의뢰 기업과의 입찰 검토 및 선정 과정에서 일부 기능 이용이 제한될 수 있습니다.`;

export function ExpertSignup() {
  const navigate = useNavigate();
  const { setUser } = useRootOutletContext();
  const [step, setStep] = useState<SignupStep>("agreements");
  const [agreements, setAgreements] =
    useState<AgreementState>(initialAgreements);
  const { isPending: isRegistering, run: submitRegistration } = useAsyncAction(
    registerExpert,
    {
      onError: () => {
        toast.error("회원가입에 실패했습니다.");
      },
      onSuccess: ({ loginRequired, profile }) => {
        if (loginRequired) {
          setUser(null);
          toast.success("회원가입이 완료되었습니다. 로그인 후 인증 신청을 진행해주세요.");
          navigate("/login?next=/expert/verification/apply");
          return;
        }

        setUser({ type: "expert", name: profile.name });
        toast.success("회원가입이 완료되었습니다!");
        navigate("/expert/verification/apply");
      },
    },
  );
  const { handleChange, values: formData } =
    useFormFields(initialExpertSignupForm);
  const agreementItems = useMemo(
    () => [
      {
        key: "termsOfService" as const,
        title: "이용약관",
        required: true,
        prompt: "이용약관에 대해 동의합니다.",
        content: TERMS_DATA.expert.termsOfService.content,
        withScrollableBox: true,
      },
      {
        key: "privacyPolicy" as const,
        title: "개인 정보 수집 및 이용 안내",
        required: true,
        prompt: "개인정보 수집 및 이용에 동의합니다.",
        content: TERMS_DATA.expert.privacyPolicy.content,
        withScrollableBox: true,
      },
      {
        key: "uniqueIdentifier" as const,
        title: "고유식별정보 수집 및 이용",
        required: true,
        prompt: "고유식별정보(법인(주민)등록번호) 수집 및 이용에 대해 동의합니다.",
        content: uniqueIdentifierContent,
        withScrollableBox: false,
      },
      {
        key: "thirdParty" as const,
        title: "개인 정보 제3자 제공 동의",
        required: false,
        prompt: "개인 정보의 제3자 제공(입찰목적)에 대해 동의합니다.",
        content: thirdPartyContent,
        withScrollableBox: true,
      },
    ],
    [],
  );
  const requiredAgreementKeys = agreementItems
    .filter((item) => item.required)
    .map((item) => item.key);
  const hasAllRequiredAgreements = requiredAgreementKeys.every(
    (key) => agreements[key] === "agree",
  );
  const hasSelectedAllAgreementChoices = agreementItems.every(
    (item) => agreements[item.key] !== null,
  );
  const hasPasswordMismatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;
  const hasPasswordMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const setAgreement = (key: AgreementKey, choice: AgreementChoice) => {
    setAgreements((current) => ({
      ...current,
      [key]: choice,
    }));
  };

  const validateAgreements = () => {
    if (!hasSelectedAllAgreementChoices) {
      toast.error("모든 동의 항목에 대해 동의 여부를 선택해주세요.");
      return false;
    }

    if (!hasAllRequiredAgreements) {
      toast.error("필수 동의 항목은 모두 동의함을 선택해야 합니다.");
      return false;
    }

    return true;
  };

  const handleGoToAccountStep = () => {
    if (!validateAgreements()) return;

    setStep("account");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToAgreementStep = () => {
    setStep("agreements");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAgreements()) {
      setStep("agreements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    void submitRegistration({
      companyName: formData.companyName,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    });
  };

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-4xl border-slate-200">
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-2xl">전문가 회원가입</CardTitle>
              <CardDescription>
                {step === "agreements"
                  ? "전문가 서비스 이용을 위한 동의 항목을 확인해주세요."
                  : "전문가 계정으로 사용할 기본 정보를 입력해주세요."}
              </CardDescription>
            </div>
            <div
              aria-label="회원가입 진행 단계"
              className="flex rounded-lg border bg-slate-50 p-1 text-sm"
            >
              <span
                className={`rounded-md px-3 py-1.5 ${
                  step === "agreements"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                약관 동의
              </span>
              <span
                className={`rounded-md px-3 py-1.5 ${
                  step === "account"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                정보 입력
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === "agreements" ? (
              <div className="space-y-6">
                <div className="grid gap-5">
                  {agreementItems.map((item) => (
                    <section
                      key={item.key}
                      className="rounded-lg border border-slate-200 bg-white p-4"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <h2 className="text-base font-semibold text-slate-950">
                          {item.title}
                        </h2>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            item.required
                              ? "bg-red-50 text-red-600"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item.required ? "필수" : "선택"}
                        </span>
                      </div>

                      {item.withScrollableBox ? (
                        <div className="h-44 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                          <pre className="whitespace-pre-wrap font-sans">
                            {item.content}
                          </pre>
                        </div>
                      ) : null}

                      {!item.withScrollableBox ? (
                        <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                          전문가 인증 및 입찰 서비스 제공을 위해 법인등록번호,
                          주민등록번호, 사업자등록번호 등 고유식별정보가 포함된
                          서류를 확인할 수 있습니다.
                        </p>
                      ) : null}

                      <div className="mt-4 space-y-3">
                        <p className="text-sm font-medium text-slate-800">
                          {item.prompt}
                        </p>
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <AgreementCheckbox
                            checked={agreements[item.key] === "agree"}
                            disabled={isRegistering}
                            id={`${item.key}-agree`}
                            label="동의함"
                            onCheckedChange={(checked) =>
                              setAgreement(
                                item.key,
                                checked ? "agree" : null,
                              )
                            }
                          />
                          <AgreementCheckbox
                            checked={agreements[item.key] === "disagree"}
                            disabled={isRegistering}
                            id={`${item.key}-disagree`}
                            label="동의하지 않음"
                            onCheckedChange={(checked) =>
                              setAgreement(
                                item.key,
                                checked ? "disagree" : null,
                              )
                            }
                          />
                        </div>
                      </div>
                    </section>
                  ))}
                </div>

                <StepNavigation
                  nextLabel="다음단계"
                  onNext={handleGoToAccountStep}
                  onPrevious={() => navigate("/")}
                />
              </div>
            ) : null}

            {step === "account" ? (
              <div className="mx-auto w-full max-w-2xl space-y-5">
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                  <p className="text-sm font-medium text-blue-900">
                    전문가 계정 정보
                  </p>
                  <p className="mt-1 text-sm leading-6 text-blue-800">
                    입력한 계정 정보는 전문가 인증 신청과 의뢰 입찰 안내에 사용됩니다.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyName">상호명</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      placeholder="예: 케이법무법인"
                      value={formData.companyName}
                      onChange={handleChange}
                      disabled={isRegistering}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">대표자</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isRegistering}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">대표자 연락처</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="010-0000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isRegistering}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="expert@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isRegistering}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="비밀번호"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isRegistering}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                      {hasPasswordMismatch ? (
                        <span className="text-xs font-medium text-red-600">
                          비밀번호가 일치하지 않습니다.
                        </span>
                      ) : null}
                      {hasPasswordMatch ? (
                        <span className="text-xs font-medium text-blue-600">
                          비밀번호가 일치합니다.
                        </span>
                      ) : null}
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="비밀번호 확인"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isRegistering}
                      aria-invalid={hasPasswordMismatch}
                      required
                    />
                  </div>
                </div>

                <StepNavigation
                  isNextDisabled={isRegistering}
                  nextLabel={isRegistering ? "회원가입 중..." : "회원가입"}
                  nextType="submit"
                  onPrevious={handleGoToAgreementStep}
                />

              </div>
            ) : null}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

interface AgreementCheckboxProps {
  checked: boolean;
  disabled?: boolean;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}

function AgreementCheckbox({
  checked,
  disabled = false,
  id,
  label,
  onCheckedChange,
}: AgreementCheckboxProps) {
  return (
    <div className="flex min-h-10 flex-1 items-center gap-2 rounded-md border border-slate-200 px-3 py-2">
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(nextChecked) => onCheckedChange(nextChecked === true)}
      />
      <Label htmlFor={id} className="cursor-pointer text-sm text-slate-700">
        {label}
      </Label>
    </div>
  );
}

interface StepNavigationProps {
  isNextDisabled?: boolean;
  nextLabel: string;
  nextType?: "button" | "submit";
  onNext?: () => void;
  onPrevious: () => void;
}

function StepNavigation({
  isNextDisabled = false,
  nextLabel,
  nextType = "button",
  onNext,
  onPrevious,
}: StepNavigationProps) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-between">
      <Button
        type="button"
        variant="outline"
        className="sm:w-40"
        onClick={onPrevious}
      >
        이전단계
      </Button>
      <Button
        type={nextType}
        className="bg-blue-600 hover:bg-blue-700 sm:w-40"
        disabled={isNextDisabled}
        onClick={onNext}
      >
        {nextLabel}
      </Button>
    </div>
  );
}
