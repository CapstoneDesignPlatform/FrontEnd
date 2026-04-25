import { Upload, X } from "lucide-react";

import type { VerificationCertificateData } from "./types";

interface CertificateCardProps {
  certificate: VerificationCertificateData;
  disabled?: boolean;
  isPrimary?: boolean;
  onChange: (data: VerificationCertificateData) => void;
  onDelete?: () => void;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function CertificateCard({
  certificate,
  disabled = false,
  isPrimary = false,
  onChange,
  onDelete,
}: CertificateCardProps) {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = await readFileAsDataUrl(file);
    onChange({
      ...certificate,
      file,
      previewUrl,
    });
  };

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
    <div className="relative h-full rounded-[14px] border border-black/10 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-[#717182] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}

      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[14px] font-medium tracking-[-0.1504px] text-[#0a0a0a]">
            {isPrimary ? "대표 자격증" : "추가 자격증"}
          </p>
          <p className="text-[12px] tracking-[-0.12px] text-[#717182]">
            PDF, JPG, PNG 파일을 업로드할 수 있습니다.
          </p>
        </div>
        {isPrimary ? (
          <span className="rounded-full bg-[#e6fffb] px-3 py-1 text-[12px] font-medium text-[#006c63]">
            신청 기준
          </span>
        ) : null}
      </div>

      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[14px] bg-[#f8fafc]">
          {certificate.previewUrl ? (
            <div className="h-[220px] border border-black/5 bg-gray-100">
              <img
                src={certificate.previewUrl}
                alt="자격증 미리보기"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <label className="flex h-[220px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-black/15 bg-white text-center transition-all hover:border-[#009689] hover:bg-[#f0fffe]">
              <Upload className="mb-4 h-8 w-8 text-[#99A1AF]" />
              <p className="text-[14px] tracking-[-0.1504px] text-[#4a5565]">
                클릭하여 자격증 사본 업로드
              </p>
              <p className="mt-1 text-[12px] text-[#99A1AF]">(PDF, JPG, PNG)</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={disabled}
                className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
              />
            </label>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <label className="flex items-center gap-1 text-[13px] font-medium text-[#0a0a0a]">
              자격증 종류
              {isPrimary ? <span className="text-[#fb2c36]">*</span> : null}
            </label>
            <input
              type="text"
              value={certificate.type}
              onChange={(event) => handleFieldChange("type", event.target.value)}
              placeholder="예: 공인회계사"
              disabled={disabled}
              className="w-full rounded-[8px] bg-[#f3f3f5] px-3 py-2 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#717182] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-1 text-[13px] font-medium text-[#0a0a0a]">
                자격증 번호
                {isPrimary ? <span className="text-[#fb2c36]">*</span> : null}
              </label>
              <input
                type="text"
                value={certificate.number}
                onChange={(event) =>
                  handleFieldChange("number", event.target.value)
                }
                placeholder="자격증 번호"
                disabled={disabled}
                className="w-full rounded-[8px] bg-[#f3f3f5] px-3 py-2 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#717182] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1 text-[13px] font-medium text-[#0a0a0a]">
                발급일
                {isPrimary ? <span className="text-[#fb2c36]">*</span> : null}
              </label>
              <input
                type="date"
                value={certificate.issueDate}
                onChange={(event) =>
                  handleFieldChange("issueDate", event.target.value)
                }
                disabled={disabled}
                className="w-full rounded-[8px] bg-[#f3f3f5] px-3 py-2 text-[14px] text-[#0a0a0a] outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[#0a0a0a]">
              성명
            </label>
            <input
              type="text"
              value={certificate.name}
              onChange={(event) => handleFieldChange("name", event.target.value)}
              placeholder="성명"
              disabled={disabled}
              className="w-full rounded-[8px] bg-[#f3f3f5] px-3 py-2 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#717182] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
