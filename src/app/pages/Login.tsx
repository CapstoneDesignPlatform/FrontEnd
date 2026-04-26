import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { toast } from "sonner";
import { useFormFields } from "../hooks/useFormFields";
import { useRootOutletContext } from "../hooks/useRootOutletContext";

const initialLoginForm = {
  email: "",
  password: "",
};

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useRootOutletContext();
  const { handleChange, values: formData } = useFormFields(initialLoginForm);
  const [userType, setUserType] = useState<"client" | "expert">("client");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 데모용 로그인 처리
    if (formData.email && formData.password) {
      setUser({ type: userType, name: formData.email.split("@")[0] });
      toast.success("로그인 성공!");
      
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
