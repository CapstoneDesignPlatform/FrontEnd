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
      <div className="space-y-2">
        <label className="flex items-center gap-1 text-[14px] font-medium tracking-[-0.1504px] text-[#0a0a0a]">
          업체명
          <span className="text-[#fb2c36]">*</span>
        </label>
        <input
          type="text"
          value={career.companyName}
          onChange={(event) =>
            handleFieldChange("companyName", event.target.value)
          }
          placeholder="업체명"
          disabled={disabled}
          className="w-full rounded-[8px] bg-[#f3f3f5] px-3 py-2 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#717182] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[14px] font-medium tracking-[-0.1504px] text-[#0a0a0a]">
          포트폴리오 / 실적
        </label>
        <textarea
          value={career.portfolio}
          onChange={(event) =>
            handleFieldChange("portfolio", event.target.value)
          }
          placeholder="주요 의뢰나 실적을 입력해주세요."
          rows={4}
          disabled={disabled}
          className="w-full resize-none rounded-[8px] bg-[#f3f3f5] px-3 py-2 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#717182] disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </div>
  );
}
