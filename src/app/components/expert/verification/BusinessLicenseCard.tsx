import { VerificationFileUpload } from "./VerificationFileUpload";
import { VerificationTextField } from "./VerificationFields";
import type { VerificationBusinessLicenseData } from "./types";

interface BusinessLicenseCardProps {
  license: VerificationBusinessLicenseData;
  disabled?: boolean;
  onChange: (data: VerificationBusinessLicenseData) => void;
}

export function BusinessLicenseCard({
  license,
  disabled = false,
  onChange,
}: BusinessLicenseCardProps) {
  const fileInputId = "business-license-file";

  const handleFieldChange = (
    field: keyof VerificationBusinessLicenseData,
    value: string,
  ) => {
    onChange({
      ...license,
      [field]: value,
    });
  };

  return (
    <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 space-y-1">
        <p className="text-[14px] font-medium text-foreground">
          사업자 등록증
        </p>
        <p className="text-[12px] text-muted-foreground">
          등록증 이미지는 제출 검증용으로만 사용됩니다.
        </p>
      </div>

      <div className="space-y-4">
        <VerificationFileUpload
          disabled={disabled}
          fileName={license.fileName}
          inputId={fileInputId}
          previewAlt="사업자 등록증 미리보기"
          previewKind={license.previewKind}
          previewUrl={license.previewUrl}
          uploadLabel="클릭하여 사업자 등록증 업로드"
          onPreviewChange={(preview) =>
            onChange({
              ...license,
              ...preview,
            })
          }
        />

        <div className="grid gap-3 md:grid-cols-3">
          <VerificationTextField
            id="business-number"
            label="사업자 번호"
            value={license.businessNumber}
            onChange={(value) => handleFieldChange("businessNumber", value)}
            placeholder="123-45-67890"
            disabled={disabled}
          />

          <VerificationTextField
            id="business-owner-name"
            label="성명"
            value={license.name}
            onChange={(value) => handleFieldChange("name", value)}
            placeholder="성명"
            disabled={disabled}
          />

          <VerificationTextField
            id="business-company-name"
            label="상호"
            value={license.companyName}
            onChange={(value) => handleFieldChange("companyName", value)}
            placeholder="업체명"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
