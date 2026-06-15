import { Badge } from "../../components/ui/badge";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { ExpertProfileForm } from "../../components/expert/ExpertProfileForm";
import { getExpertProfile, updateExpertProfile } from "../../../api/expert";
import type { ExpertProfileFormVM } from "../../../types/expert";
import { toast } from "sonner";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useAsyncData } from "../../hooks/useAsyncData";

export function ExpertProfile() {
  const {
    data: profile,
    error,
    isLoading,
    setData: setProfile,
  } = useAsyncData(getExpertProfile);
  const { isPending: isSaving, run: saveProfile } = useAsyncAction(
    updateExpertProfile,
    {
      onError: () => {
        toast.error("프로필 저장에 실패했습니다.");
      },
      onSuccess: (updatedProfile) => {
        setProfile(updatedProfile);
        toast.success("프로필이 저장되었습니다.");
      },
    },
  );

  const handleChange = (
    field: keyof Pick<ExpertProfileFormVM, "name" | "phone" | "companyName">,
    value: string,
  ) => {
    if (!profile) return;
    setProfile((current) => current ? { ...current, [field]: value } : current);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    void saveProfile(profile);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <AsyncStateCard
          message="전문가 프로필을 불러오지 못했습니다."
          tone="danger"
        />
      </div>
    );
  }

  if (isLoading && !profile) {
    return (
      <div className="space-y-6">
        <AsyncStateCard message="전문가 프로필을 불러오는 중입니다." />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">전문가 프로필 관리</h1>
          <p className="text-gray-600">의뢰인에게 노출될 기본 전문가 정보를 관리하세요.</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700">
          {profile.verificationStatus}
        </Badge>
      </div>

      <ExpertProfileForm
        isSubmitting={isSaving}
        profile={profile}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
