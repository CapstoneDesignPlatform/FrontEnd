import { X } from "lucide-react";

import { VerificationFileUpload } from "./VerificationFileUpload";
import { VerificationTextField } from "./VerificationFields";
import type { VerificationCertificateData } from "./types";

interface CertificateCardProps {
  certificate: VerificationCertificateData;
  disabled?: boolean;
  isPrimary?: boolean;
  onChange: (data: VerificationCertificateData) => void;
  onDelete?: () => void;
}

export function CertificateCard({
  certificate,
  disabled = false,
  isPrimary = false,
  onChange,
  onDelete,
}: CertificateCardProps) {
  const fieldIdPrefix = `certificate-${certificate.id}`;
  const fileInputId = `${fieldIdPrefix}-file`;

  const handleFieldChange = (
    field: keyof VerificationCertificateData,
    value: string,
  ) => {
    onChange({
      ...certificate,
      [field]: value,
    });
  };

  return (
    <div className="relative h-full rounded-lg border border-black/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          aria-label="자격증 삭제"
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-muted-foreground transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}

      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[14px] font-medium text-foreground">
            {isPrimary ? "대표 자격증" : "추가 자격증"}
          </p>
          <p className="text-[12px] text-muted-foreground">
            PDF, JPG, PNG 파일을 업로드할 수 있습니다.
          </p>
        </div>
        {isPrimary ? (
          <span className="rounded-full bg-teal-50 px-3 py-1 text-[12px] font-medium text-teal-700">
            신청 기준
          </span>
        ) : null}
      </div>

      <div className="space-y-4">
        <VerificationFileUpload
          disabled={disabled}
          fileName={certificate.fileName}
          inputId={fileInputId}
          previewAlt="자격증 미리보기"
          previewKind={certificate.previewKind}
          previewUrl={certificate.previewUrl}
          uploadLabel="클릭하여 자격증 사본 업로드"
          onPreviewChange={(preview) =>
            onChange({
              ...certificate,
              ...preview,
            })
          }
        />

        <div className="space-y-3">
          <VerificationTextField
            id={`${fieldIdPrefix}-type`}
            label="자격증 종류"
            value={certificate.type}
            onChange={(value) => handleFieldChange("type", value)}
            placeholder="예: 공인회계사"
            required={isPrimary}
            disabled={disabled}
          />

          <div className="grid gap-3 md:grid-cols-2">
            <VerificationTextField
              id={`${fieldIdPrefix}-number`}
              label="자격증 번호"
              value={certificate.number}
              onChange={(value) => handleFieldChange("number", value)}
              placeholder="자격증 번호"
              required={isPrimary}
              disabled={disabled}
            />

            <VerificationTextField
              id={`${fieldIdPrefix}-issue-date`}
              label="발급일"
              type="date"
              value={certificate.issueDate}
              onChange={(value) => handleFieldChange("issueDate", value)}
              required={isPrimary}
              disabled={disabled}
            />
          </div>

          <VerificationTextField
            id={`${fieldIdPrefix}-name`}
            label="성명"
            value={certificate.name}
            onChange={(value) => handleFieldChange("name", value)}
            placeholder="성명"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
