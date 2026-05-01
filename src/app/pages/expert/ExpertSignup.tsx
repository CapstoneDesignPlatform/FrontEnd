import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
import { registerExpert } from "../../../api/expert";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useFormFields } from "../../hooks/useFormFields";
import { useRootOutletContext } from "../../hooks/useRootOutletContext";

const initialExpertSignupForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
};

export function ExpertSignup() {
  const navigate = useNavigate();
  const { setUser } = useRootOutletContext();
  const { isPending: isRegistering, run: submitRegistration } = useAsyncAction(
    registerExpert,
    {
      onError: () => {
        toast.error("회원가입에 실패했습니다.");
      },
      onSuccess: (profile) => {
        setUser({ type: "expert", name: profile.name });
        toast.success("회원가입이 완료되었습니다!");
        navigate("/expert/verification/apply");
      },
    },
  );
  const { handleChange, values: formData } =
    useFormFields(initialExpertSignupForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }

    void submitRegistration({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">전문가 회원가입</CardTitle>
          <CardDescription>전문가 계정을 만들어 서비스를 시작하세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>사용자 유형</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/register")}
                >
                  의뢰인
                </Button>
                <Button
                  type="button"
                  variant="default"
                  className="flex-1"
                >
                  전문가
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
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
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isRegistering}
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
                disabled={isRegistering}
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
                disabled={isRegistering}
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
                disabled={isRegistering}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isRegistering}>
              {isRegistering ? "회원가입 중..." : "회원가입"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">이미 계정이 있으신가요? </span>
              <Link to="/login" className="text-teal-600 hover:underline">
                로그인
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
