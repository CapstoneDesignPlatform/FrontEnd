import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { HelpCircle } from "lucide-react"; // 아이콘 임포트

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  industryLabels,
  projectTabLabels,
  tabGuides, // 가이드 데이터 임포트
} from "./createProjectConfig";
import type {
  BaseProjectFormData,
  BusinessType,
  ConstructionLicenseData,
  ConstructionOtherData,
  ConstructionSurveyData,
  CurrentIndustryType,
  DiagnosisReason,
  ElectricalPeriodicData,
  LicenseBusinessType,
  ProjectClassification,
  ProjectTab,
} from "./types";

type FormSubmitHandler = (event: FormEvent<HTMLFormElement>) => void;

const choiceButtonBaseClass = "h-auto py-4";
const choiceButtonActiveClass =
  "bg-[#009689] text-white border-[#009689] hover:bg-[#007d71]";

// --- 헬퍼 컴포넌트: LabelGuide (물음표 툴팁) ---
interface LabelGuideProps {
  guide?: { title: string; items: string[] };
}

function LabelGuide({ guide }: LabelGuideProps) {
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

// --- 공통 옵션 데이터 ---
const licenseBusinessTypeOptions: Array<{ label: string; value: LicenseBusinessType }> = [
  { label: "법인 사업자", value: "corporation" },
  { label: "개인 사업자", value: "individual" },
  { label: "창업 예정", value: "startup" },
];

const businessTypeOptions: Array<{ label: string; value: BusinessType }> = [
  { label: "법인 사업자", value: "corporation" },
  { label: "개인 사업자", value: "individual" },
];

const classificationOptions: Array<{ label: string; value: ProjectClassification }> = [
  { label: "신규", value: "new" },
  { label: "추가", value: "additional" },
];

const diagnosisReasonOptions: Array<{ label: string; value: DiagnosisReason }> = [
  { label: "자본금 변동", value: "capital" },
  { label: "양도", value: "transfer" },
  { label: "합병", value: "merger" },
  { label: "기타", value: "other_manual" },
];

// --- 공통 UI 컴포넌트 ---
interface ChoiceButtonGroupProps<TValue extends string> {
  columnsClassName: string;
  options: Array<{ label: string; value: TValue }>;
  value: TValue;
  onChange: (value: TValue) => void;
}

function ChoiceButtonGroup<TValue extends string>({
  columnsClassName,
  options,
  value,
  onChange,
}: ChoiceButtonGroupProps<TValue>) {
  return (
    <div className={`grid gap-3 ${columnsClassName}`}>
      {options.map((option) => (
        <Button
          key={option.value}
          type="button"
          variant="outline"
          className={`${choiceButtonBaseClass} ${
            value === option.value ? choiceButtonActiveClass : "hover:bg-gray-50"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

interface FormSectionProps {
  children: ReactNode;
  label: string;
  guide?: { title: string; items: string[] }; // 가이드 추가
}

function FormSection({ children, label, guide }: FormSectionProps) {
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

function FormDivider() {
  return <div className="border-t pt-6" />;
}

function SubmitButton({ label = "등록하기" }: { label?: string }) {
  return (
    <div className="pt-6 border-t">
      <Button
        type="submit"
        className="w-full h-14 text-lg bg-[#009689] hover:bg-[#007d71]"
        size="lg"
      >
        {label}
      </Button>
    </div>
  );
}

interface AssetScaleFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  labelSuffix?: string;
  disabledMessage?: string;
  guide?: { title: string; items: string[] }; // 가이드 추가
}

function AssetScaleField({
  id,
  value,
  onChange,
  disabled = false,
  labelSuffix,
  disabledMessage,
  guide,
}: AssetScaleFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-base font-semibold">
          자산 규모 {labelSuffix}
          <span className="text-red-500">*</span>
        </Label>
        <LabelGuide guide={guide} />
      </div>
      <div className="flex items-center gap-3 max-w-md">
        <Input
          id={id}
          type="number"
          placeholder="숫자만 입력"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required={!disabled}
          className="text-base py-6"
        />
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
interface LicenseRequestFormProps {
  data: ConstructionLicenseData;
  onChange: (data: ConstructionLicenseData) => void;
  onSubmit: FormSubmitHandler;
}

export function LicenseRequestForm({ data, onChange, onSubmit }: LicenseRequestFormProps) {
  const guide = tabGuides.license; // 데이터 연결

  const updateField = <TKey extends keyof ConstructionLicenseData>(
    field: TKey,
    value: ConstructionLicenseData[TKey],
  ) => {
    onChange({ ...data, [field]: value });
  };

  const selectCurrentIndustryType = (type: CurrentIndustryType) => {
    onChange({
      ...data,
      currentIndustryType: type,
      currentIndustryDetail: type === "none" ? "" : data.currentIndustryDetail,
      assetScale: type === "none" ? "" : data.assetScale,
    });
  };

  const isStartup = data.businessType === "startup";
  const assetScaleDisabled = data.currentIndustryType === "none";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형" guide={guide}>
        <ChoiceButtonGroup
          columnsClassName="grid-cols-3"
          options={licenseBusinessTypeOptions}
          value={data.businessType}
          onChange={(value) => updateField("businessType", value)}
        />
      </FormSection>

      <FormSection label="구분" guide={guide}>
        <ChoiceButtonGroup
          columnsClassName="grid-cols-2 max-w-md"
          options={classificationOptions}
          value={data.classification}
          onChange={(value) => updateField("classification", value)}
        />
      </FormSection>

      <FormDivider />

      <FormSection label="필요 면허" guide={guide}>
        <Input
          id="requiredLicense"
          placeholder="필요한 면허를 입력합니다."
          value={data.requiredLicense}
          onChange={(event) => updateField("requiredLicense", event.target.value)}
          className="text-base py-6"
          required
        />
        <p className="text-sm text-gray-500">예: 건설업 일반건설업(토목공사업), 전문건설업(실내건축공사업) 등</p>
      </FormSection>

      <FormDivider />

      <FormSection label="현재 업종" guide={guide}>
        {isStartup && <p className="text-sm text-amber-600 mb-3">창업 예정 사업자는 자동으로 "없음"이 선택됩니다.</p>}
        <div className="space-y-3">
          <CurrentIndustryOption
            active={data.currentIndustryType === "construction"}
            disabled={isStartup}
            label="건설업 관련"
            onSelect={() => selectCurrentIndustryType("construction")}
          >
            <Input
              placeholder="상세 내용을 입력해주세요 (예: 토목공사업)"
              value={data.currentIndustryDetail}
              onChange={(event) => updateField("currentIndustryDetail", event.target.value)}
              className="mt-2"
              required
            />
          </CurrentIndustryOption>

          <CurrentIndustryOption
            active={data.currentIndustryType === "nonConstruction"}
            disabled={isStartup}
            label="비 건설업 관련"
            onSelect={() => selectCurrentIndustryType("nonConstruction")}
          >
            <Input
              placeholder="상세 내용을 입력해주세요 (예: 제조업, 서비스업 등)"
              value={data.currentIndustryDetail}
              onChange={(event) => updateField("currentIndustryDetail", event.target.value)}
              className="mt-2"
              required
            />
          </CurrentIndustryOption>

          <CurrentIndustryOption
            active={data.currentIndustryType === "none"}
            helperText="창업 예정은 '없음'을 선택해주세요."
            label="없음"
            onSelect={() => selectCurrentIndustryType("none")}
          />
        </div>
      </FormSection>

      <FormDivider />

      <AssetScaleField
        id="assetScale"
        value={data.assetScale}
        onChange={(value) => updateField("assetScale", value)}
        disabled={assetScaleDisabled}
        guide={guide}
      />

      <SubmitButton />
    </form>
  );
}

// --- 2. 주기적 신고 폼 ---
interface PeriodicReportFormProps {
  data: ElectricalPeriodicData;
  onChange: (data: ElectricalPeriodicData) => void;
  onSubmit: FormSubmitHandler;
}

export function PeriodicReportForm({ data, onChange, onSubmit }: PeriodicReportFormProps) {
  const guide = tabGuides.periodic;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형" guide={guide}>
        <ChoiceButtonGroup
          columnsClassName="grid-cols-2 max-w-md"
          options={businessTypeOptions}
          value={data.businessType}
          onChange={(businessType) => onChange({ ...data, businessType })}
        />
      </FormSection>

      <FormDivider />

      <AssetScaleField
        id="periodicAssetScale"
        value={data.assetScale}
        onChange={(assetScale) => onChange({ ...data, assetScale })}
        guide={guide}
      />

      <SubmitButton />
    </form>
  );
}

// --- 3. 실태 조사 의뢰 폼 ---
interface SurveyRequestFormProps {
  data: ConstructionSurveyData;
  onChange: (data: ConstructionSurveyData) => void;
  onSubmit: FormSubmitHandler;
}

export function SurveyRequestForm({ data, onChange, onSubmit }: SurveyRequestFormProps) {
  const guide = tabGuides.survey;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형" guide={guide}>
        <ChoiceButtonGroup
          columnsClassName="grid-cols-2 max-w-md"
          options={businessTypeOptions}
          value={data.businessType}
          onChange={(businessType) => onChange({ ...data, businessType })}
        />
      </FormSection>

      <FormDivider />

      <FormSection label="보유 면허" guide={guide}>
        <Input
          id="currentLicense"
          placeholder="현재 보유하고 있는 면허를 입력해주세요"
          value={data.currentLicense}
          onChange={(event) => onChange({ ...data, currentLicense: event.target.value })}
          className="text-base py-6"
          required
        />
      </FormSection>

      <FormDivider />

      <AssetScaleField
        id="surveyAssetScale"
        value={data.assetScale}
        onChange={(assetScale) => onChange({ ...data, assetScale })}
        guide={guide}
      />

      <SubmitButton />
    </form>
  );
}

// --- 4. 기타 서비스 의뢰 폼 ---
interface OtherRequestFormProps {
  data: ConstructionOtherData;
  industry: string;
  onChange: (data: ConstructionOtherData) => void;
  onSubmit: FormSubmitHandler;
}

export function OtherRequestForm({ data, industry, onChange, onSubmit }: OtherRequestFormProps) {
  const guide = tabGuides.other;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형" guide={guide}>
        <ChoiceButtonGroup
          columnsClassName="grid-cols-2 max-w-md"
          options={businessTypeOptions}
          value={data.businessType}
          onChange={(businessType) => onChange({ ...data, businessType })}
        />
      </FormSection>

      <FormDivider />

      <FormSection label="진단 사유" guide={guide}>
        <ChoiceButtonGroup
          columnsClassName="grid-cols-4"
          options={diagnosisReasonOptions}
          value={data.reason}
          onChange={(reason) => onChange({ ...data, reason })}
        />
        {data.reason === ("other_manual" as any) && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <Label htmlFor="manualReason" className="text-sm font-medium text-gray-600 mb-2 block">
              진단 사유 직접 입력
            </Label>
            <Input
              id="manualReason"
              placeholder="상세 사유를 입력해주세요 (예: 법인격 전환, 결산 등)"
              value={(data as any).customReason || ""} 
              onChange={(e) => onChange({ ...data, customReason: e.target.value } as any)}
              className="text-base py-6 border-[#009689] focus-visible:ring-[#009689]"
              required
            />
          </div>
        )}
      </FormSection>

      <FormDivider />

      <AssetScaleField
        id="otherAssetScale"
        labelSuffix={industry !== "construction" ? "(증자 이전) " : undefined}
        value={data.assetScale}
        onChange={(assetScale) => onChange({ ...data, assetScale })}
        guide={guide}
      />

      <SubmitButton />
    </form>
  );
}

// --- 5. 공통 베이스 폼 ---
interface BaseProjectFormProps {
  activeTab: ProjectTab;
  data: BaseProjectFormData;
  industry: string;
  onCancel: () => void;
  onChange: (data: BaseProjectFormData) => void;
  onSubmit: FormSubmitHandler;
}

export function BaseProjectForm({ activeTab, data, industry, onCancel, onChange, onSubmit }: BaseProjectFormProps) {
  const guide = tabGuides[activeTab];
  
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as keyof BaseProjectFormData;
    onChange({ ...data, [field]: event.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormSection label="공고 제목" guide={guide}>
        <Input
          id="title"
          name="title"
          placeholder={`예) ${industryLabels[industry] ?? ""} ${projectTabLabels[activeTab]} 의뢰`}
          value={data.title}
          onChange={handleChange}
          required
        />
      </FormSection>

      <FormSection label="상세 설명" guide={guide}>
        <Textarea
          id="description"
          name="description"
          placeholder="상세 내용을 입력해주세요."
          rows={6}
          value={data.description}
          onChange={handleChange}
          required
        />
      </FormSection>

      <div className="grid md:grid-cols-2 gap-4 pt-4">
        <FormSection label="예상 예산">
          <Input id="budget" name="budget" type="number" value={data.budget} onChange={handleChange} />
        </FormSection>
        <FormSection label="완료 희망일">
          <Input id="deadline" name="deadline" type="date" value={data.deadline} onChange={handleChange} required />
        </FormSection>
      </div>

      <div className="flex gap-4 pt-6">
        <Button type="submit" className="flex-1 h-14 bg-[#009689]">공고 게시하기</Button>
        <Button type="button" variant="outline" className="flex-1 h-14" onClick={onCancel}>취소</Button>
      </div>
    </form>
  );
}

// --- 기타 서브 컴포넌트 ---
function CurrentIndustryOption({ active, children, disabled, helperText, label, onSelect }: any) {
  return (
    <div className={`border-2 rounded-lg p-4 transition-all ${active ? "border-[#009689] bg-teal-50" : "border-gray-200"} ${disabled ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between gap-3">
        <Button type="button" size="sm" variant="outline" className={active ? choiceButtonActiveClass : ""} onClick={onSelect} disabled={disabled}>{label}</Button>
        {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
      {active && children}
    </div>
  );
}