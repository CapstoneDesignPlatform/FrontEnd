import type { ChangeEvent, FormEvent, ReactNode } from "react";

import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import {
  industryLabels,
  projectTabLabels,
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

const licenseBusinessTypeOptions: Array<{
  label: string;
  value: LicenseBusinessType;
}> = [
  { label: "법인 사업자", value: "corporation" },
  { label: "개인 사업자", value: "individual" },
  { label: "창업 예정", value: "startup" },
];

const businessTypeOptions: Array<{ label: string; value: BusinessType }> = [
  { label: "법인 사업자", value: "corporation" },
  { label: "개인 사업자", value: "individual" },
];

const classificationOptions: Array<{
  label: string;
  value: ProjectClassification;
}> = [
  { label: "신규", value: "new" },
  { label: "추가", value: "additional" },
];

const diagnosisReasonOptions: Array<{
  label: string;
  value: DiagnosisReason;
}> = [
  { label: "자본금 변동", value: "capital" },
  { label: "양도", value: "transfer" },
  { label: "합병", value: "merger" },
];

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
}

function FormSection({ children, label }: FormSectionProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">
        {label} <span className="text-red-500">*</span>
      </Label>
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
}

function AssetScaleField({
  id,
  value,
  onChange,
  disabled = false,
  labelSuffix,
  disabledMessage,
}: AssetScaleFieldProps) {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-base font-semibold">
        자산 규모 {labelSuffix}
        <span className="text-red-500">*</span>
      </Label>
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
        <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">
          억원
        </span>
      </div>
      {disabled ? (
        <p className="text-sm text-amber-600">
          {disabledMessage ?? "현재 조건에서는 자산 규모를 입력할 수 없습니다."}
        </p>
      ) : (
        <p className="text-sm text-gray-500">
          현재 보유하고 있는 자산 규모를 입력해주세요 (예: 10억원 → 10 입력)
        </p>
      )}
    </div>
  );
}

interface LicenseRequestFormProps {
  data: ConstructionLicenseData;
  onChange: (data: ConstructionLicenseData) => void;
  onSubmit: FormSubmitHandler;
}

export function LicenseRequestForm({
  data,
  onChange,
  onSubmit,
}: LicenseRequestFormProps) {
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
      <FormSection label="사업자 유형">
        <ChoiceButtonGroup
          columnsClassName="grid-cols-3"
          options={licenseBusinessTypeOptions}
          value={data.businessType}
          onChange={(value) => updateField("businessType", value)}
        />
      </FormSection>

      <FormSection label="구분">
        <ChoiceButtonGroup
          columnsClassName="grid-cols-2 max-w-md"
          options={classificationOptions}
          value={data.classification}
          onChange={(value) => updateField("classification", value)}
        />
      </FormSection>

      <FormDivider />

      <div className="space-y-3">
        <Label htmlFor="requiredLicense" className="text-base font-semibold">
          필요 면허 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="requiredLicense"
          placeholder="필요한 면허를 입력합니다."
          value={data.requiredLicense}
          onChange={(event) => updateField("requiredLicense", event.target.value)}
          className="text-base py-6"
          required
        />
        <p className="text-sm text-gray-500">
          예: 건설업 일반건설업(토목공사업), 전문건설업(실내건축공사업) 등
        </p>
      </div>

      <FormDivider />

      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">
            현재 업종 <span className="text-red-500">*</span>
          </Label>
          {isStartup ? (
            <p className="text-sm text-amber-600 mt-1">
              창업 예정 사업자는 자동으로 "없음"이 선택됩니다.
            </p>
          ) : null}
        </div>

        <div className="space-y-3">
          <CurrentIndustryOption
            active={data.currentIndustryType === "construction"}
            disabled={isStartup}
            label="건설업 관련"
            onSelect={() => selectCurrentIndustryType("construction")}
          >
            <Input
              placeholder="건설업 관련 업종을 상세히 입력해주세요 (예: 토목공사업)"
              value={data.currentIndustryDetail}
              onChange={(event) =>
                updateField("currentIndustryDetail", event.target.value)
              }
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
              placeholder="비 건설업 관련 업종을 상세히 입력해주세요 (예: 제조업, 서비스업 등)"
              value={data.currentIndustryDetail}
              onChange={(event) =>
                updateField("currentIndustryDetail", event.target.value)
              }
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
      </div>

      <FormDivider />

      <AssetScaleField
        id="assetScale"
        value={data.assetScale}
        onChange={(value) => updateField("assetScale", value)}
        disabled={assetScaleDisabled}
        disabledMessage="현재 업종이 없는 경우 자산 규모를 입력할 수 없습니다."
      />

      <SubmitButton />
    </form>
  );
}

interface CurrentIndustryOptionProps {
  active: boolean;
  children?: ReactNode;
  disabled?: boolean;
  helperText?: string;
  label: string;
  onSelect: () => void;
}

function CurrentIndustryOption({
  active,
  children,
  disabled = false,
  helperText,
  label,
  onSelect,
}: CurrentIndustryOptionProps) {
  return (
    <div
      className={`border-2 rounded-lg p-4 transition-all ${
        active ? "border-[#009689] bg-teal-50" : "border-gray-200 hover:border-gray-300"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className={active ? choiceButtonActiveClass : "hover:bg-gray-50"}
          onClick={() => {
            if (!disabled) {
              onSelect();
            }
          }}
          disabled={disabled}
        >
          {label}
        </Button>
        {helperText ? <p className="text-sm text-gray-500">{helperText}</p> : null}
      </div>
      {active ? children : null}
    </div>
  );
}

interface PeriodicReportFormProps {
  data: ElectricalPeriodicData;
  onChange: (data: ElectricalPeriodicData) => void;
  onSubmit: FormSubmitHandler;
}

export function PeriodicReportForm({
  data,
  onChange,
  onSubmit,
}: PeriodicReportFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형">
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
      />

      <SubmitButton />
    </form>
  );
}

interface SurveyRequestFormProps {
  data: ConstructionSurveyData;
  onChange: (data: ConstructionSurveyData) => void;
  onSubmit: FormSubmitHandler;
}

export function SurveyRequestForm({
  data,
  onChange,
  onSubmit,
}: SurveyRequestFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형">
        <ChoiceButtonGroup
          columnsClassName="grid-cols-2 max-w-md"
          options={businessTypeOptions}
          value={data.businessType}
          onChange={(businessType) => onChange({ ...data, businessType })}
        />
      </FormSection>

      <FormDivider />

      <div className="space-y-3">
        <Label htmlFor="currentLicense" className="text-base font-semibold">
          보유 면허 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="currentLicense"
          placeholder="현재 보유하고 있는 면허를 입력해주세요"
          value={data.currentLicense}
          onChange={(event) =>
            onChange({ ...data, currentLicense: event.target.value })
          }
          className="text-base py-6"
          required
        />
        <p className="text-sm text-gray-500">
          예: 건설업 일반건설업(토목공사업), 전문건설업(실내건축공사업) 등
        </p>
      </div>

      <FormDivider />

      <AssetScaleField
        id="surveyAssetScale"
        value={data.assetScale}
        onChange={(assetScale) => onChange({ ...data, assetScale })}
      />

      <SubmitButton />
    </form>
  );
}

interface OtherRequestFormProps {
  data: ConstructionOtherData;
  industry: string;
  onChange: (data: ConstructionOtherData) => void;
  onSubmit: FormSubmitHandler;
}

export function OtherRequestForm({
  data,
  industry,
  onChange,
  onSubmit,
}: OtherRequestFormProps) {
  const shouldShowPreviousAssetLabel = industry !== "construction";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <FormSection label="사업자 유형">
        <ChoiceButtonGroup
          columnsClassName="grid-cols-2 max-w-md"
          options={businessTypeOptions}
          value={data.businessType}
          onChange={(businessType) => onChange({ ...data, businessType })}
        />
      </FormSection>

      <FormDivider />

      <FormSection label="진단 사유">
        <ChoiceButtonGroup
          columnsClassName="grid-cols-3"
          options={diagnosisReasonOptions}
          value={data.reason}
          onChange={(reason) => onChange({ ...data, reason })}
        />
      </FormSection>

      <FormDivider />

      <AssetScaleField
        id="otherAssetScale"
        labelSuffix={shouldShowPreviousAssetLabel ? "(증자 이전) " : undefined}
        value={data.assetScale}
        onChange={(assetScale) => onChange({ ...data, assetScale })}
      />

      <SubmitButton />
    </form>
  );
}

interface BaseProjectFormProps {
  activeTab: ProjectTab;
  data: BaseProjectFormData;
  industry: string;
  onCancel: () => void;
  onChange: (data: BaseProjectFormData) => void;
  onSubmit: FormSubmitHandler;
}

export function BaseProjectForm({
  activeTab,
  data,
  industry,
  onCancel,
  onChange,
  onSubmit,
}: BaseProjectFormProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const field = event.target.name as keyof BaseProjectFormData;
    onChange({ ...data, [field]: event.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">
          공고 제목 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          placeholder={`예) ${industryLabels[industry] ?? ""} ${
            projectTabLabels[activeTab]
          } 의뢰`}
          value={data.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          상세 설명 <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="프로젝트에 대한 상세한 설명을 입력해주세요."
          rows={6}
          value={data.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">예상 예산</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            placeholder="원 (예: 3000000)"
            value={data.budget}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-600">
            입찰 참고용입니다. 최종 가격은 협의를 통해 결정됩니다.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deadline">
            완료 희망일 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={data.deadline}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">지역</Label>
        <Input
          id="location"
          name="location"
          placeholder="예) 서울특별시 강남구"
          value={data.location}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">필수 요구사항</Label>
        <Textarea
          id="requirements"
          name="requirements"
          placeholder="전문가가 갖추어야 할 자격이나 요구사항을 입력해주세요."
          rows={4}
          value={data.requirements}
          onChange={handleChange}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          공고 게시하기
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          취소
        </Button>
      </div>
    </form>
  );
}
