import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import type { ExpertProfileFormVM } from "../../../types/expert";

interface ExpertProfileFormProps {
  profile: ExpertProfileFormVM;
  onChange: (
    field: keyof Pick<
      ExpertProfileFormVM,
      | "name"
      | "email"
      | "phone"
      | "companyName"
      | "licenseType"
      | "licenseNumber"
      | "experienceYears"
      | "education"
      | "introduction"
      | "portfolio"
    >,
    value: string | number,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ExpertProfileForm({ profile, onChange, onSubmit }: ExpertProfileFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>전문가 프로필</CardTitle>
        <CardDescription>의뢰인에게 보여질 전문가 정보를 관리하세요.</CardDescription>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">소속</Label>
              <Input
                id="companyName"
                value={profile.companyName}
                onChange={(e) => onChange("companyName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => onChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">연락처</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseType">자격증 종류</Label>
              <Input
                id="licenseType"
                value={profile.licenseType}
                onChange={(e) => onChange("licenseType", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseNumber">자격증 번호</Label>
              <Input
                id="licenseNumber"
                value={profile.licenseNumber}
                onChange={(e) => onChange("licenseNumber", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceYears">경력 연수</Label>
              <Input
                id="experienceYears"
                type="number"
                value={profile.experienceYears}
                onChange={(e) => onChange("experienceYears", Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">학력</Label>
              <Input
                id="education"
                value={profile.education ?? ""}
                onChange={(e) => onChange("education", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="introduction">소개</Label>
            <Textarea
              id="introduction"
              rows={5}
              value={profile.introduction}
              onChange={(e) => onChange("introduction", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio">포트폴리오 / 실적</Label>
            <Textarea
              id="portfolio"
              rows={4}
              value={profile.portfolio ?? ""}
              onChange={(e) => onChange("portfolio", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            프로필 저장하기
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
