import { Upload } from "lucide-react";

import type { VerificationBusinessLicenseData } from "./types";

interface BusinessLicenseCardProps {
  license: VerificationBusinessLicenseData;
  disabled?: boolean;
  onChange: (data: VerificationBusinessLicenseData) => void;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string) ?? "");
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function BusinessLicenseCard({
  license,
  disabled = false,
  onChange,
}: BusinessLicenseCardProps) {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = await readFileAsDataUrl(file);
    onChange({
      ...license,
      file,
      previewUrl,
    });
  };

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
    <div className="rounded-[14px] border border-black/10 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
      <div className="mb-4 space-y-1">
        <p className="text-[14px] font-medium tracking-[-0.1504px] text-[#0a0a0a]">
          사업자 등록증
        </p>
        <p className="text-[12px] tracking-[-0.12px] text-[#717182]">
          등록증 이미지는 제출 검증용으로만 사용됩니다.
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[14px] bg-[#f8fafc]">
          {license.previewUrl ? (
            <div className="h-[220px] border border-black/5 bg-gray-100">
              <img
                src={license.previewUrl}
                alt="사업자 등록증 미리보기"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <label className="flex h-[220px] cursor-pointer flex-col items-center justify-center border-2 border-dashed border-black/15 bg-white text-center transition-all hover:border-[#009689] hover:bg-[#f0fffe]">
              <Upload className="mb-4 h-8 w-8 text-[#99A1AF]" />
              <p className="text-[14px] tracking-[-0.1504px] text-[#4a5565]">
                클릭하여 사업자 등록증 업로드
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

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[#0a0a0a]">
              사업자 번호
            </label>
            <input
              type="text"
              value={license.businessNumber}
              onChange={(event) =>
                handleFieldChange("businessNumber", event.target.value)
              }
              placeholder="123-45-67890"
              disabled={disabled}
              className="w-full rounded-[8px] bg-[#f3f3f5] px-3 py-2 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#717182] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[#0a0a0a]">
              성명
            </label>
            <input
              type="text"
              value={license.name}
              onChange={(event) => handleFieldChange("name", event.target.value)}
              placeholder="성명"
              disabled={disabled}
              className="w-full rounded-[8px] bg-[#f3f3f5] px-3 py-2 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#717182] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-[#0a0a0a]">
              상호
            </label>
            <input
              type="text"
              value={license.companyName}
              onChange={(event) =>
                handleFieldChange("companyName", event.target.value)
              }
              placeholder="업체명"
              disabled={disabled}
              className="w-full rounded-[8px] bg-[#f3f3f5] px-3 py-2 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#717182] disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
