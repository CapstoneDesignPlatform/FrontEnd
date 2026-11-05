import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowRight, ClipboardList, LogIn, Smartphone } from "lucide-react";

type LookupMethod = "phone" | "login" | null;

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const maskPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return "확인된 휴대폰 번호";
  return `${digits.slice(0, 3)}-****-${digits.slice(7)}`;
};

export function CheckRequest() {
  const navigate = useNavigate();
  const verificationInputRef = useRef<HTMLInputElement>(null);
  const sessionVerifiedPhone = "";
  const latestGuestProjectId = null;
  const [selectedMethod, setSelectedMethod] = useState<LookupMethod>(sessionVerifiedPhone ? "phone" : null);
  const [phoneNumber, setPhoneNumber] = useState(() => formatPhoneNumber(sessionVerifiedPhone));
  const [phoneError, setPhoneError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationRequested, setVerificationRequested] = useState(false);
  const [isVerified, setIsVerified] = useState(Boolean(sessionVerifiedPhone));
  const phoneDigits = phoneNumber.replace(/\D/g, "");

  useEffect(() => {
    if (verificationRequested) verificationInputRef.current?.focus();
  }, [verificationRequested]);

  const resetPhoneLookup = () => {
    setPhoneNumber("");
    setPhoneError("");
    setVerificationCode("");
    setVerificationError("");
    setVerificationRequested(false);
    setIsVerified(false);
  };

  const handleVerificationRequest = () => {
    if (phoneDigits.length !== 11) {
      setPhoneError("휴대폰 번호 11자리를 정확히 입력해 주세요.");
      setVerificationRequested(false);
      setIsVerified(false);
      return;
    }
    if (!phoneDigits.startsWith("010")) {
      setPhoneError("010으로 시작하는 휴대폰 번호를 입력해 주세요.");
      setVerificationRequested(false);
      setIsVerified(false);
      return;
    }

    setPhoneError("휴대폰 인증과 비회원 의뢰 조회는 준비 중입니다.");
  };

  const handleVerification = () => {
    setVerificationError("휴대폰 인증과 비회원 의뢰 조회는 아직 지원되지 않습니다.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">의뢰 확인하기</h1>
          <p className="text-gray-600">비회원은 휴대폰 확인 후, 회원은 로그인 후 의뢰를 확인할 수 있습니다.</p>
        </div>

        {!selectedMethod ? (
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
              onClick={() => setSelectedMethod("phone")}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">비회원 의뢰 조회</CardTitle>
                <CardDescription className="text-base break-keep text-balance">
                  의뢰 시 사용한 휴대폰 번호를 확인하면 등록한 의뢰와 전문가 제안을 확인할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  {["회원가입 없이 간편하게 조회", "전문가 제안 및 진행 상황 확인", "의뢰한 휴대폰 번호로 안전하게 확인"].map((text) => (
                    <div key={text} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 회원 로그인 방식은 기존대로 유지 */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-500"
              onClick={() => setSelectedMethod("login")}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <LogIn className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">회원 로그인</CardTitle>
                <CardDescription className="text-base">회원으로 로그인하여 모든 의뢰를 관리할 수 있습니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  {["모든 의뢰 내역 한눈에 확인", "기업 정보 관리", "추가 혜택 및 알림 서비스"].map((text) => (
                    <div key={text} className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : selectedMethod === "phone" ? (
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>{isVerified ? "비회원 의뢰 목록" : "휴대폰 번호 확인"}</CardTitle>
              {!isVerified && <CardDescription>휴대폰 인증과 비회원 의뢰 조회는 준비 중입니다. 회원 의뢰는 로그인 후 확인해 주세요.</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-6">
              {isVerified ? (
                <div className="space-y-6">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-8 text-center">
                    <ClipboardList className="mx-auto mb-3 h-9 w-9 text-gray-400" />
                    {latestGuestProjectId ? (
                      <>
                        <p className="font-medium text-gray-800">최근 등록한 비회원 의뢰</p>
                        <p className="mt-1 text-sm text-gray-500">전문가 제안 대기 중 · 진행 상황 확인 가능</p>
                      </>
                    ) : (
                      <p className="font-medium text-gray-800">등록된 비회원 의뢰가 없습니다.</p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">{maskPhoneNumber(phoneDigits)} 확인 완료</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      resetPhoneLookup();
                      setSelectedMethod(null);
                    }}
                  >
                    이전
                  </Button>
                </div>
              ) : (
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                    verificationRequested ? handleVerification() : handleVerificationRequest();
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="lookup-phone">휴대폰 번호</Label>
                    <Input
                      id="lookup-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      placeholder="휴대폰 번호를 입력해 주세요"
                      value={phoneNumber}
                      readOnly={verificationRequested}
                      aria-invalid={Boolean(phoneError)}
                      onChange={(event) => {
                        setPhoneNumber(formatPhoneNumber(event.target.value));
                        setPhoneError("");
                        setVerificationRequested(false);
                        setIsVerified(false);
                      }}
                      autoFocus
                    />
                    {phoneError && <p className="text-sm text-red-600">{phoneError}</p>}
                  </div>

                  {!verificationRequested ? (
                    <Button type="submit" disabled className="w-full bg-blue-600 hover:bg-blue-700">휴대폰 조회 준비 중</Button>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-blue-600">카카오톡으로 새 확인번호를 보내드렸습니다.</p>
                      <div className="space-y-2">
                        <Label htmlFor="lookup-verification-code">확인번호</Label>
                        <Input
                          ref={verificationInputRef}
                          id="lookup-verification-code"
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={6}
                          autoComplete="one-time-code"
                          placeholder="6자리 확인번호"
                          value={verificationCode}
                          aria-invalid={Boolean(verificationError)}
                          onChange={(event) => {
                            setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                            setVerificationError("");
                          }}
                        />
                        {verificationError && <p className="text-sm text-red-600">{verificationError}</p>}
                      </div>
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">확인하고 의뢰 조회하기</Button>
                      <Button type="button" variant="outline" className="w-full" onClick={handleVerificationRequest}>
                        카카오톡으로 확인번호 다시 받기
                      </Button>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      resetPhoneLookup();
                      setSelectedMethod(null);
                    }}
                  >
                    이전
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>회원 로그인</CardTitle>
              <CardDescription>로그인 페이지로 이동합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">회원으로 로그인하시면 모든 의뢰 내역을 한 번에 관리하고, 추가 혜택을 받으실 수 있습니다.</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedMethod(null)}>이전</Button>
                <Button className="flex-1" onClick={() => navigate("/login")}>로그인하기</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
