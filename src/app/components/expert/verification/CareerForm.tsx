import {
  VerificationTextareaField,
  VerificationTextField,
} from "./VerificationFields";
import type { VerificationCareerData } from "./types";

interface CareerFormProps {
  career: VerificationCareerData;
  disabled?: boolean;
  onChange: (data: VerificationCareerData) => void;
}

export function CareerForm({
  career,
  disabled = false,
  onChange,
}: CareerFormProps) {
  const handleFieldChange = (
    field: keyof VerificationCareerData,
    value: string,
  ) => {
    onChange({
      ...career,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <VerificationTextField
        id="verification-company-name"
        label="업체명"
        value={career.companyName}
        onChange={(value) => handleFieldChange("companyName", value)}
        placeholder="업체명"
        required
        disabled={disabled}
      />

      <VerificationTextareaField
        id="verification-portfolio"
        label="포트폴리오 / 실적"
        value={career.portfolio}
        onChange={(value) => handleFieldChange("portfolio", value)}
        placeholder="주요 의뢰나 실적을 입력해주세요."
        rows={4}
        disabled={disabled}
      />
    </div>
  );
}
