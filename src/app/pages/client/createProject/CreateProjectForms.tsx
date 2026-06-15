import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { userInstance } from "../../../../api/instance";

import { tabGuides, industries } from "./createProjectConfig";
import type { CurrentIndustryType } from "./types";

// ─── 백엔드 API 규격 변환 맵핑 ───────────────────────────────────────────────
const INDUSTRY_MAP: Record<string, string> = { construction: "CONSTRUCTION", electrical: "ELECTRICAL" };
const PURPOSE_MAP:  Record<string, string> = { license: "REQUIRED_LICENSE", periodic: "PERIODIC_REPORT", survey: "SURVEY", other: "OTHER" };
const OWNER_TYPE_MAP: Record<string, string> = { corporation: "CORPORATION", individual: "INDIVIDUAL", startup: "STARTUP" };
const STATUS_MAP:   Record<string, string> = { construction: "CONSTRUCTION_RELATED", nonConstruction: "NON_CONSTRUCTION_RELATED", none: "NONE" };
const REASON_MAP:   Record<string, string> = { capital: "CAPITAL_CHANGE", transfer: "TRANSFER", merger: "MERGER", other_manual: "OTHER" };

const PURPOSES = [
  { label: "필요면허", value: "license"  },
  { label: "실태조사", value: "survey"   },
  { label: "기타",     value: "other"    },
];

const ACTIVE = "bg-[#34499C] text-white border-[#34499C] hover:bg-[#2a3d84]";

// ─── 공통 헬퍼 컴포넌트 ──────────────────────────────────────────────────────

function LabelGuide({ guide }: { guide?: { title: string; items: string[] } }) {
  if (!guide) return null;
  return (
    <div className="group relative flex items-center">
      <HelpCircle className="w-4 h-4 text-gray-400 cursor-help hover:text-[#34499C] transition-colors" />
      <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50 w-72 p-4 bg-white border border-gray-200 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
        <p className="text-sm font-bold text-[#34499C] mb-2">{guide.title}</p>
        <ul className="space-y-1">
          {guide.items.map((item, i) => (
            <li key={i} className="text-xs text-gray-600 flex gap-1.5 leading-relaxed">
              <span className="text-[#34499C]">•</span> {item}
            </li>
          ))}
        </ul>
        <div className="absolute -top-1 left-2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45" />
      </div>
    </div>
  );
}

function ChoiceButtonGroup({ columnsClassName, options, value, onChange }: any) {
  return (
    <div className={`grid gap-3 ${columnsClassName}`}>
      {options.map((opt: any) => (
        <Button
          key={opt.value}
          type="button"
          variant="outline"
          className={`h-auto py-4 ${value === opt.value ? ACTIVE : "hover:bg-gray-50"}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

function FormSection({ children, label, guide }: { children: ReactNode; label: string; guide?: any }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-base font-semibold">
          {label} <span className="text-red-500">*</span>
        </Label>
        <LabelGuide guide={guide} />
      </div>
      {children}
    </div>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{title}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function AssetScaleField({ id, value, onChange, disabled, labelSuffix, guide }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-base font-semibold">
          자산 규모 {labelSuffix}<span className="text-red-500">*</span>
        </Label>
        <LabelGuide guide={guide} />
      </div>
      <div className="flex items-center gap-3 max-w-md">
        <Input
          id={id}
          type="number"
          placeholder="숫자만 입력"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={!disabled}
          className="text-base py-6 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">억원</span>
      </div>
      {disabled
        ? <p className="text-sm text-amber-600">현재 조건에서는 자산 규모를 입력할 수 없습니다.</p>
        : <p className="text-sm text-gray-500">현재 보유하고 있는 자산 규모를 입력해주세요 (예: 10억원 → 10 입력)</p>
      }
    </div>
  );
}

function CurrentIndustryOption({ active, children, disabled, helperText, label, onSelect }: any) {
  return (
    <div className={`border-2 rounded-lg p-4 transition-all ${active ? "border-[#34499C] bg-blue-50" : "border-gray-200"} ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" className={active ? ACTIVE : ""} onClick={onSelect} disabled={disabled}>
          {label}
        </Button>
        {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
      {active && children}
    </div>
  );
}

// ─── 목적별 세부 필드 ─────────────────────────────────────────────────────────

function LicenseFields({ data, onChange }: any) {
  const guide = tabGuides.license;
  const set = (field: string, value: any) => onChange({ ...data, [field]: value });
  const setIndustryType = (type: CurrentIndustryType) =>
    onChange({ ...data, currentIndustryType: type, currentIndustryDetail: type === "none" ? "" : data.currentIndustryDetail, assetScale: type === "none" ? "" : data.assetScale });
  const isStartup = data.businessType === "startup";

  return (
    <>
      <FormSection label="구분" guide={guide}>
        <ChoiceButtonGroup
          columnsClassName="grid-cols-2 max-w-md"
          options={[{ label: "신규", value: "new" }, { label: "추가", value: "additional" }]}
          value={data.classification}
          onChange={(v: any) => set("classification", v)}
        />
      </FormSection>

      <SectionDivider title="면허 정보" />

      <FormSection label="필요 면허" guide={guide}>
        <Input placeholder="필요한 면허를 입력합니다." value={data.requiredLicense} onChange={(e) => set("requiredLicense", e.target.value)} className="text-base py-6" required />
        <p className="text-sm text-gray-500">예: 건설업 일반건설업(토목공사업), 전문건설업(실내건축공사업) 등</p>
      </FormSection>

      <FormSection label="현재 업종" guide={guide}>
        {isStartup && <p className="text-sm text-amber-600 mb-3">창업 예정 사업자는 자동으로 "없음"이 선택됩니다.</p>}
        <div className="space-y-3">
          <CurrentIndustryOption active={data.currentIndustryType === "construction"} disabled={isStartup} label="건설업 관련" onSelect={() => setIndustryType("construction")}>
            <Input placeholder="현재 보유하시고 계신 면허를 입력해주세요 (예: 토목공사업)" value={data.currentIndustryDetail} onChange={(e) => set("currentIndustryDetail", e.target.value)} className="mt-2" required />
          </CurrentIndustryOption>
          <CurrentIndustryOption active={data.currentIndustryType === "nonConstruction"} disabled={isStartup} label="비 건설업 관련" onSelect={() => setIndustryType("nonConstruction")}>
            <Input placeholder="상세 내용을 입력해주세요 (예: 제조업, 서비스업 등)" value={data.currentIndustryDetail} onChange={(e) => set("currentIndustryDetail", e.target.value)} className="mt-2" required />
          </CurrentIndustryOption>
          <CurrentIndustryOption active={data.currentIndustryType === "none"} helperText="창업 예정은 '없음'을 선택해주세요." label="없음" onSelect={() => setIndustryType("none")} />
        </div>
      </FormSection>

      <AssetScaleField id="licenseAsset" value={data.assetScale} onChange={(v: any) => set("assetScale", v)} disabled={data.currentIndustryType === "none"} guide={guide} />
    </>
  );
}

function PeriodicFields({ data, onChange }: any) {
  return (
    <AssetScaleField id="periodicAsset" value={data.assetScale} onChange={(v: any) => onChange({ ...data, assetScale: v })} guide={tabGuides.periodic} />
  );
}

function SurveyFields({ data, onChange }: any) {
  const guide = tabGuides.survey;
  return (
    <>
      <FormSection label="보유 면허" guide={guide}>
        <Input placeholder="현재 보유하고 있는 면허를 입력해주세요" value={data.currentLicense} onChange={(e) => onChange({ ...data, currentLicense: e.target.value })} className="text-base py-6" required />
      </FormSection>
      <AssetScaleField id="surveyAsset" value={data.assetScale} onChange={(v: any) => onChange({ ...data, assetScale: v })} guide={guide} />
    </>
  );
}

function OtherFields({ data, industry, onChange }: any) {
  const guide = tabGuides.other;
  return (
    <>
      <FormSection label="진단 사유" guide={guide}>
        <ChoiceButtonGroup
          columnsClassName="grid-cols-4"
          options={[{ label: "자본금 변동", value: "capital" }, { label: "양도", value: "transfer" }, { label: "합병", value: "merger" }, { label: "기타", value: "other_manual" }]}
          value={data.reason}
          onChange={(v: any) => onChange({ ...data, reason: v })}
        />
        {data.reason === "other_manual" && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium text-gray-600 mb-2 block">진단 사유 직접 입력</Label>
            <Input
              placeholder="상세 사유를 입력해주세요"
              value={data.customReason || ""}
              onChange={(e) => onChange({ ...data, customReason: e.target.value })}
              className="text-base py-6 border-[#34499C]"
              required
            />
          </div>
        )}
      </FormSection>
      <AssetScaleField
        id="otherAsset"
        labelSuffix={industry !== "construction" ? "(증자 이전) " : ""}
        value={data.assetScale}
        onChange={(v: any) => onChange({ ...data, assetScale: v })}
        guide={guide}
      />
    </>
  );
}

// ─── 초기 폼 데이터 ───────────────────────────────────────────────────────────

const defaultFormData = {
  businessType:         "",
  classification:       "",
  requiredLicense:      "",
  currentIndustryType:  "" as CurrentIndustryType,
  currentIndustryDetail:"",
  assetScale:           "",
  currentLicense:       "",
  reason:               "",
  customReason:         "",
};

// ─── 메인 페이지 (단일 폼) ────────────────────────────────────────────────────

export function CreateProject() {
  const navigate = useNavigate();
  const [industry, setIndustry]   = useState("");
  const [purpose,  setPurpose]    = useState("");
  const [formData, setFormData]   = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 업종·목적 바뀌면 세부 필드 초기화
  const handleIndustryChange = (v: string) => { setIndustry(v); setFormData(defaultFormData); };
  const handlePurposeChange  = (v: string) => { setPurpose(v);  setFormData(defaultFormData); };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!industry || !purpose || isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      clientInfoId:          Number(Cookies.get("CLIENT_INFO_ID") ?? 0),
      industry:              INDUSTRY_MAP[industry] || industry.toUpperCase(),
      purpose:               PURPOSE_MAP[purpose]   || purpose.toUpperCase(),
      businessOwnerType:     OWNER_TYPE_MAP[formData.businessType],
      assetSize:             Number(formData.assetScale) || 0,
      category:              formData.classification?.toUpperCase() || null,
      requiredLicense:       formData.requiredLicense       || null,
      currentIndustryStatus: STATUS_MAP[formData.currentIndustryType] || null,
      currentIndustryDetail: formData.currentIndustryDetail || null,
      heldLicense:           formData.currentLicense        || null,
      diagnosisReason:       REASON_MAP[formData.reason]    || null,
      diagnosisReasonDetail: formData.customReason          || null,
    };

    try {
      const res = await userInstance.post(
        Cookies.get("ACCESS_TOKEN") ? "/announcements" : "/announcements/guest",
        payload
      );
      if (res.data.success) {
        const code = String(res.data.data.announcement_code || res.data.data.id);
        navigate(`/client/project-success/${code}`);
      }
    } catch {
      toast.error("게시 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDetailFields = () => {
    if (!purpose) return null;
    const props = { data: formData, onChange: setFormData };
    switch (purpose) {
      case "license":  return <LicenseFields  {...props} />;
      case "periodic": return <PeriodicFields {...props} />;
      case "survey":   return <SurveyFields   {...props} />;
      case "other":    return <OtherFields    {...props} industry={industry} />;
      default:         return null;
    }
  };

  const detailFields = renderDetailFields();

  return (
    <div className="max-w-100xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">의뢰 등록</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

        {/* 업종 선택 */}
        <FormSection label="업종">
          <ChoiceButtonGroup
            columnsClassName="grid-cols-2"
            options={industries}
            value={industry}
            onChange={handleIndustryChange}
          />
        </FormSection>

        <SectionDivider title="의뢰 목적" />

        {/* 의뢰 목적 */}
        <FormSection label="목적">
          <ChoiceButtonGroup
            columnsClassName="grid-cols-3"
            options={PURPOSES}
            value={purpose}
            onChange={handlePurposeChange}
          />
        </FormSection>

        {/* 목적에 따른 세부 필드 */}
        {detailFields && (
          <>
            <SectionDivider title="상세 정보" />

            {/* 사업자 유형 — 모든 목적에 공통 */}
            <FormSection label="사업자 유형">
              <ChoiceButtonGroup
                columnsClassName={purpose === "license" ? "grid-cols-3" : "grid-cols-2 max-w-md"}
                options={
                  purpose === "license"
                    ? [{ label: "법인 사업자", value: "corporation" }, { label: "개인 사업자", value: "individual" }, { label: "창업 예정", value: "startup" }]
                    : [{ label: "법인 사업자", value: "corporation" }, { label: "개인 사업자", value: "individual" }]
                }
                value={formData.businessType}
                onChange={(v: any) => setFormData({ ...formData, businessType: v })}
              />
            </FormSection>

            {detailFields}
          </>
        )}

        {/* 제출 버튼 */}
        <div className="pt-2 border-t">
          <Button
            type="submit"
            disabled={!industry || !purpose || isSubmitting}
            className="w-full h-14 text-lg bg-[#34499C] hover:bg-[#2a3d84] disabled:opacity-40"
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}