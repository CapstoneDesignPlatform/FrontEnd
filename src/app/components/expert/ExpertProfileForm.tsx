import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { ExpertProfileFormVM } from "../../../types/expert";

interface ExpertProfileFormProps {
  isSubmitting?: boolean;
  profile: ExpertProfileFormVM;
  onChange: (
    field: keyof Pick<ExpertProfileFormVM, "name" | "phone" | "companyName">,
    value: string,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ExpertProfileForm({
  isSubmitting = false,
  profile,
  onChange,
  onSubmit,
}: ExpertProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>전문가 프로필</CardTitle>
        <CardDescription>의뢰인에게 보여질 기본 정보를 관리하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => onChange("name", e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">소속</Label>
              <Input
                id="companyName"
                value={profile.companyName}
                onChange={(e) => onChange("companyName", e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                readOnly
              />
              <p className="text-xs text-gray-500">
                이메일은 계정 설정에서 별도로 관리합니다.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">연락처</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "프로필 저장 중..." : "프로필 저장하기"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
