import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { getStoredAccessToken } from "../../../api/authTokens";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { UserCircle, FileText } from "lucide-react";

export function ClientStart() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(180);
  const [timerSession, setTimerSession] = useState(0);

  const isVerificationExpired = remainingSeconds === 0;

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handleVerificationRequest = () => {
    const phoneDigits = phoneNumber.replace(/\D/g, "");

    if (phoneDigits.length !== 11) {
      setPhoneError("휴대폰 번호 11자리를 정확히 입력해 주세요.");
      setShowVerification(false);
      return;
    }

    if (!phoneDigits.startsWith("010")) {
      setPhoneError("010으로 시작하는 휴대폰 번호를 입력해 주세요.");
      setShowVerification(false);
      return;
    }

    setPhoneError("휴대폰 인증은 준비 중입니다. 회원으로 로그인하여 의뢰해 주세요.");
  };

  const handleVerification = () => {
    setVerificationError("휴대폰 인증은 아직 지원되지 않습니다.");
  };

  const handleVerificationResend = handleVerificationRequest;

  const formatRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (getStoredAccessToken()) {
      navigate("/client/company-info", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (showVerification) {
      document.getElementById("guest-verification-code")?.focus();
    }
  }, [showVerification, timerSession]);

  useEffect(() => {
    if (!showVerification) return;

    const timerId = window.setInterval(() => {
      setRemainingSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timerId);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [showVerification, timerSession]);

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
          <Card className="order-2 md:flex md:flex-col hover:shadow-lg transition-shadow border-blue-100">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-xl">회원으로 의뢰 등록</CardTitle>
              <CardDescription>
                회원 가입 후 다양한 혜택을 받으세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:flex md:flex-1 md:flex-col md:space-y-0">
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

              <div className="space-y-2 pt-4 md:mt-auto">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link to="/login">로그인</Link>
                </Button>
                <div className="text-center text-sm text-gray-600">
                  계정이 없으신가요?{" "}
                  <Link to="/register" className="text-blue-600 hover:underline font-medium">
                    회원가입
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 비회원으로 의뢰 등록 */}
          <Card className="order-1 md:flex md:flex-col hover:shadow-lg transition-shadow border-blue-100">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-xl">휴대폰 번호로 간편 의뢰</CardTitle>
                <CardDescription className="break-keep text-balance">
                  휴대폰 번호로 의뢰하는 기능은 준비 중입니다. 현재는 회원 로그인을 이용해 주세요.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:flex md:flex-1 md:flex-col md:space-y-0">
              <div className="space-y-2">
                <label htmlFor="guest-phone" className="text-sm font-medium text-gray-700">
                  휴대폰 번호
                </label>
                <Input
                  id="guest-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="휴대폰 번호를 입력해 주세요"
                  autoComplete="tel"
                  value={phoneNumber}
                  aria-invalid={Boolean(phoneError)}
                  aria-describedby={phoneError ? "guest-phone-error" : undefined}
                  onChange={(event) => {
                    const formattedPhoneNumber = formatPhoneNumber(event.target.value);
                    setPhoneNumber(formattedPhoneNumber);
                    setPhoneError("");

                    if (formattedPhoneNumber.replace(/\D/g, "").length !== 11) {
                      setShowVerification(false);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleVerificationRequest();
                    }
                  }}
                />
                {phoneError && (
                  <p id="guest-phone-error" className="text-sm text-red-600" role="alert">
                    {phoneError}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-4 md:mt-auto">
                <Button
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  variant="secondary"
                  onClick={handleVerificationRequest} disabled
                >
                  휴대폰 인증 준비 중
                </Button>
                <div className="hidden h-5 md:block" aria-hidden="true" />
              </div>

              {showVerification && (
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-blue-600" role="status">
                    카카오톡으로 확인번호를 보내드렸습니다.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="guest-verification-code" className="text-sm font-medium text-gray-700">
                        확인번호
                      </label>
                      <span className="text-sm font-bold text-red-700" aria-label="확인번호 남은 시간">
                        {formatRemainingTime(remainingSeconds)}
                      </span>
                    </div>
                    <Input
                      id="guest-verification-code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="6자리 확인번호"
                      autoComplete="one-time-code"
                      value={verificationCode}
                      aria-invalid={Boolean(verificationError)}
                      aria-describedby={verificationError ? "guest-verification-error" : undefined}
                      onChange={(event) => {
                        setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                        setVerificationError("");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          handleVerification();
                        }
                      }}
                    />
                  </div>
                  {isVerificationExpired ? (
                    <p className="text-sm text-red-600" role="alert">
                      확인번호 입력 시간이 만료되었습니다. 다시 확인번호를 받아주세요.
                    </p>
                  ) : verificationError ? (
                    <p id="guest-verification-error" className="text-sm text-red-600" role="alert">
                      {verificationError}
                    </p>
                  ) : null}
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleVerification}
                    disabled={isVerificationExpired}
                  >
                    확인하고 계속하기
                  </Button>
                  {isVerificationExpired && (
                    <Button type="button" variant="outline" className="w-full" onClick={handleVerificationResend}>
                      카카오톡으로 확인번호 다시 받기
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
