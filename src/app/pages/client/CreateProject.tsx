import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { userInstance } from "../../../api/instance";

import {
  tabGuides,
  fieldGuides,
  industries,
  initialConstructionLicenseData,
  initialConstructionSurveyData,
  initialConstructionOtherData,
  initialElectricalPeriodicData,
  getVisibleTabs,
  projectTabLabels,
} from "./createProject/createProjectConfig";

import type {
  BusinessType,
  ConstructionLicenseData,
  ConstructionOtherData,
  ConstructionSurveyData,
  CurrentIndustryType,
  ElectricalPeriodicData,
  ProjectTab,
} from "./createProject/types";

// ─── 백엔드 API 규격 변환 맵핑 ───────────────────────────────────────────────
const INDUSTRY_MAP: Record<string, string> = { construction: "CONSTRUCTION", electrical: "ELECTRICAL" };
const PURPOSE_MAP:  Record<string, string> = { license: "REQUIRED_LICENSE", periodic: "PERIODIC_REPORT", survey: "SURVEY", other: "OTHER" };
const OWNER_TYPE_MAP: Record<string, string> = { corporation: "CORPORATION", individual: "INDIVIDUAL", startup: "STARTUP" };
const STATUS_MAP:   Record<string, string> = { construction: "CONSTRUCTION_RELATED", nonConstruction: "NON_CONSTRUCTION_RELATED", none: "NONE" };
const REASON_MAP:   Record<string, string> = { capital: "CAPITAL_CHANGE", transfer: "TRANSFER", merger: "MERGER", other_manual: "OTHER" };

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

function ChoiceButtonGroup({ columnsClassName, options, value, onChange }: {
  columnsClassName: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={`grid gap-3 ${columnsClassName}`}>
      {options.map((opt) => (
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

function FormSection({ children, label, guide }: { children: ReactNode; label: string; guide?: { title: string; items: string[] } }) {
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
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-gray-200" />
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{title}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function formatNumber(v: string): string {
  const num = v.replace(/[^0-9]/g, "");
  if (!num) return "";
  return Number(num).toLocaleString("ko-KR");
}

function parseNumber(v: string): string {
  return v.replace(/[^0-9]/g, "");
}

function AssetScaleField({ id, value, onChange, labelSuffix, guide, capitalId, capitalValue, capitalOnChange, capitalOptional }: {
  id: string; value: string; onChange: (v: string) => void;
  labelSuffix?: string;
  guide?: { title: string; items: string[] };
  capitalId: string; capitalValue: string; capitalOnChange: (v: string) => void;
  capitalOptional?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex gap-8">
        {/* 자본금 */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={id} className="text-base font-semibold">
              자본금{labelSuffix ? ` ${labelSuffix}` : ""} <span className="text-red-500">*</span>
            </Label>
            <LabelGuide guide={guide} />
          </div>
          <div className="flex items-center gap-3">
            <Input id={id} type="text" inputMode="numeric" placeholder="숫자만 입력"
              value={formatNumber(value)}
              onChange={(e) => onChange(parseNumber(e.target.value))} required
              className="text-base py-6" />
            <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">억원</span>
          </div>
          <p className="text-sm text-gray-500">현재 납입된 자본금을 입력해주세요</p>
        </div>

        {/* 자본 규모 */}
        <div className="flex-1 space-y-2">
          <Label htmlFor={capitalId} className={`text-base font-semibold ${capitalOptional ? "text-gray-400" : ""}`}>
            자본 규모 {!capitalOptional && <span className="text-red-500">*</span>}
          </Label>
          <div className="flex items-center gap-3">
            <Input id={capitalId} type="text" inputMode="numeric" placeholder="숫자만 입력"
              value={capitalOptional ? "" : formatNumber(capitalValue)}
              onChange={(e) => capitalOnChange(parseNumber(e.target.value))}
              disabled={capitalOptional} required={!capitalOptional}
              className="text-base py-6" />
            <span className={`text-lg font-semibold whitespace-nowrap ${capitalOptional ? "text-gray-400" : "text-gray-700"}`}>억원</span>
          </div>
          {capitalOptional
            ? <p className="text-sm text-gray-400">* 현재 업종이 없는 경우에는 자본규모를 작성할 필요가 없습니다.</p>
            : <p className="text-sm text-gray-500">현재 보유하고 있는 자본 규모를 입력해주세요</p>
          }
        </div>
      </div>
    </div>
  );
}

function CurrentIndustryOption({ active, children, disabled, helperText, label, onSelect }: {
  active: boolean; children?: ReactNode; disabled?: boolean;
  helperText?: string; label: string; onSelect: () => void;
}) {
  return (
    <div className={`border-2 rounded-lg p-4 transition-all
      ${active ? "border-[#34499C] bg-blue-50" : "border-gray-200"}
      ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
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

function LicenseFields({ data, onChange }: { data: ConstructionLicenseData; onChange: (d: ConstructionLicenseData) => void }) {
  const guide = tabGuides.license;
  const set = <K extends keyof ConstructionLicenseData>(k: K, v: ConstructionLicenseData[K]) =>
    onChange({ ...data, [k]: v });
  const setIndustryType = (type: CurrentIndustryType) =>
    onChange({ ...data, currentIndustryType: type, currentIndustryDetail: type === "none" ? "" : data.currentIndustryDetail });
  const isStartup = data.businessType === "startup";

  return (
    <>
      <FormSection label="구분" guide={guide}>
        <ChoiceButtonGroup
          columnsClassName="grid-cols-2 max-w-md"
          options={[{ label: "신규", value: "new" }, { label: "추가", value: "additional" }]}
          value={data.classification}
          onChange={(v) => set("classification", v as "new" | "additional")}
        />
      </FormSection>

      <SectionDivider title="면허 정보" />

      <FormSection label="필요 면허" guide={guide}>
        <Input placeholder="필요한 면허를 입력합니다." value={data.requiredLicense}
          onChange={(e) => set("requiredLicense", e.target.value)} className="text-base py-6" required />
        <p className="text-sm text-gray-500">예: 건설업 일반건설업(토목공사업), 전문건설업(실내건축공사업) 등</p>
      </FormSection>

      <FormSection label="현재 업종" guide={guide}>
        {isStartup && <p className="text-sm text-amber-600 mb-3">창업 예정 사업자는 자동으로 "없음"이 선택됩니다.</p>}
        <div className="space-y-3">
          <CurrentIndustryOption active={data.currentIndustryType === "construction"} disabled={isStartup} label="건설업 관련" onSelect={() => setIndustryType("construction")}>
            <Input placeholder="상세 내용을 입력해주세요 (예: 토목공사업)" value={data.currentIndustryDetail}
              onChange={(e) => set("currentIndustryDetail", e.target.value)} className="mt-2" required />
          </CurrentIndustryOption>
          <CurrentIndustryOption active={data.currentIndustryType === "nonConstruction"} disabled={isStartup} label="비 건설업 관련" onSelect={() => setIndustryType("nonConstruction")}>
            <Input placeholder="상세 내용을 입력해주세요 (예: 제조업, 서비스업 등)" value={data.currentIndustryDetail}
              onChange={(e) => set("currentIndustryDetail", e.target.value)} className="mt-2" required />
          </CurrentIndustryOption>
          <CurrentIndustryOption active={data.currentIndustryType === "none"} helperText="창업 예정은 '없음'을 선택해주세요." label="없음" onSelect={() => setIndustryType("none")} />
        </div>
      </FormSection>

      <AssetScaleField id="licenseAsset" value={data.assetScale} onChange={(v) => set("assetScale", v)}
        guide={guide} capitalOptional={isStartup || data.currentIndustryType === "none"}
        capitalId="licenseCapital" capitalValue={data.capitalScale} capitalOnChange={(v) => set("capitalScale", v)} />
    </>
  );
}

function PeriodicFields({ data, onChange }: { data: ElectricalPeriodicData; onChange: (d: ElectricalPeriodicData) => void }) {
  return (
    <AssetScaleField id="periodicAsset" value={data.assetScale}
      onChange={(v) => onChange({ ...data, assetScale: v })} guide={tabGuides.periodic}
      capitalId="periodicCapital" capitalValue={data.capitalScale} capitalOnChange={(v) => onChange({ ...data, capitalScale: v })} />
  );
}

function SurveyFields({ data, onChange }: { data: ConstructionSurveyData; onChange: (d: ConstructionSurveyData) => void }) {
  const guide = tabGuides.survey;
  return (
    <>
      <FormSection label="보유 면허" guide={guide}>
        <Input placeholder="현재 보유하고 있는 면허를 입력해주세요" value={data.currentLicense}
          onChange={(e) => onChange({ ...data, currentLicense: e.target.value })} className="text-base py-6" required />
      </FormSection>
      <AssetScaleField id="surveyAsset" value={data.assetScale}
        onChange={(v) => onChange({ ...data, assetScale: v })} guide={guide}
        capitalId="surveyCapital" capitalValue={data.capitalScale} capitalOnChange={(v) => onChange({ ...data, capitalScale: v })} />
    </>
  );
}

function OtherFields({ data, industry, onChange }: { data: ConstructionOtherData; industry: string; onChange: (d: ConstructionOtherData) => void }) {
  const guide = tabGuides.other;
  return (
    <>
      <FormSection label="진단 사유" guide={guide}>
        <ChoiceButtonGroup
          columnsClassName="grid-cols-4"
          options={[{ label: "자본금 변동", value: "capital" }, { label: "양도", value: "transfer" }, { label: "합병", value: "merger" }, { label: "기타", value: "other_manual" }]}
          value={data.reason}
          onChange={(v) => onChange({ ...data, reason: v as ConstructionOtherData["reason"] })}
        />
        {data.reason === "other_manual" && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <Label className="text-sm font-medium text-gray-600 mb-2 block">진단 사유 직접 입력</Label>
            <Input placeholder="상세 사유를 입력해주세요"
              value={(data as any).customReason || ""}
              onChange={(e) => onChange({ ...data, customReason: e.target.value } as any)}
              className="text-base py-6 border-[#34499C]" required />
          </div>
        )}
      </FormSection>
      <AssetScaleField
        id="otherAsset"
        labelSuffix={industry !== "construction" ? "(증자 이전)" : ""}
        value={data.assetScale}
        onChange={(v) => onChange({ ...data, assetScale: v })}
        guide={guide}
        capitalId="otherCapital" capitalValue={data.capitalScale} capitalOnChange={(v) => onChange({ ...data, capitalScale: v })}
      />
    </>
  );
}

// ─── 목적 탭 버튼 그룹 ───────────────────────────────────────────────────────

function PurposeTabs({ tabs, value, onChange }: {
  tabs: ProjectTab[]; value: ProjectTab | ""; onChange: (t: ProjectTab) => void;
}) {
  return (
    <div className={`grid gap-3 grid-cols-${tabs.length}`}>
      {tabs.map((tab) => (
        <Button
          key={tab}
          type="button"
          variant="outline"
          className={`h-auto py-4 ${value === tab ? ACTIVE : "hover:bg-gray-50"}`}
          onClick={() => onChange(tab)}
        >
          {projectTabLabels[tab]}
        </Button>
      ))}
    </div>
  );
}

// ─── 메인 페이지 (단일 폼) ────────────────────────────────────────────────────

export function CreateProject() {
  const navigate = useNavigate();
  const { industry: industryParam } = useParams<{ industry?: string }>();

  const [industry, setIndustry] = useState(industryParam ?? "");
  const [purpose,  setPurpose]  = useState<ProjectTab | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 목적별 폼 데이터 (타입별로 분리 유지)
  const [licenseData,  setLicenseData]  = useState<ConstructionLicenseData>(initialConstructionLicenseData);
  const [periodicData, setPeriodicData] = useState<ElectricalPeriodicData>(initialElectricalPeriodicData);
  const [surveyData,   setSurveyData]   = useState<ConstructionSurveyData>(initialConstructionSurveyData);
  const [otherData,    setOtherData]    = useState<ConstructionOtherData>(initialConstructionOtherData);

  // URL 파라미터 변경 시 업종 즉시 반영
  useEffect(() => {
    setIndustry(industryParam ?? "");
    setPurpose("");
    setLicenseData(initialConstructionLicenseData);
    setPeriodicData(initialElectricalPeriodicData);
    setSurveyData(initialConstructionSurveyData);
    setOtherData(initialConstructionOtherData);
  }, [industryParam]);

  // 업종 바뀌면 목적·폼 초기화
  const handleIndustryChange = (v: string) => {
    setIndustry(v);
    setPurpose("");
    setLicenseData(initialConstructionLicenseData);
    setPeriodicData(initialElectricalPeriodicData);
    setSurveyData(initialConstructionSurveyData);
    setOtherData(initialConstructionOtherData);
  };

  // 현재 선택된 목적의 사업자 유형
  const getCurrentBusinessType = () => {
    switch (purpose) {
      case "license":  return licenseData.businessType;
      case "periodic": return periodicData.businessType;
      case "survey":   return surveyData.businessType;
      case "other":    return otherData.businessType;
      default:         return "";
    }
  };

  const setCurrentBusinessType = (v: string) => {
    const bv = v as BusinessType;
    if (purpose === "license")  setLicenseData({ ...licenseData, businessType: v as any });
    if (purpose === "periodic") setPeriodicData({ ...periodicData, businessType: bv });
    if (purpose === "survey")   setSurveyData({ ...surveyData, businessType: bv });
    if (purpose === "other")    setOtherData({ ...otherData, businessType: bv });
  };

  const visibleTabs = industry ? getVisibleTabs(industry) : [];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!industry || !purpose || isSubmitting) return;

    // 사업자 유형 필수 검증
    const currentBusinessType = getCurrentBusinessType();
    if (!currentBusinessType) {
      toast.error("사업자 유형을 선택해주세요.");
      return;
    }

    // 회원: clientInfoId 필수 검증
    const clientInfoId = Number(Cookies.get("CLIENT_INFO_ID") ?? 0);
    if (!!Cookies.get("ACCESS_TOKEN") && !clientInfoId) {
      toast.error("기업 정보가 없습니다. 기업 정보를 먼저 등록해주세요.");
      return;
    }

    setIsSubmitting(true);

    const currentData = purpose === "license" ? licenseData
      : purpose === "periodic" ? periodicData
      : purpose === "survey"   ? surveyData
      : otherData;

    const isLoggedIn = !!Cookies.get("ACCESS_TOKEN");

    const payload = {
      clientInfoId,
      industry:              INDUSTRY_MAP[industry] || industry.toUpperCase(),
      purpose:               PURPOSE_MAP[purpose]   || purpose.toUpperCase(),
      businessOwnerType:     OWNER_TYPE_MAP[(currentData as any).businessType] ?? null,
      capital:               Number((currentData as any).capitalScale) || 0,
      capitalScale:          (currentData as any).businessType === "startup" ? null : (Number((currentData as any).assetScale) || 0),
      category:              (currentData as any).classification?.toUpperCase() ?? null,
      requiredLicense:       (currentData as any).requiredLicense       || null,
      currentIndustryStatus: STATUS_MAP[(currentData as any).currentIndustryType] ?? null,
      currentIndustryDetail: (currentData as any).currentIndustryDetail || null,
      heldLicense:           (currentData as any).currentLicense        || null,
      diagnosisReason:       REASON_MAP[(currentData as any).reason]    ?? null,
      diagnosisReasonDetail: (currentData as any).customReason          || null,
    };

    console.log("[Announcement] payload:", payload);

    try {
      const res = await userInstance.post(
        isLoggedIn ? "/announcements" : "/announcements/guest",
        payload,
      );
      if (res.data.success) {
        const code = String(res.data.data.announcement_code || res.data.data.id);
        navigate(`/client/project-success/${code}`);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "의뢰 등록에 실패했습니다.";
      console.error("[Announcement] 400 error:", error.response?.data);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">의뢰 등록</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8">

        {/* ① 업종 선택 */}
        <FormSection label="업종" guide={fieldGuides.industry}>
          <ChoiceButtonGroup
            columnsClassName="grid-cols-2 md:grid-cols-3"
            options={industries}
            value={industry}
            onChange={handleIndustryChange}
          />
        </FormSection>

        {/* ② 의뢰 목적 */}
        {industry && (
          <>
            <SectionDivider title="의뢰 목적" />
            <FormSection label="목적" guide={fieldGuides.purpose}>
              <PurposeTabs tabs={visibleTabs} value={purpose} onChange={setPurpose} />
            </FormSection>
          </>
        )}

        {/* ③ 상세 정보 */}
        {purpose && (
          <>
            <SectionDivider title="상세 정보" />

            {/* 사업자 유형 — 모든 목적 공통 */}
            <FormSection label="사업자 유형" guide={fieldGuides.businessType}>
              <ChoiceButtonGroup
                columnsClassName={purpose === "license" ? "grid-cols-3" : "grid-cols-2 max-w-md"}
                options={
                  purpose === "license"
                    ? [{ label: "법인 사업자", value: "corporation" }, { label: "개인 사업자", value: "individual" }, { label: "창업 예정", value: "startup" }]
                    : [{ label: "법인 사업자", value: "corporation" }, { label: "개인 사업자", value: "individual" }]
                }
                value={getCurrentBusinessType()}
                onChange={setCurrentBusinessType}
              />
            </FormSection>

            {/* 목적별 세부 필드 */}
            {purpose === "license"  && <LicenseFields  data={licenseData}  onChange={setLicenseData}  />}
            {purpose === "periodic" && <PeriodicFields data={periodicData} onChange={setPeriodicData} />}
            {purpose === "survey"   && <SurveyFields   data={surveyData}   onChange={setSurveyData}   />}
            {purpose === "other"    && <OtherFields    data={otherData}    industry={industry} onChange={setOtherData} />}
          </>
        )}

        {/* ④ 제출 */}
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