import { useState, type FormEvent, type ReactNode } from "react";
import { HelpCircle } from "lucide-react"; 
import Cookies from "js-cookie";
import { toast } from "sonner";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { userInstance } from "../../../../api/instance";

import { tabGuides } from "./createProjectConfig";
import type {
  ConstructionLicenseData,
  ConstructionOtherData,
  ConstructionSurveyData,
  CurrentIndustryType,
} from "./types";

// --- 🤖 백엔드 API 규격 변환 맵핑 ---
const INDUSTRY_MAP: Record<string, string> = { construction: "CONSTRUCTION", electrical: "ELECTRICAL" };
const PURPOSE_MAP: Record<string, string> = { license: "REQUIRED_LICENSE", periodic: "PERIODIC_REPORT", survey: "SURVEY", other: "OTHER" };
const OWNER_TYPE_MAP: Record<string, string> = { corporation: "CORPORATION", individual: "INDIVIDUAL", startup: "STARTUP" };
const STATUS_MAP: Record<string, string> = { construction: "CONSTRUCTION_RELATED", nonConstruction: "NON_CONSTRUCTION_RELATED", none: "NONE" };
const REASON_MAP: Record<string, string> = { capital: "CAPITAL_CHANGE", transfer: "TRANSFER", merger: "MERGER", other_manual: "OTHER" };

const choiceButtonActiveClass = "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]";

// --- 헬퍼 컴포넌트: LabelGuide (원본 100% 복구) ---
function LabelGuide({ guide }: { guide?: { title: string; items: string[] } }) {
  if (!guide) return null;
  return (
    <div className="group relative flex items-center">
      <HelpCircle className="w-4 h-4 text-gray-400 cursor-help hover:text-[#009689] transition-colors" />
      <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50 w-72 p-4 bg-white border border-gray-200 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
        <p className="text-sm font-bold text-[#009689] mb-2">{guide.title}</p>
        <ul className="space-y-1">
          {guide.items.map((item, i) => (
            <li key={i} className="text-xs text-gray-600 flex gap-1.5 leading-relaxed">
              <span className="text-[#009689]">•</span> {item}
            </li>
          ))}
        </ul>
        <div className="absolute -top-1 left-2 w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45" />
      </div>
    </div>
  );
}

// --- 공통 UI: ChoiceButtonGroup ---
function ChoiceButtonGroup<TValue extends string>({ columnsClassName, options, value, onChange }: any) {
  return (
    <div className={`grid gap-3 ${columnsClassName}`}>
      {options.map((option: any) => (
        <Button
          key={option.value}
          type="button"
          variant="outline"
          className={`h-auto py-4 ${value === option.value ? choiceButtonActiveClass : "hover:bg-gray-50"}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

// --- 공통 UI: FormSection ---
function FormSection({ children, label, guide }: { children: ReactNode; label: string; guide?: any }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-base font-semibold">{label} <span className="text-red-500">*</span></Label>
        <LabelGuide guide={guide} />
      </div>
      {children}
    </div>
  );
}

// --- 공통 UI: AssetScaleField (단위 및 예시문구 복구) ---
function AssetScaleField({ id, value, onChange, disabled, labelSuffix, disabledMessage, guide }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-base font-semibold">자산 규모 {labelSuffix} <span className="text-red-500">*</span></Label>
        <LabelGuide guide={guide} />
      </div>
      <div className="flex items-center gap-3 max-w-md">
        <Input id={id} type="number" placeholder="숫자만 입력" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} required={!disabled} className="text-base py-6" />
        <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">억원</span>
      </div>
      {disabled ? (
        <p className="text-sm text-amber-600">{disabledMessage ?? "현재 조건에서는 자산 규모를 입력할 수 없습니다."}</p>
      ) : (
        <p className="text-sm text-gray-500">현재 보유하고 있는 자산 규모를 입력해주세요 (예: 10억원 → 10 입력)</p>
      )}
    </div>
  );
}

// --- 1. 필요 면허 의뢰 폼 ---
export function LicenseRequestForm({ data, onChange, onSubmit }: any) {
  const guide = tabGuides.license;
  const updateField = (field: string, value: any) => onChange({ ...data, [field]: value });
  const selectCurrentIndustryType = (type: CurrentIndustryType) => {
    onChange({ ...data, currentIndustryType: type, currentIndustryDetail: type === "none" ? "" : data.currentIndustryDetail, assetScale: type === "none" ? "" : data.assetScale });
  };
  const isStartup = data.businessType === "startup";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형" guide={guide}>
        <ChoiceButtonGroup columnsClassName="grid-cols-3" options={[{label:"법인 사업자", value:"corporation"}, {label:"개인 사업자", value:"individual"}, {label:"창업 예정", value:"startup"}]} value={data.businessType} onChange={(v:any) => updateField("businessType", v)} />
      </FormSection>
      <FormSection label="구분" guide={guide}>
        <ChoiceButtonGroup columnsClassName="grid-cols-2 max-w-md" options={[{label:"신규", value:"new"}, {label:"추가", value:"additional"}]} value={data.classification} onChange={(v:any) => updateField("classification", v)} />
      </FormSection>
      <div className="border-t pt-6" />
      <FormSection label="필요 면허" guide={guide}>
        <Input placeholder="필요한 면허를 입력합니다." value={data.requiredLicense} onChange={(e) => updateField("requiredLicense", e.target.value)} className="text-base py-6" required />
        <p className="text-sm text-gray-500">예: 건설업 일반건설업(토목공사업), 전문건설업(실내건축공사업) 등</p>
      </FormSection>
      <div className="border-t pt-6" />
      <FormSection label="현재 업종" guide={guide}>
        {isStartup && <p className="text-sm text-amber-600 mb-3">창업 예정 사업자는 자동으로 "없음"이 선택됩니다.</p>}
        <div className="space-y-3">
          <CurrentIndustryOption active={data.currentIndustryType === "construction"} disabled={isStartup} label="건설업 관련" onSelect={() => selectCurrentIndustryType("construction")}>
            <Input placeholder="상세 내용을 입력해주세요 (예: 토목공사업)" value={data.currentIndustryDetail} onChange={(e) => updateField("currentIndustryDetail", e.target.value)} className="mt-2" required />
          </CurrentIndustryOption>
          <CurrentIndustryOption active={data.currentIndustryType === "nonConstruction"} disabled={isStartup} label="비 건설업 관련" onSelect={() => selectCurrentIndustryType("nonConstruction")}>
            <Input placeholder="상세 내용을 입력해주세요 (예: 제조업, 서비스업 등)" value={data.currentIndustryDetail} onChange={(e) => updateField("currentIndustryDetail", e.target.value)} className="mt-2" required />
          </CurrentIndustryOption>
          <CurrentIndustryOption active={data.currentIndustryType === "none"} helperText="창업 예정은 '없음'을 선택해주세요." label="없음" onSelect={() => selectCurrentIndustryType("none")} />
        </div>
      </FormSection>
      <div className="border-t pt-6" />
      <AssetScaleField id="assetScale" value={data.assetScale} onChange={(v:any) => updateField("assetScale", v)} disabled={data.currentIndustryType === "none"} guide={guide} />
      <div className="pt-6 border-t"><Button type="submit" className="w-full h-14 text-lg bg-[#009689] hover:bg-[#007d71]">등록하기</Button></div>
    </form>
  );
}

// --- 2. 주기적 신고 폼 ---
export function PeriodicReportForm({ data, onChange, onSubmit }: any) {
  const guide = tabGuides.periodic;
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형" guide={guide}><ChoiceButtonGroup columnsClassName="grid-cols-2 max-w-md" options={[{label:"법인 사업자", value:"corporation"}, {label:"개인 사업자", value:"individual"}]} value={data.businessType} onChange={(v:any) => onChange({ ...data, businessType: v })} /></FormSection>
      <div className="border-t pt-6" /><AssetScaleField id="periodicAssetScale" value={data.assetScale} onChange={(v:any) => onChange({ ...data, assetScale: v })} guide={guide} />
      <div className="pt-6 border-t"><Button type="submit" className="w-full h-14 text-lg bg-[#009689] hover:bg-[#007d71]">등록하기</Button></div>
    </form>
  );
}

// --- 3. 실태 조사 의뢰 폼 ---
export function SurveyRequestForm({ data, onChange, onSubmit }: any) {
  const guide = tabGuides.survey;
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형" guide={guide}><ChoiceButtonGroup columnsClassName="grid-cols-2 max-w-md" options={[{label:"법인 사업자", value:"corporation"}, {label:"개인 사업자", value:"individual"}]} value={data.businessType} onChange={(v:any) => onChange({ ...data, businessType: v })} /></FormSection>
      <div className="border-t pt-6" /><FormSection label="보유 면허" guide={guide}><Input placeholder="현재 보유하고 있는 면허를 입력해주세요" value={data.currentLicense} onChange={(e) => onChange({ ...data, currentLicense: e.target.value })} className="text-base py-6" required /></FormSection>
      <div className="border-t pt-6" /><AssetScaleField id="surveyAssetScale" value={data.assetScale} onChange={(v:any) => onChange({ ...data, assetScale: v })} guide={guide} />
      <div className="pt-6 border-t"><Button type="submit" className="w-full h-14 text-lg bg-[#009689] hover:bg-[#007d71]">등록하기</Button></div>
    </form>
  );
}

// --- 4. 기타 서비스 의뢰 폼 ---
export function OtherRequestForm({ data, industry, onChange, onSubmit }: any) {
  const guide = tabGuides.other;
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형" guide={guide}><ChoiceButtonGroup columnsClassName="grid-cols-2 max-w-md" options={[{label:"법인 사업자", value:"corporation"}, {label:"개인 사업자", value:"individual"}]} value={data.businessType} onChange={(v:any) => onChange({ ...data, businessType: v })} /></FormSection>
      <div className="border-t pt-6" />
      <FormSection label="진단 사유" guide={guide}>
        <ChoiceButtonGroup columnsClassName="grid-cols-4" options={[{label:"자본금 변동", value:"capital"}, {label:"양도", value:"transfer"}, {label:"합병", value:"merger"}, {label:"기타", value:"other_manual"}]} value={data.reason} onChange={(v:any) => onChange({ ...data, reason: v })} />
        {data.reason === "other_manual" && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium text-gray-600 mb-2 block">진단 사유 직접 입력</Label>
            <Input placeholder="상세 사유를 입력해주세요" value={(data as any).customReason || ""} onChange={(e) => onChange({ ...data, customReason: e.target.value } as any)} className="text-base py-6 border-[#009689]" required />
          </div>
        )}
      </FormSection>
      <div className="border-t pt-6" /><AssetScaleField id="otherAssetScale" labelSuffix={industry !== "construction" ? "(증자 이전) " : ""} value={data.assetScale} onChange={(v:any) => onChange({ ...data, assetScale: v })} guide={guide} />
      <div className="pt-6 border-t"><Button type="submit" className="w-full h-14 text-lg bg-[#009689] hover:bg-[#007d71]">등록하기</Button></div>
    </form>
  );
}

// --- 5. 최종 게시 확인 폼 ---
export function BaseProjectForm({ activeTab, industry, detailData, onCancel, onSubmit }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFinalSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const payload = {
      clientInfoId: Number(Cookies.get("CLIENT_INFO_ID") ?? 0),
      industry: INDUSTRY_MAP[industry] || industry.toUpperCase(),
      purpose: PURPOSE_MAP[activeTab] || activeTab.toUpperCase(),
      businessOwnerType: OWNER_TYPE_MAP[detailData.businessType],
      assetSize: Number(detailData.assetScale) || 0,
      category: detailData.classification?.toUpperCase(),
      requiredLicense: detailData.requiredLicense || null,
      currentIndustryStatus: STATUS_MAP[detailData.currentIndustryType] || null,
      currentIndustryDetail: detailData.currentIndustryDetail || null,
      heldLicense: detailData.currentLicense || null,
      diagnosisReason: REASON_MAP[detailData.reason] || null,
      diagnosisReasonDetail: detailData.customReason || null,
    };
    try {
      const res = await userInstance.post(Cookies.get("ACCESS_TOKEN") ? "/announcements" : "/announcements/guest", payload);
      if (res.data.success) onSubmit(String(res.data.data.announcement_code || res.data.data.id));
    } catch (err: any) { toast.error("게시 실패"); } finally { setIsSubmitting(false); }
  };

  return (
    <div className="py-10 text-center animate-in fade-in duration-500">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-50 rounded-full mb-6">
        <HelpCircle className="w-8 h-8 text-[#009689]" />
      </div>
      <h2 className="text-2xl font-bold mb-2">공고 작성을 완료할까요?</h2>
      <p className="text-gray-500 mb-10">입력하신 정보를 바탕으로 전문가 의뢰 공고가 게시됩니다.</p>
      <form onSubmit={handleFinalSubmit} className="flex gap-4 max-w-sm mx-auto">
        <Button type="submit" className="flex-1 h-14 bg-[#009689] hover:bg-[#007d71] text-lg font-bold" disabled={isSubmitting}>네, 게시하기</Button>
        <Button type="button" variant="outline" className="flex-1 h-14 text-lg" onClick={onCancel}>수정하기</Button>
      </form>
    </div>
  );
}

// --- 공통 서브 컴포넌트 ---
function CurrentIndustryOption({ active, children, disabled, helperText, label, onSelect }: any) {
  return (
    <div className={`border-2 rounded-lg p-4 transition-all ${active ? "border-[#009689] bg-teal-50" : "border-gray-200"} ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" className={active ? choiceButtonActiveClass : ""} onClick={onSelect} disabled={disabled}>{label}</Button>
        {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
      {active && children}
    </div>
  );
}