import { useEffect, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { ExpertProfileForm } from "../../components/expert/ExpertProfileForm";
import { getExpertProfile, updateExpertProfile } from "../../../api/expert";
import type { ExpertProfileFormVM } from "../../../types/expert";
import { toast } from "sonner";

export function ExpertProfile() {
  const [profile, setProfile] = useState<ExpertProfileFormVM | null>(null);

  useEffect(() => {
    void getExpertProfile().then(setProfile);
  }, []);

  const handleChange = (
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
  ) => {
    if (!profile) return;
    setProfile({
      ...profile,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    void updateExpertProfile(profile).then((updatedProfile) => {
      setProfile(updatedProfile);
      toast.success("프로필이 저장되었습니다.");
    });
  };

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">전문가 프로필을 불러오는 중입니다.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">전문가 프로필 관리</h1>
          <p className="text-gray-600">전문가 정보와 소개 내용을 관리하세요.</p>
        </div>
        <Badge className="bg-teal-100 text-teal-700">
          {profile.verificationStatus}
        </Badge>
      </div>

      <ExpertProfileForm
        profile={profile}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      <Card>
        <CardHeader>
          <CardTitle>전문 분야</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {profile.expertiseAreas.map((area) => (
              <Badge key={area} variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                {area}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
