import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { AsyncStateCard } from "../../components/common/AsyncStateCard";
import { ExpertProfileForm } from "../../components/expert/ExpertProfileForm";
import { getExpertProfile, updateExpertProfile } from "../../../api/expert";
import type { ExpertProfileFormVM } from "../../../types/expert";
import { toast } from "sonner";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useAsyncData } from "../../hooks/useAsyncData";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { ExpertSubmittedDocuments } from "../../components/expert/ExpertSubmittedDocuments";
import { getExpertVerificationStatus } from "../../../api/expertVerification";

function ProfileSubmittedDocuments() {
  const { data, error, isLoading, reload } = useAsyncData(getExpertVerificationStatus);

  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        {isLoading ? (
          <div role="status">
            <h2 className="font-semibold mb-2">본인 제출 서류</h2>
            <p className="text-sm text-gray-500">제출 서류를 불러오는 중입니다.</p>
          </div>
        ) : error ? (
          <div role="alert" className="space-y-3">
            <h2 className="font-semibold">본인 제출 서류</h2>
            <p className="text-sm text-red-600">제출 서류를 불러오지 못했습니다. 다시 시도해 주세요.</p>
            <Button type="button" variant="outline" onClick={reload}>다시 시도</Button>
          </div>
        ) : data ? (
          <>
            <ExpertSubmittedDocuments verificationRequest={data} />
            {data.status === "REJECTED" && <Button asChild variant="outline"><Link to="/expert/verification/apply">인증 서류 수정·재신청</Link></Button>}
            <p className="text-sm text-gray-500">인증 완료 후에도 본인이 제출한 자격증과 사업자등록증을 다운로드할 수 있습니다.</p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

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
      <ProfileSubmittedDocuments />
    </div>
  );
}
