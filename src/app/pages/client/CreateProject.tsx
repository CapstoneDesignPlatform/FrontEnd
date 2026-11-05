import { useState, useEffect, useRef, type FormEvent, type ReactNode, type RefObject } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { userInstance } from "../../../api/instance";
import { getStoredAccessToken } from "../../../api/authTokens";
import { buildRequestFinancialPayload, normalizeFinancialInput, parseFinancialAmount } from "./createProject/requestFinancialPayload";

import {
  tabGuides,
  fieldGuides,
  industries,
  generalConstructionBusinesses,
  specialtyConstructionBusinesses,
  initialConstructionLicenseData,
  initialConstructionSurveyData,
  initialConstructionOtherData,
  initialElectricalPeriodicData,
  getVisibleTabs,
  projectTabLabels,
} from "./createProject/createProjectConfig";

import type {
  ConstructionLicenseData,
  ConstructionOtherData,
  ConstructionSurveyData,
  ElectricalPeriodicData,
  ProjectTab,
} from "./createProject/types";

// ─── 백엔드 API 규격 변환 맵핑 ───────────────────────────────────────────────
const INDUSTRY_MAP: Record<string, string> = { construction: "CONSTRUCTION", electrical: "ELECTRICAL" };
const PURPOSE_MAP:  Record<string, string> = { license: "REQUIRED_LICENSE", periodic: "PERIODIC_REPORT", survey: "SURVEY", other: "OTHER" };
const OWNER_TYPE_MAP: Record<string, string> = { corporation: "CORPORATION", individual: "INDIVIDUAL", startup: "STARTUP" };

const ACTIVE = "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white focus-visible:bg-blue-600 focus-visible:text-white";
const INACTIVE_HOVER = "hover:bg-blue-600 hover:text-white focus-visible:bg-blue-600 focus-visible:text-white";

const diagnosisSectionTitles: Record<string, string> = {
  construction: "건설업 진단 정보",
  electrical: "전기공사업 진단 정보",
  information: "정보통신공사업 진단 정보",
  fire: "소방시설공사업 진단 정보",
  forestry: "산림사업법인 진단 정보",
  pharmaceutical: "의약품 관련 업종 진단 정보",
  "national-heritage": "국가유산 관련 업종 진단 정보",
  other: "기타 업종 진단 정보",
};

const nonConstructionFieldConfig: Record<string, {
  title: string;
  registrationQuestion: string;
  detailLabel?: string;
}> = {
  information: {
    title: diagnosisSectionTitles.information,
    registrationQuestion: "현재 정보통신공사업 등록을 보유하고 있나요?",
  },
  fire: {
    title: diagnosisSectionTitles.fire,
    registrationQuestion: "현재 소방시설공사업 등록을 보유하고 있나요?",
    detailLabel: "등록종류",
  },
  pharmaceutical: {
    title: diagnosisSectionTitles.pharmaceutical,
    registrationQuestion: "현재 해당 의약품 관련 등록을 보유하고 있나요?",
    detailLabel: "세부업종",
  },
  forestry: {
    title: diagnosisSectionTitles.forestry,
    registrationQuestion: "현재 산림사업법인 등록을 보유하고 있나요?",
    detailLabel: "등록업종",
  },
  "national-heritage": {
    title: diagnosisSectionTitles["national-heritage"],
    registrationQuestion: "현재 국가유산 관련 업종 등록을 보유하고 있나요?",
    detailLabel: "진단 대상 업종",
  },
};

const registrationStatusOptions = [
  { label: "아니요", value: "no" },
  { label: "예", value: "yes" },
  { label: "잘 모르겠어요", value: "unsure" },
];

const commonExistingRegistrationPurposes = [
  { label: "자본금 확인", value: "capital-check" },
  { label: "양수·양도", value: "transfer" },
  { label: "합병", value: "merger" },
  { label: "기타", value: "other" },
];

const nationalHeritagePurposeOptions = [
  { label: "종합국가유산수리업", value: "general-national-heritage-repair" },
  { label: "전문국가유산수리업", value: "specialty-national-heritage-repair" },
  { label: "국가유산실측설계업", value: "national-heritage-design" },
  { label: "국가유산감리업", value: "national-heritage-supervision" },
];

const specialtyNationalHeritageBusinesses = [
  { label: "조경업", value: "landscaping", keywords: ["조경"] },
  { label: "보존과학업", value: "conservation-science", keywords: ["보존", "과학"] },
  { label: "식물보호업", value: "plant-protection", keywords: ["식물", "보호"] },
  { label: "단청공사업", value: "dancheong", keywords: ["단청"] },
  { label: "목공사업", value: "woodwork", keywords: ["목공", "나무"] },
  { label: "석공사업", value: "stonework", keywords: ["석공", "돌"] },
  { label: "번와공사업", value: "roof-tile", keywords: ["번와", "기와"] },
  { label: "미장공사업", value: "plastering", keywords: ["미장"] },
  { label: "온돌공사업", value: "ondol", keywords: ["온돌"] },
];

const generalNationalHeritageBusiness = {
  label: "보수단청업",
  value: "repair-dancheong",
};

const pharmaceuticalTargetBusinesses = [
  { label: "의약품 도매상", value: "pharmaceutical-wholesaler" },
  { label: "의료용고압가스", value: "medical-gas" },
  { label: "방사성의약품", value: "radioactive-pharmaceutical" },
];

const pharmaceuticalDiagnosisPurposes = [
  { label: "신규 허가 취득", value: "new-license" },
  { label: "양도·양수", value: "transfer" },
  { label: "자본금 변경", value: "capital-change" },
];

const fireContractorTypes = [
  { label: "전문 소방시설공사업", value: "specialty" },
  { label: "일반 소방시설공사업", value: "general" },
];

const fireFieldOptions = [
  { label: "기계분야", value: "mechanical" },
  { label: "전기분야", value: "electrical" },
];

const fireDiagnosisPurposeOptions = [
  { label: "신규 등록(면허 취득)", value: "new-license" },
  { label: "변경 관련 진단", value: "change" },
  { label: "양도·양수", value: "transfer" },
  { label: "실태조사 대응", value: "survey" },
];

const forestryFieldOptions = [
  { label: "산림경영계획 및 산림조사", value: "forest-management-survey" },
  { label: "숲가꾸기 및 병해충 방제", value: "forest-tending-pest-control" },
  { label: "도시숲등의 조성·관리", value: "urban-forest" },
  { label: "산림토목", value: "forest-civil-engineering" },
  { label: "자연휴양림등 조성", value: "recreation-forest" },
  { label: "숲길 조성·관리", value: "forest-trail" },
];

const forestryDiagnosisPurposeOptions = [
  { label: "신규 등록", value: "new-registration" },
  { label: "추가 등록", value: "additional-registration" },
  { label: "변경 관련 진단", value: "change" },
  { label: "실태조사 대응", value: "survey" },
];

const electricalDiagnosisPurposeOptions = [
  { label: "신규등록", value: "license" },
  { label: "등록기준 신고", value: "periodic" },
  { label: "실태조사 대응", value: "survey" },
  { label: "양도·양수", value: "other" },
];

const existingBusinessQuestions: Record<string, string> = {
  construction: "현재 건설업 또는 다른 업종의 사업을 운영하고 있나요?",
  electrical: "현재 전기공사업 또는 다른 업종의 사업을 운영하고 있나요?",
  information: "현재 정보통신공사업 또는 다른 업종의 사업을 운영하고 있나요?",
  fire: "현재 소방시설공사업 또는 다른 업종의 사업을 운영하고 있나요?",
  forestry: "현재 산림사업 또는 다른 업종의 사업을 운영하고 있나요?",
  pharmaceutical: "현재 의약품 관련 업종 또는 다른 업종의 사업을 운영하고 있나요?",
  "national-heritage": "현재 국가유산 관련 업종 또는 다른 업종의 사업을 운영하고 있나요?",
  other: "현재 진단 대상 업종 또는 다른 업종의 사업을 운영하고 있나요?",
};

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

function ChoiceButtonGroup({ activeClassName = ACTIVE, columnsClassName, disabled = false, inactiveClassName = INACTIVE_HOVER, options, value, onChange }: {
  activeClassName?: string;
  columnsClassName: string;
  disabled?: boolean;
  inactiveClassName?: string;
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
          className={`h-auto py-4 ${value === opt.value ? activeClassName : inactiveClassName}`}
          disabled={disabled}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  );
}

function FormSection({ children, description, label, guide, required = true }: { children: ReactNode; description?: string; label: string; guide?: { title: string; items: string[] }; required?: boolean }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-base font-semibold">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <LabelGuide guide={guide} />
      </div>
      {description && <p className="text-sm text-gray-500">{description}</p>}
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

function formatDecimalAmount(value: string): string {
  if (!value) return "";
  if (!/^\d*(\.\d*)?$/.test(value)) return value;
  const hasDecimalPoint = value.includes(".");
  const [integerPart, decimalPart = ""] = value.split(".");
  const formattedInteger = Number(integerPart || "0").toLocaleString("ko-KR");
  return hasDecimalPoint ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

function ReviewCard({ title, rows, onEdit }: {
  title: string;
  rows: { label: string; value: string }[];
  onEdit: () => void;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="h-10 border-blue-600 bg-white px-4 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        >
          수정
        </Button>
      </div>
      <dl className="divide-y divide-gray-100">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[130px_minmax(0,1fr)] gap-3 py-2 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-5 sm:py-1.5 lg:grid-cols-[220px_minmax(0,1fr)]">
            <dt className="text-sm font-medium leading-[1.35] text-gray-500">{row.label}</dt>
            <dd className={`min-w-0 text-sm font-semibold leading-[1.35] text-gray-900 ${row.value.includes("\n") ? "whitespace-pre-wrap break-words" : row.value.length <= 12 ? "whitespace-nowrap" : "break-words"}`}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function toLocalDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDeadlineDate(date: string, period: string, hour: string, minute: string): Date | null {
  if (!date || !period || !hour || !minute) return null;
  const [year, month, day] = date.split("-").map(Number);
  let hours = Number(hour) % 12;
  if (period === "pm") hours += 12;
  return new Date(year, month - 1, day, hours, Number(minute));
}

function getMinimumSelectableDeadline(now: Date): Date {
  const minimum = new Date(now.getTime() + 20 * 60 * 1000);
  const hasPartialMinute = minimum.getSeconds() !== 0 || minimum.getMilliseconds() !== 0;
  minimum.setSeconds(0, 0);
  const minuteRemainder = minimum.getMinutes() % 10;
  const minutesToAdd = minuteRemainder === 0
    ? (hasPartialMinute ? 10 : 0)
    : 10 - minuteRemainder;
  minimum.setMinutes(minimum.getMinutes() + minutesToAdd);
  return minimum;
}

function formatDeadline(date: Date): string {
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const period = date.getHours() < 12 ? "오전" : "오후";
  const hour = date.getHours() % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, "0");
  const twentyFourHourTime = hour === 12
    ? ` (${String(date.getHours()).padStart(2, "0")}:${minute})`
    : "";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} (${weekdays[date.getDay()]}) ${period} ${hour}:${minute}${twentyFourHourTime}`;
}

function DeadlineField({ date, period, hour, minute, onDateChange, onPeriodChange, onHourChange, onMinuteChange }: {
  date: string;
  period: string;
  hour: string;
  minute: string;
  onDateChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onHourChange: (value: string) => void;
  onMinuteChange: (value: string) => void;
}) {
  const now = new Date();
  const minimum = getMinimumSelectableDeadline(now);
  const maximum = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  const selectClassName = "h-12 rounded-md border border-input bg-input-background px-3 text-center [text-align-last:center] text-base outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";
  const dateOptions = ["오늘", "내일", "모레"].map((label, offset) => {
    const optionDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    return { label, value: toLocalDateInputValue(optionDate) };
  });
  const minuteOptions = ["00", "10", "20", "30", "40", "50"];
  const hourOptions = ["12", ...Array.from({ length: 11 }, (_, index) => String(index + 1))];
  const isSelectableTime = (nextDate: string, nextPeriod: string, nextHour: string, nextMinute: string) => {
    const candidate = getDeadlineDate(nextDate, nextPeriod, nextHour, nextMinute);
    return !!candidate && candidate.getTime() >= minimum.getTime() && candidate.getTime() <= maximum.getTime();
  };
  const hasSelectableHour = (nextDate: string, nextPeriod: string) => hourOptions.some((nextHour) =>
    minuteOptions.some((nextMinute) => isSelectableTime(nextDate, nextPeriod, nextHour, nextMinute)),
  );
  const hasSelectableMinute = (nextHour: string) => minuteOptions.some((nextMinute) =>
    isSelectableTime(date, period, nextHour, nextMinute),
  );
  const availableDateOptions = dateOptions.filter((option) =>
    ["am", "pm"].some((nextPeriod) => hasSelectableHour(option.value, nextPeriod)),
  );
  const availablePeriodOptions = [
    { value: "am", label: "오전" },
    { value: "pm", label: "오후" },
  ].filter((option) => hasSelectableHour(date, option.value));
  const availableHourOptions = hourOptions.filter(hasSelectableMinute);
  const availableMinuteOptions = minuteOptions.filter((value) => isSelectableTime(date, period, hour, value));

  return (
    <div className="space-y-4">
      <div className="h-px bg-gray-200" />
      <FormSection label="희망 의뢰 마감 (미리보기)" required={false} description="마감 시간 지정은 준비 중입니다. 아래 선택값은 등록 정보에 저장되지 않습니다.">
        <div className="grid grid-cols-1 items-end gap-3 lg:grid-cols-[minmax(240px,1.2fr)_minmax(330px,1fr)]">
        <div className="min-w-0 space-y-2">
          <Label className="text-sm text-gray-600">날짜</Label>
          <div className="flex gap-2">
            {availableDateOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant="outline"
                onClick={() => {
                  onDateChange(option.value);
                  onPeriodChange("");
                  onHourChange("");
                  onMinuteChange("");
                }}
                className={`h-12 flex-1 ${date === option.value ? ACTIVE : "hover:bg-blue-50 hover:text-blue-700"}`}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid min-w-0 grid-cols-3 items-end gap-3">
          <div className="min-w-0">
            <select id="deadline-period" value={period} onChange={(event) => {
              onPeriodChange(event.target.value);
              onHourChange("");
              onMinuteChange("");
            }} required disabled={!date} className={`${selectClassName} w-full ${period ? "text-gray-900" : "text-gray-400"} disabled:cursor-not-allowed disabled:bg-gray-100`}>
              <option value="" disabled>오전/오후</option>
              {availablePeriodOptions.map((option) => <option key={option.value} value={option.value} className="text-gray-900">{option.label}</option>)}
            </select>
          </div>
          <div className="min-w-0">
            <select id="deadline-hour" value={hour} onChange={(event) => {
              onHourChange(event.target.value);
              onMinuteChange("");
            }} required disabled={!date || !period} className={`${selectClassName} w-full ${hour ? "text-gray-900" : "text-gray-400"} disabled:cursor-not-allowed disabled:bg-gray-100`}>
              <option value="" disabled>시</option>
              {availableHourOptions.map((value) => (
                <option key={value} value={value} className="text-gray-900">
                  {value === "12" ? `12시 (${period === "am" ? "자정·00시" : "정오·12시"})` : `${value}시`}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <select id="deadline-minute" value={minute} onChange={(event) => onMinuteChange(event.target.value)} required disabled={!date || !period || !hour} className={`${selectClassName} w-full ${minute ? "text-gray-900" : "text-gray-400"} disabled:cursor-not-allowed disabled:bg-gray-100`}>
              <option value="" disabled>분</option>
              {availableMinuteOptions.map((value) => <option key={value} value={value} className="text-gray-900">{value}분</option>)}
            </select>
          </div>
        </div>
        </div>
        <p className="text-sm text-gray-500">현재 시각에서 20분 이후부터 최대 48시간 이내로 선택해 주세요.</p>
      </FormSection>
    </div>
  );
}

const parseDecimalAmount = normalizeFinancialInput;

function normalizeBusinessSearch(value: string): string {
  return value.toLowerCase().replace(/[\s·.\-]/g, "");
}

function AssetScaleField({ id, value, onChange, labelSuffix, guide, capitalId, capitalValue, capitalOnChange, hideTotalAssets }: {
  id: string; value: string; onChange: (v: string) => void;
  labelSuffix?: string;
  guide?: { title: string; items: string[] };
  capitalId: string; capitalValue: string; capitalOnChange: (v: string) => void;
  hideTotalAssets?: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        {/* 자본금 */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={capitalId} className="text-base font-semibold">
              {hideTotalAssets ? "예정 자본금" : "자본금"}{labelSuffix ? ` ${labelSuffix}` : ""} <span className="text-red-500">*</span>
            </Label>
            <LabelGuide guide={guide} />
          </div>
          <div className="flex items-center gap-3">
            <Input id={capitalId} name="capital" autoComplete="on" type="text" inputMode="decimal" placeholder="숫자만 입력"
              aria-label={hideTotalAssets ? "예정 자본금" : "자본금"}
              value={formatDecimalAmount(capitalValue)}
              onChange={(e) => capitalOnChange(parseDecimalAmount(e.target.value))} required
              className="py-6 text-center text-[18px] font-[400] leading-[27px]" />
            <span className="text-sm font-normal leading-5 text-gray-700 whitespace-nowrap">억원</span>
          </div>
          <p className="text-sm text-gray-500">
            {hideTotalAssets ? "예정 자본금 금액을 입력해 주세요." : "현재 납입된 자본금을 입력해 주세요."}
          </p>
        </div>

        {!hideTotalAssets && (
          <div className="flex-1 space-y-2">
            <Label htmlFor={id} className="text-base font-semibold">
              현재 총자산 <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Input id={id} name="totalAssets" autoComplete="on" type="text" inputMode="decimal" placeholder="숫자만 입력"
                aria-label="현재 총자산"
                value={formatDecimalAmount(value)}
                onChange={(e) => onChange(parseDecimalAmount(e.target.value))}
                required className="py-6 text-center text-[18px] font-[400] leading-[27px]" />
              <span className="text-sm font-normal leading-5 whitespace-nowrap text-gray-700">억원</span>
            </div>
            <p className="text-sm text-gray-500">현재 시점의 총자산 금액을 입력해 주세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 목적별 세부 필드 ─────────────────────────────────────────────────────────

function LicenseFields({ data, onChange }: { data: ConstructionLicenseData; onChange: (d: ConstructionLicenseData) => void }) {
  const guide = tabGuides.license;
  const set = <K extends keyof ConstructionLicenseData>(k: K, v: ConstructionLicenseData[K]) =>
    onChange({ ...data, [k]: v });
  const isStartup = data.businessType === "startup";

  return (
    <AssetScaleField id="licenseAsset" value={data.assetScale} onChange={(v) => set("assetScale", v)}
      guide={guide} hideTotalAssets={isStartup}
      capitalId="licenseCapital" capitalValue={data.capitalScale} capitalOnChange={(v) => set("capitalScale", v)} />
  );
}

function PeriodicFields({ data, hideTotalAssets, onChange }: { data: ElectricalPeriodicData; hideTotalAssets: boolean; onChange: (d: ElectricalPeriodicData) => void }) {
  return (
    <AssetScaleField id="periodicAsset" value={data.assetScale}
      onChange={(v) => onChange({ ...data, assetScale: v })} guide={tabGuides.periodic}
      hideTotalAssets={hideTotalAssets}
      capitalId="periodicCapital" capitalValue={data.capitalScale} capitalOnChange={(v) => onChange({ ...data, capitalScale: v })} />
  );
}

function SurveyFields({ data, hideTotalAssets, onChange }: { data: ConstructionSurveyData; hideTotalAssets: boolean; onChange: (d: ConstructionSurveyData) => void }) {
  const guide = tabGuides.survey;
  return (
    <>
      <FormSection label="보유 면허" guide={guide}>
        <Input placeholder="현재 보유하고 있는 면허를 입력해주세요" value={data.currentLicense}
          onChange={(e) => onChange({ ...data, currentLicense: e.target.value })} className="text-base py-6" required />
      </FormSection>
      <AssetScaleField id="surveyAsset" value={data.assetScale}
        onChange={(v) => onChange({ ...data, assetScale: v })} guide={guide}
        hideTotalAssets={hideTotalAssets}
        capitalId="surveyCapital" capitalValue={data.capitalScale} capitalOnChange={(v) => onChange({ ...data, capitalScale: v })} />
    </>
  );
}

function OtherFields({ data, hideTotalAssets, industry, onChange }: { data: ConstructionOtherData; hideTotalAssets: boolean; industry: string; onChange: (d: ConstructionOtherData) => void }) {
  const guide = tabGuides.other;
  return (
    <>
      <AssetScaleField
        id="otherAsset"
        labelSuffix={industry !== "construction" ? "(증자 이전)" : ""}
        value={data.assetScale}
        onChange={(v) => onChange({ ...data, assetScale: v })}
        guide={guide}
        hideTotalAssets={hideTotalAssets}
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
  const { industry: industryParam, tab: tabParam } = useParams<{ industry?: string; tab?: string }>();

  const [industry, setIndustry] = useState(industryParam ?? "");
  const [currentBusinessStatus, setCurrentBusinessStatus] = useState("");
  const [hasExistingBusiness, setHasExistingBusiness] = useState<boolean | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const [constructionRequestNature, setConstructionRequestNature] = useState("");
  const [constructionCategory, setConstructionCategory] = useState("");
  const [registeredBusiness, setRegisteredBusiness] = useState("");
  const [businessSearchQuery, setBusinessSearchQuery] = useState("");
  const [constructionPurpose, setConstructionPurpose] = useState("");
  const [constructionRegistrationType, setConstructionRegistrationType] = useState("");
  const [otherPurpose, setOtherPurpose] = useState("");
  const [fieldRegistrationStatus, setFieldRegistrationStatus] = useState("");
  const [fieldRequestNature, setFieldRequestNature] = useState("");
  const [fieldPurpose, setFieldPurpose] = useState("");
  const [nationalHeritagePurposeOther, setNationalHeritagePurposeOther] = useState("");
  const [nationalHeritageBusiness, setNationalHeritageBusiness] = useState("");
  const [nationalHeritageBusinessSearch, setNationalHeritageBusinessSearch] = useState("");
  const [pharmaceuticalTargetBusiness, setPharmaceuticalTargetBusiness] = useState("");
  const [pharmaceuticalDiagnosisPurpose, setPharmaceuticalDiagnosisPurpose] = useState("");
  const [pharmaceuticalPurposeOther, setPharmaceuticalPurposeOther] = useState("");
  const [fireContractorType, setFireContractorType] = useState("");
  const [selectedFireFields, setSelectedFireFields] = useState<string[]>([]);
  const [firePurposeOther, setFirePurposeOther] = useState("");
  const [selectedForestryFields, setSelectedForestryFields] = useState<string[]>([]);
  const [forestryPurposeOther, setForestryPurposeOther] = useState("");
  const [showForestryIndividualNotice, setShowForestryIndividualNotice] = useState(false);
  const [electricalDiagnosisPurpose, setElectricalDiagnosisPurpose] = useState("");
  const [electricalPurposeDetails, setElectricalPurposeDetails] = useState("");
  const [customIndustryName, setCustomIndustryName] = useState("");
  const [customDiagnosisDetails, setCustomDiagnosisDetails] = useState("");
  const [purpose,  setPurpose]  = useState<ProjectTab | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlinePeriod, setDeadlinePeriod] = useState("");
  const [deadlineHour, setDeadlineHour] = useState("");
  const [deadlineMinute, setDeadlineMinute] = useState("");
  const confirmationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showSubmitConfirmation) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modal = confirmationRef.current;
    modal?.querySelector<HTMLButtonElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitLock.current) { event.preventDefault(); setShowSubmitConfirmation(false); }
      if (event.key !== 'Tab' || !modal) return;
      const buttons = Array.from(modal.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
      if (!buttons.length) { event.preventDefault(); return; }
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [showSubmitConfirmation]);
  const businessSectionRef = useRef<HTMLDivElement>(null);
  const diagnosisSectionRef = useRef<HTMLDivElement>(null);
  const financialSectionRef = useRef<HTMLDivElement>(null);
  const deadlineSectionRef = useRef<HTMLDivElement>(null);
  const otherInfoSectionRef = useRef<HTMLDivElement>(null);

  // 목적별 폼 데이터 (타입별로 분리 유지)
  const [licenseData,  setLicenseData]  = useState<ConstructionLicenseData>(initialConstructionLicenseData);
  const [periodicData, setPeriodicData] = useState<ElectricalPeriodicData>(initialElectricalPeriodicData);
  const [surveyData,   setSurveyData]   = useState<ConstructionSurveyData>(initialConstructionSurveyData);
  const [otherData,    setOtherData]    = useState<ConstructionOtherData>(initialConstructionOtherData);

  // URL 파라미터 변경 시 업종 즉시 반영
  useEffect(() => {
    setIndustry(currentBusinessStatus ? industryParam ?? "" : "");
    setLicenseData(initialConstructionLicenseData);
    setPeriodicData(initialElectricalPeriodicData);
    setSurveyData(initialConstructionSurveyData);
    setOtherData(initialConstructionOtherData);
  }, [industryParam]);

  useEffect(() => {
    if (!currentBusinessStatus) {
      setPurpose("");
      return;
    }
    if (industryParam && tabParam) {
      setPurpose("");
      navigate(`/client/create-project/${industryParam}`, { replace: true });
      return;
    }
    setPurpose(["license", "periodic", "survey", "other"].includes(tabParam ?? "") ? tabParam as ProjectTab : "");
  }, [industryParam, navigate, tabParam]);

  const resetFinancialDetails = () => {
    setLicenseData(initialConstructionLicenseData);
    setPeriodicData(initialElectricalPeriodicData);
    setSurveyData(initialConstructionSurveyData);
    setOtherData(initialConstructionOtherData);
    setPurpose("");
    setIsReviewing(false);
    setDeadlineDate("");
    setDeadlinePeriod("");
    setDeadlineHour("");
    setDeadlineMinute("");
  };

  const resetConstructionPurposeDetails = () => {
    setConstructionPurpose("");
    setConstructionRegistrationType("");
    setOtherPurpose("");
    resetFinancialDetails();
  };

  const resetAfterConstructionType = () => {
    setRegisteredBusiness("");
    setBusinessSearchQuery("");
    resetConstructionPurposeDetails();
  };

  const resetAfterConstructionRegistration = () => {
    setConstructionCategory("");
    resetAfterConstructionType();
  };

  const resetIndustrySpecificDetails = () => {
    setRegistrationStatus("");
    setConstructionRequestNature("");
    resetAfterConstructionRegistration();
    setFieldRegistrationStatus("");
    setFieldRequestNature("");
    setFieldPurpose("");
    setNationalHeritagePurposeOther("");
    setNationalHeritageBusiness("");
    setNationalHeritageBusinessSearch("");
    setPharmaceuticalTargetBusiness("");
    setPharmaceuticalDiagnosisPurpose("");
    setPharmaceuticalPurposeOther("");
    setFireContractorType("");
    setSelectedFireFields([]);
    setFirePurposeOther("");
    setSelectedForestryFields([]);
    setForestryPurposeOther("");
    setElectricalDiagnosisPurpose("");
    setElectricalPurposeDetails("");
    setCustomIndustryName("");
    setCustomDiagnosisDetails("");
  };

  const resetDiagnosisDetails = () => {
    setIndustry("");
    setHasExistingBusiness(null);
    setShowForestryIndividualNotice(false);
    resetIndustrySpecificDetails();
  };

  const applyAutomaticConstructionValues = (registrationValue: string) => {
    const isAutomaticNewRegistration = currentBusinessStatus === "startup" || registrationValue === "no";
    setConstructionRequestNature(
      isAutomaticNewRegistration ? "new-registration" : registrationValue === "yes" ? "existing-registration" : "undetermined",
    );
    setConstructionPurpose(isAutomaticNewRegistration ? "construction-registration" : "");
    setConstructionRegistrationType(isAutomaticNewRegistration ? "new-registration" : "");
  };

  const handleCurrentBusinessStatusChange = (v: string) => {
    if (v === currentBusinessStatus) return;
    setCurrentBusinessStatus(v);
    resetDiagnosisDetails();
  };

  const handleIndustryChange = (v: string) => {
    if (!currentBusinessStatus) return;
    if (currentBusinessStatus === "individual" && v === "forestry") {
      resetIndustrySpecificDetails();
      setIndustry("");
      setHasExistingBusiness(null);
      setShowForestryIndividualNotice(true);
      return;
    }
    if (v === industry) return;
    setShowForestryIndividualNotice(false);
    resetIndustrySpecificDetails();
    setIndustry(v);
    setHasExistingBusiness(currentBusinessStatus === "startup" ? false : null);
    if (currentBusinessStatus === "startup" && v === "construction") {
      setRegistrationStatus("no");
      applyAutomaticConstructionValues("no");
    }
    if (currentBusinessStatus === "startup" && v === "electrical") {
      setElectricalDiagnosisPurpose("license");
    }
    if (currentBusinessStatus === "startup" && v === "forestry") {
      setFieldPurpose("new-registration");
    }
  };

  const handleExistingBusinessChange = (value: string) => {
    const nextValue = value === "true";
    if (hasExistingBusiness === nextValue) return;
    resetIndustrySpecificDetails();
    setHasExistingBusiness(nextValue);
  };

  const handleRegistrationStatusChange = (v: string) => {
    if (v === registrationStatus) return;
    resetAfterConstructionRegistration();
    setRegistrationStatus(v);
    applyAutomaticConstructionValues(v);
  };

  const handleConstructionCategoryChange = (v: string) => {
    if (v === constructionCategory) return;
    resetAfterConstructionType();
    setConstructionCategory(v);
    applyAutomaticConstructionValues(registrationStatus);
  };

  const handleRegisteredBusinessChange = (v: string) => {
    if (v === registeredBusiness) return;
    resetConstructionPurposeDetails();
    setRegisteredBusiness(v);
    applyAutomaticConstructionValues(registrationStatus);
  };

  const handleConstructionPurposeChange = (v: string) => {
    if (v === constructionPurpose && !otherPurpose.trim()) return;
    resetFinancialDetails();
    setConstructionPurpose(v);
    setOtherPurpose("");
    setConstructionRegistrationType(
      v === "construction-registration" && registrationStatus === "yes" ? "additional-business" : "",
    );
  };

  const handleOtherPurposeChange = (value: string) => {
    const wasDirectPurpose = Boolean(otherPurpose.trim());
    const isDirectPurpose = Boolean(value.trim());
    if (wasDirectPurpose !== isDirectPurpose || (isDirectPurpose && constructionPurpose)) {
      resetFinancialDetails();
    }
    setOtherPurpose(value);
    if (isDirectPurpose) {
      setConstructionPurpose("");
      setConstructionRegistrationType("");
    }
  };

  const handleFieldRegistrationStatusChange = (v: string) => {
    if (v === fieldRegistrationStatus) return;
    resetFinancialDetails();
    setFieldRegistrationStatus(v);
    setFieldRequestNature(
      v === "no" ? "new-registration" : v === "yes" ? "existing-registration" : "undetermined",
    );
    setFieldPurpose(
      industry === "forestry" && (currentBusinessStatus === "startup" || v === "no")
        ? "new-registration"
        : "",
    );
    setNationalHeritagePurposeOther("");
    setNationalHeritageBusiness("");
    setNationalHeritageBusinessSearch("");
    setPharmaceuticalTargetBusiness("");
    setPharmaceuticalDiagnosisPurpose("");
    setPharmaceuticalPurposeOther("");
    setFireContractorType("");
    setSelectedFireFields([]);
    setFirePurposeOther("");
    setSelectedForestryFields([]);
    setForestryPurposeOther("");
  };

  const handleConstructionRegistrationTypeChange = (v: string) => {
    if (v === constructionRegistrationType) return;
    resetFinancialDetails();
    setConstructionRegistrationType(v);
  };

  const handleElectricalDiagnosisPurposeChange = (v: string) => {
    if (v === electricalDiagnosisPurpose) return;
    resetFinancialDetails();
    setElectricalDiagnosisPurpose(v);
    setElectricalPurposeDetails("");
  };

  const handleElectricalPurposeDetailsChange = (value: string) => {
    if (value !== electricalPurposeDetails) resetFinancialDetails();
    setElectricalPurposeDetails(value);
  };

  const handleFieldPurposeChange = (v: string) => {
    if (v === fieldPurpose) return;
    resetFinancialDetails();
    setFieldPurpose(v);
  };

  const handleNationalHeritageCategoryChange = (value: string) => {
    if (value === fieldPurpose) return;
    resetFinancialDetails();
    setFieldPurpose(value);
    setNationalHeritageBusiness(
      value === "general-national-heritage-repair" ? generalNationalHeritageBusiness.value : "",
    );
    setNationalHeritageBusinessSearch("");
  };

  const handlePharmaceuticalTargetBusinessChange = (value: string) => {
    if (value === pharmaceuticalTargetBusiness) return;
    resetFinancialDetails();
    setPharmaceuticalTargetBusiness(value);
    setPharmaceuticalDiagnosisPurpose("");
    setPharmaceuticalPurposeOther("");
  };

  const handleFireContractorTypeChange = (value: string) => {
    if (value === fireContractorType) return;
    resetFinancialDetails();
    setFireContractorType(value);
    setSelectedFireFields([]);
    setFieldPurpose("");
    setFirePurposeOther("");
  };

  const toggleFireField = (value: string) => {
    resetFinancialDetails();
    setSelectedFireFields((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const toggleForestryField = (value: string) => {
    resetFinancialDetails();
    setSelectedForestryFields((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    );
  };

  const handleCustomIndustryNameChange = (value: string) => {
    if (value !== customIndustryName) {
      resetFinancialDetails();
      setCustomDiagnosisDetails("");
    }
    setCustomIndustryName(value);
  };

  const handleCustomDiagnosisDetailsChange = (value: string) => {
    if (value !== customDiagnosisDetails) resetFinancialDetails();
    setCustomDiagnosisDetails(value);
  };

  const isConstructionSelectionComplete =
    industry === "construction" &&
    Boolean(currentBusinessStatus) &&
    (currentBusinessStatus === "startup" || hasExistingBusiness !== null) &&
    Boolean(registrationStatus && constructionCategory && registeredBusiness && (constructionPurpose || otherPurpose.trim())) &&
    (constructionPurpose !== "construction-registration" || registrationStatus === "unsure" || Boolean(constructionRegistrationType));

  const isOtherSelectionComplete = industry === "other" && Boolean(currentBusinessStatus && (currentBusinessStatus === "startup" || hasExistingBusiness !== null) && customIndustryName.trim());
  const isElectricalSelectionComplete =
    industry === "electrical" && Boolean(currentBusinessStatus && (currentBusinessStatus === "startup" || hasExistingBusiness !== null) && electricalDiagnosisPurpose);
  const isNonConstructionSelectionComplete =
    Boolean(currentBusinessStatus && (currentBusinessStatus === "startup" || hasExistingBusiness !== null) && nonConstructionFieldConfig[industry] && fieldRegistrationStatus) &&
    (industry === "national-heritage"
      ? Boolean(fieldPurpose && (fieldPurpose !== "specialty-national-heritage-repair" || nationalHeritageBusiness))
      : industry === "pharmaceutical"
        ? Boolean(pharmaceuticalTargetBusiness && pharmaceuticalDiagnosisPurpose)
      : industry === "fire"
        ? Boolean(fireContractorType && (fireContractorType !== "general" || selectedFireFields.length > 0) && fieldPurpose)
      : industry === "forestry"
        ? Boolean(currentBusinessStatus !== "individual" && selectedForestryFields.length > 0 && fieldPurpose)
      : fieldRegistrationStatus !== "yes" || Boolean(fieldPurpose));
  const isSelectionComplete =
    isConstructionSelectionComplete || isElectricalSelectionComplete || isNonConstructionSelectionComplete || isOtherSelectionComplete;

  const constructionProjectPurpose: ProjectTab = constructionPurpose === "construction-registration"
    ? "license"
    : constructionPurpose === "survey-response"
      ? "survey"
      : "other";
  const commonProjectPurpose: ProjectTab = industry === "construction"
    ? constructionProjectPurpose
    : industry === "electrical"
      ? (electricalDiagnosisPurpose as ProjectTab || "other")
      : fieldRegistrationStatus === "no"
        ? "license"
        : "other";

  const constructionBusinesses =
    constructionCategory === "general"
      ? generalConstructionBusinesses
      : specialtyConstructionBusinesses;
  const normalizedBusinessSearchQuery = normalizeBusinessSearch(businessSearchQuery);
  const filteredConstructionBusinesses = constructionBusinesses.filter((business) => {
    if (!normalizedBusinessSearchQuery) return true;
    return [business.label, ...business.keywords].some((searchTarget) =>
      normalizeBusinessSearch(searchTarget).includes(normalizedBusinessSearchQuery),
    );
  });
  const normalizedNationalHeritageSearch = normalizeBusinessSearch(nationalHeritageBusinessSearch);
  const filteredNationalHeritageBusinesses = specialtyNationalHeritageBusinesses.filter((business) =>
    !normalizedNationalHeritageSearch || [business.label, ...business.keywords].some((searchTarget) =>
      normalizeBusinessSearch(searchTarget).includes(normalizedNationalHeritageSearch),
    ),
  );

  const getSelectionValidationMessage = () => {
    if (!currentBusinessStatus) return "현재 사업 상태를 선택해 주세요.";
    if (!industry) return "진단 분야를 선택해 주세요.";
    if (industry === "forestry" && currentBusinessStatus === "individual") {
      return "산림사업법인은 개인사업자로 등록할 수 없습니다. 법인사업자나 창업예정을 선택해 주세요.";
    }
    if (currentBusinessStatus !== "startup" && hasExistingBusiness === null) {
      return "현재 운영 중인 사업이 있는지 선택해 주세요.";
    }
    if (industry === "construction") {
      if (!registrationStatus) return "건설업 등록증 보유 여부를 선택해 주세요.";
      if (!constructionCategory) return "건설업 구분을 선택해 주세요.";
      if (!registeredBusiness) return "진단 대상 업종을 선택해 주세요.";
      if (!constructionPurpose && !otherPurpose.trim()) {
        return "진단 목적을 선택하거나 그 외 진단 목적을 입력해 주세요.";
      }
      if (constructionPurpose === "construction-registration" && registrationStatus !== "unsure" && !constructionRegistrationType) {
        return "등록 구분을 선택해 주세요.";
      }
    }
    if (industry === "electrical" && !electricalDiagnosisPurpose) {
      return "진단 목적을 선택해 주세요.";
    }
    if (nonConstructionFieldConfig[industry] && !fieldRegistrationStatus) {
      return "등록 보유 여부를 선택해 주세요.";
    }
    if (!["national-heritage", "pharmaceutical", "fire", "forestry"].includes(industry) && nonConstructionFieldConfig[industry] && fieldRegistrationStatus === "yes" && !fieldPurpose) {
      return "의뢰 목적을 선택해 주세요.";
    }
    if (industry === "national-heritage" && !fieldPurpose) {
      return "국가유산수리업 구분을 선택해 주세요.";
    }
    if (industry === "national-heritage" && fieldPurpose === "specialty-national-heritage-repair" && !nationalHeritageBusiness) {
      return "진단 대상 업종을 선택해 주세요.";
    }
    if (industry === "pharmaceutical") {
      if (!pharmaceuticalTargetBusiness) return "진단 대상 업종을 선택해 주세요.";
      if (!pharmaceuticalDiagnosisPurpose) return "진단 목적을 선택해 주세요.";
    }
    if (industry === "fire") {
      if (!fireContractorType) return "소방시설공사업 구분을 선택해 주세요.";
      if (fireContractorType === "general" && selectedFireFields.length === 0) {
        return "분야 구분을 하나 이상 선택해 주세요.";
      }
      if (!fieldPurpose) return "진단 목적을 선택해 주세요.";
    }
    if (industry === "forestry") {
      if (selectedForestryFields.length === 0) return "산림사업 분야를 하나 이상 선택해 주세요.";
      if (!fieldPurpose) return "진단 목적을 선택해 주세요.";
    }
    if (industry === "other" && !customIndustryName.trim()) {
      return "진단이 필요한 업종을 입력해 주세요.";
    }
    return null;
  };

  const handleNext = () => {
    const validationMessage = getSelectionValidationMessage();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    let nextPurpose: ProjectTab = "other";
    if (industry === "electrical") {
      nextPurpose = electricalDiagnosisPurpose as ProjectTab;
      if (nextPurpose === "license") {
        setLicenseData((data) => ({ ...data, customReason: electricalPurposeDetails }));
      } else if (nextPurpose === "periodic") {
        setPeriodicData((data) => ({ ...data, customReason: electricalPurposeDetails }));
      } else if (nextPurpose === "survey") {
        setSurveyData((data) => ({ ...data, customReason: electricalPurposeDetails }));
      } else {
        setOtherData((data) => ({ ...data, customReason: electricalPurposeDetails }));
      }
    } else if (fieldRegistrationStatus === "no") {
      nextPurpose = "license";
    }

    setLicenseData((data) => ({ ...data, businessType: currentBusinessStatus as any }));
    setPeriodicData((data) => ({ ...data, businessType: currentBusinessStatus as any }));
    setSurveyData((data) => ({ ...data, businessType: currentBusinessStatus as any }));
    setOtherData((data) => ({ ...data, businessType: currentBusinessStatus as any }));
    setPurpose(nextPurpose);
    navigate(`/client/create-project/${industry}/${nextPurpose}`);
  };

  const handleDetailPrevious = () => {
    setPurpose("");
    navigate(`/client/create-project/${industry}`);
  };

  const visibleTabs = industry ? getVisibleTabs(industry) : [];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!industry) {
      toast.error("진단 분야를 선택해 주세요.");
      return;
    }
    const effectivePurpose = commonProjectPurpose;
    if (!effectivePurpose) {
      toast.error("진단 목적을 선택해 주세요.");
      return;
    }
    if (submitLock.current || isSubmitting) return;
    if (!showSubmitConfirmation) { handleReview(e.currentTarget); return; }
    if (!getStoredAccessToken()) { toast.error("비회원 의뢰는 휴대폰 인증 연결 후 이용할 수 있습니다."); return; }

    if (!currentBusinessStatus) {
      toast.error("현재 사업 상태를 선택해 주세요.");
      return;
    }

    {
      const validationMessage = getSelectionValidationMessage();
      if (validationMessage) {
        toast.error(validationMessage);
        return;
      }
    }

    const currentData = industry === "construction" ? licenseData
      : effectivePurpose === "license" ? licenseData
      : effectivePurpose === "periodic" ? periodicData
      : effectivePurpose === "survey"   ? surveyData
      : otherData;

    let financialPayload: ReturnType<typeof buildRequestFinancialPayload>;
    try { financialPayload = buildRequestFinancialPayload(currentData, currentBusinessStatus); }
    catch (error) { toast.error(error instanceof Error ? error.message : "재무 정보를 확인해 주세요."); return; }
    const deadlineValidationMessage = getDeadlineValidationMessage();
    if (deadlineValidationMessage) {
      toast.error(deadlineValidationMessage);
      return;
    }

    // 회원: clientInfoId 필수 검증
    const clientInfoId = Number(Cookies.get("CLIENT_INFO_ID") ?? 0);
    if (!Number.isSafeInteger(clientInfoId) || clientInfoId <= 0) {
      toast.error("기업 정보가 없습니다. 기업 정보를 먼저 등록해주세요.");
      return;
    }

    submitLock.current = true;
    setIsSubmitting(true);

    const isLoggedIn = !!getStoredAccessToken();

    const selectedBusinessLabel = constructionBusinesses.find((business) => business.value === registeredBusiness)?.label ?? registeredBusiness;
    const constructionClassification = constructionRegistrationType === "additional-business"
      ? "ADD"
      : constructionRegistrationType === "new-registration"
        ? "NEW"
        : null;

    const currentIndustryStatus = currentBusinessStatus === "startup"
      ? "NONE"
      : effectivePurpose === "license"
        ? (hasExistingBusiness ? "CONSTRUCTION_RELATED" : "NONE")
        : hasExistingBusiness === false
          ? "NONE"
          : null;
    const currentIndustryDetail = currentIndustryStatus === "CONSTRUCTION_RELATED"
      ? "현재 사업 운영 중"
      : null;

    const payload = {
      clientInfoId,
      industry:              INDUSTRY_MAP[industry] || industry.toUpperCase(),
      purpose:               PURPOSE_MAP[effectivePurpose] || effectivePurpose.toUpperCase(),
      businessOwnerType:     OWNER_TYPE_MAP[currentBusinessStatus] ?? null,
      ...financialPayload,
      category:              industry === "construction" ? constructionClassification : ((currentData as any).classification?.toUpperCase() ?? null),
      requiredLicense:       industry === "construction" && effectivePurpose === "license" ? selectedBusinessLabel : ((currentData as any).requiredLicense || null),
      currentIndustryStatus,
      currentIndustryDetail,
      heldLicense:           industry === "construction" && effectivePurpose === "survey" ? selectedBusinessLabel : ((currentData as any).currentLicense || null),
      diagnosisReason:       null,
      diagnosisReasonDetail: industry === "construction"
        ? (otherPurpose.trim() || null)
        : industry === "electrical"
          ? (electricalPurposeDetails.trim() || (electricalDiagnosisPurpose === "other" ? "양도·양수" : null))
          : industry === "fire"
            ? (firePurposeOther.trim() || null)
          : industry === "forestry"
            ? (forestryPurposeOther.trim() || null)
          : industry === "national-heritage"
            ? (nationalHeritagePurposeOther.trim() || null)
          : ((currentData as any).customReason || null),
    };


    try {
      const res = await userInstance.post(
        isLoggedIn ? "/announcements" : "/announcements/guest",
        payload,
      );
      if (!res.data?.success) throw new Error(res.data?.message || "의뢰를 등록하지 못했습니다.");
      if (res.data.success) {
        const code = res.data.data?.announcement_code;
        if (typeof code !== "string" || !code.trim()) {
          toast.info("등록 응답에서 의뢰 코드를 확인하지 못했습니다. 내 의뢰 목록을 확인해 주세요.");
          navigate("/client/projects");
          return;
        }
        if (isLoggedIn) {
          navigate(`/client/project-success/${encodeURIComponent(code)}`);
        } else {
          window.sessionStorage.setItem("guestLatestProjectId", code);
          navigate("/client/project-success");
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "의뢰 등록에 실패했습니다.";
      console.error("[Announcement] 400 error:", error.response?.data);
      toast.error(msg);
    } finally {
      submitLock.current = false;
      setIsSubmitting(false);
    }
  };

  const activeFinancialData = industry === "construction" ? licenseData
    : commonProjectPurpose === "license" ? licenseData
    : commonProjectPurpose === "periodic" ? periodicData
    : commonProjectPurpose === "survey" ? surveyData
    : otherData;
  const isFinancialInfoValid =
    parseFinancialAmount(activeFinancialData.capitalScale) !== null &&
    (currentBusinessStatus === "startup" || parseFinancialAmount(activeFinancialData.assetScale) !== null);

  useEffect(() => {
    if (isFinancialInfoValid) return;
    setDeadlineDate("");
    setDeadlinePeriod("");
    setDeadlineHour("");
    setDeadlineMinute("");
  }, [isFinancialInfoValid]);

  const selectedDeadline = getDeadlineDate(deadlineDate, deadlinePeriod, deadlineHour, deadlineMinute);
  const getDeadlineValidationMessage = () => {
    if (!deadlineDate && !deadlinePeriod && !deadlineHour && !deadlineMinute) return null;
    if (!selectedDeadline) return "의뢰 마감 날짜와 시간을 모두 선택해 주세요.";
    const now = new Date();
    if (selectedDeadline.getTime() < getMinimumSelectableDeadline(now).getTime()) {
      return "의뢰 마감은 현재 시각에서 최소 20분 이후로 선택해 주세요.";
    }
    if (selectedDeadline.getTime() > now.getTime() + 48 * 60 * 60 * 1000) return "의뢰 마감은 현재 시각부터 48시간 이내로 선택해 주세요.";
    return null;
  };

  const handleReview = (form: HTMLFormElement | null) => {
    if (!form?.reportValidity()) return;
    const validationMessage = getSelectionValidationMessage();
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }
    try { buildRequestFinancialPayload(activeFinancialData, currentBusinessStatus); }
    catch (error) { toast.error(error instanceof Error ? error.message : "재무 정보를 확인해 주세요."); return; }
    const deadlineValidationMessage = getDeadlineValidationMessage();
    if (deadlineValidationMessage) {
      toast.error(deadlineValidationMessage);
      return;
    }
    setIsReviewing(true);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  };

  const editReviewSection = (sectionRef: RefObject<HTMLDivElement | null>, returnToSelection = false) => {
    setIsReviewing(false);
    if (returnToSelection && purpose) {
      setPurpose("");
      navigate(`/client/create-project/${industry}`);
    }
    requestAnimationFrame(() => requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })));
  };

  const businessStatusLabels: Record<string, string> = {
    corporation: "법인 사업자",
    individual: "개인 사업자",
    startup: "창업 예정",
  };
  const registrationStatusLabels: Record<string, string> = {
    no: "아니요",
    yes: "예",
    unsure: "잘 모르겠어요",
  };
  const constructionCategoryLabels: Record<string, string> = {
    general: "종합건설업",
    specialty: "전문건설업",
  };
  const constructionPurposeLabels: Record<string, string> = {
    "construction-registration": "건설업 등록(면허 취득)",
    "survey-response": "실태조사 대응",
  };
  const registrationTypeLabels: Record<string, string> = {
    "new-registration": "신규 등록",
    "additional-business": "업종 추가",
  };
  const selectedIndustryLabel = industries.find((option) => option.value === industry)?.label ?? industry;
  const selectedConstructionBusinessLabel = constructionBusinesses.find((business) => business.value === registeredBusiness)?.label ?? registeredBusiness;
  const businessReviewRows = [
    { label: "현재 사업 상태", value: businessStatusLabels[currentBusinessStatus] ?? currentBusinessStatus },
    ...(currentBusinessStatus !== "startup" && hasExistingBusiness !== null
      ? [{ label: "현재 사업 운영 여부", value: hasExistingBusiness ? "예" : "아니요" }]
      : []),
  ];
  const diagnosisReviewRows = industry === "construction"
    ? [
        { label: "진단 분야", value: selectedIndustryLabel },
        { label: "건설업 등록 여부", value: registrationStatusLabels[registrationStatus] ?? registrationStatus },
        { label: "건설업 구분", value: constructionCategoryLabels[constructionCategory] ?? constructionCategory },
        { label: "진단 대상 업종", value: selectedConstructionBusinessLabel },
        { label: "진단 목적", value: constructionPurposeLabels[constructionPurpose] ?? otherPurpose.trim() },
        ...(constructionRegistrationType
          ? [{
              label: registrationStatus === "unsure" ? "등록 구분" : "등록 구분 (자동판단)",
              value: registrationTypeLabels[constructionRegistrationType] ?? constructionRegistrationType,
            }]
          : []),
      ].filter((row) => row.value)
    : [
        { label: "진단 분야", value: selectedIndustryLabel },
        ...(industry === "electrical" && electricalDiagnosisPurpose
          ? [{ label: "진단 목적", value: electricalDiagnosisPurposeOptions.find((option) => option.value === electricalDiagnosisPurpose)?.label ?? electricalDiagnosisPurpose }]
          : []),
        ...(fieldRegistrationStatus
          ? [{ label: "등록 보유 여부", value: registrationStatusLabels[fieldRegistrationStatus] ?? fieldRegistrationStatus }]
          : []),
        ...(fieldPurpose
          ? [{
              label: industry === "national-heritage" ? "국가유산수리업 구분" : "진단 목적",
              value: (() => {
                const nationalHeritagePurpose = nationalHeritagePurposeOptions.find((option) => option.value === fieldPurpose);
                const firePurpose = fireDiagnosisPurposeOptions.find((option) => option.value === fieldPurpose);
                const forestryPurpose = forestryDiagnosisPurposeOptions.find((option) => option.value === fieldPurpose);
                return nationalHeritagePurpose
                  ? nationalHeritagePurpose.label
                  : firePurpose
                    ? firePurpose.label
                  : forestryPurpose
                    ? forestryPurpose.label
                  : commonExistingRegistrationPurposes.find((option) => option.value === fieldPurpose)?.label ?? fieldPurpose;
              })(),
            }]
          : []),
        ...(industry === "fire" && fireContractorType
          ? [
              {
                label: "소방시설공사업 구분",
                value: fireContractorTypes.find((option) => option.value === fireContractorType)?.label ?? fireContractorType,
              },
              ...(selectedFireFields.length > 0
                ? [{
                    label: "분야 구분",
                    value: selectedFireFields.map((value) => fireFieldOptions.find((option) => option.value === value)?.label ?? value).join(", "),
                  }]
                : []),
            ]
          : []),
        ...(industry === "forestry" && selectedForestryFields.length > 0
          ? [{
              label: "산림사업 분야",
              value: selectedForestryFields.map((value) => forestryFieldOptions.find((option) => option.value === value)?.label ?? value).join(", "),
            }]
          : []),
        ...(industry === "national-heritage" && nationalHeritageBusiness
          ? [{
              label: "진단 대상 업종",
              value: nationalHeritageBusiness === generalNationalHeritageBusiness.value
                ? generalNationalHeritageBusiness.label
                : specialtyNationalHeritageBusinesses.find((option) => option.value === nationalHeritageBusiness)?.label ?? nationalHeritageBusiness,
            }]
          : []),
        ...(industry === "pharmaceutical" && pharmaceuticalTargetBusiness
          ? [
              {
                label: "진단 대상 업종",
                value: pharmaceuticalTargetBusinesses.find((option) => option.value === pharmaceuticalTargetBusiness)?.label ?? pharmaceuticalTargetBusiness,
              },
              ...(pharmaceuticalDiagnosisPurpose
                ? [{
                    label: "진단 목적",
                    value: pharmaceuticalDiagnosisPurposes.find((option) => option.value === pharmaceuticalDiagnosisPurpose)?.label ?? pharmaceuticalDiagnosisPurpose,
                  }]
                : []),
            ]
          : []),
        ...(customIndustryName.trim() ? [{ label: "입력 업종", value: customIndustryName.trim() }] : []),
      ];
  const financialReviewRows = [
    {
      label: currentBusinessStatus === "startup" ? "예정 자본금" : "자본금",
      value: `${Number((activeFinancialData as any).capitalScale).toFixed(2)}억원`,
    },
    ...(currentBusinessStatus !== "startup"
      ? [{ label: "현재 총자산", value: `${Number((activeFinancialData as any).assetScale).toFixed(2)}억원` }]
      : []),
  ];
  const deadlineReviewRows = selectedDeadline
    ? [{ label: "의뢰 마감", value: formatDeadline(selectedDeadline) }]
    : [];
  const otherReviewRows = [
    ...(electricalPurposeDetails.trim() ? [{ label: "추가 진단 내용", value: electricalPurposeDetails.trim() }] : []),
    ...(firePurposeOther.trim() ? [{ label: "그 외 목적", value: firePurposeOther.trim() }] : []),
    ...(forestryPurposeOther.trim() ? [{ label: "그 외 목적", value: forestryPurposeOther.trim() }] : []),
    ...(pharmaceuticalPurposeOther.trim() ? [{ label: "그 외 목적", value: pharmaceuticalPurposeOther.trim() }] : []),
    ...(nationalHeritagePurposeOther.trim() ? [{ label: "그 외 목적", value: nationalHeritagePurposeOther.trim() }] : []),
    ...(customDiagnosisDetails.trim() ? [{ label: "추가 진단 내용", value: customDiagnosisDetails.trim() }] : []),
  ];


  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{isReviewing ? "의뢰 내용 확인" : "의뢰 등록"}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {isReviewing ? "제출하기 전에 입력한 내용을 한 번 더 확인해 주세요." : "진단에 필요한 정보를 순서대로 입력해 주세요."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`bg-white rounded-2xl shadow-sm border border-gray-100 space-y-8 ${isReviewing ? "p-4 sm:p-6" : "p-8"}`}>
        {isReviewing ? (
          <div className="space-y-3">
            <p role="status" className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">업종별 세부 조건 일부와 희망 마감은 아직 저장을 지원하지 않습니다. 기본 의뢰 정보 등록 후 상세 내용을 다시 확인해 주세요.</p>
            <ReviewCard title="사업 정보" rows={businessReviewRows} onEdit={() => editReviewSection(businessSectionRef, true)} />
            <ReviewCard title="진단 정보" rows={diagnosisReviewRows} onEdit={() => editReviewSection(diagnosisSectionRef, true)} />
            <ReviewCard title="재무 정보" rows={financialReviewRows} onEdit={() => editReviewSection(financialSectionRef)} />
            <ReviewCard title="희망 마감 미리보기 · 저장되지 않음" rows={deadlineReviewRows} onEdit={() => editReviewSection(deadlineSectionRef)} />
            {otherReviewRows.length > 0 && (
              <ReviewCard title="기타 정보" rows={otherReviewRows} onEdit={() => editReviewSection(otherInfoSectionRef, true)} />
            )}

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                className="h-14 text-lg"
                onClick={() => editReviewSection(businessSectionRef, true)}
              >
                전체 수정하기
              </Button>
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={() => setShowSubmitConfirmation(true)}
                className="h-14 bg-blue-600 text-lg text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:bg-blue-700 focus-visible:ring-blue-300 disabled:bg-blue-200 disabled:text-white disabled:opacity-100"
              >
                {isSubmitting ? "등록 중..." : "의뢰 등록하기"}
              </Button>
            </div>
          </div>
        ) : (
          <>
        {!purpose && (
          <>
        <div ref={businessSectionRef} className="scroll-mt-6">
        <FormSection label="현재 사업 상태" guide={fieldGuides.businessType}>
          <ChoiceButtonGroup
            columnsClassName="grid-cols-1 sm:grid-cols-3"
            options={[
              { label: "법인 사업자", value: "corporation" },
              { label: "개인 사업자", value: "individual" },
              { label: "창업 예정", value: "startup" },
            ]}
            value={currentBusinessStatus}
            onChange={handleCurrentBusinessStatusChange}
          />
        </FormSection>
        </div>

        <div ref={diagnosisSectionRef} className="scroll-mt-6">
        <FormSection label="진단 분야" guide={fieldGuides.industry}>
          <ChoiceButtonGroup
            columnsClassName="grid-cols-2 md:grid-cols-4"
            options={industries}
            value={industry}
            onChange={handleIndustryChange}
            disabled={!currentBusinessStatus}
          />
        </FormSection>
        {showForestryIndividualNotice && (
          <p className="mt-3 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            산림사업법인은 개인사업자로 등록할 수 없습니다. 법인사업자나 창업예정을 선택해 주세요.
          </p>
        )}
        </div>

        {industry && currentBusinessStatus && currentBusinessStatus !== "startup" &&
          !(industry === "forestry" && currentBusinessStatus === "individual") && (
          <FormSection label={existingBusinessQuestions[industry]}>
            <ChoiceButtonGroup
              columnsClassName="grid-cols-2"
              options={[
                { label: "예", value: "true" },
                { label: "아니요", value: "false" },
              ]}
              value={hasExistingBusiness === null ? "" : String(hasExistingBusiness)}
              onChange={handleExistingBusinessChange}
            />
          </FormSection>
        )}

        {industry === "construction" && (
          <div className="space-y-8">
            <SectionDivider title={diagnosisSectionTitles.construction} />
            <p className="text-sm text-gray-500">
              현재 건설업 등록 여부를 기준으로 필요한 진단 내용을 안내합니다.
            </p>

            {currentBusinessStatus === "startup" && (
              <p className="text-sm text-blue-600">
                창업 예정으로 선택하여 신규 등록(면허 취득)으로 자동 적용되었습니다.
              </p>
            )}

            {currentBusinessStatus !== "startup" && registrationStatus === "no" && (
              <p className="text-sm text-blue-600">
                건설업 미등록 상태이므로 신규 등록(면허 취득)으로 자동 적용됩니다.
              </p>
            )}

            {currentBusinessStatus !== "startup" && hasExistingBusiness !== null && (
              <FormSection label="현재 건설업 등록증을 보유하고 있나요?">
                <ChoiceButtonGroup
                  columnsClassName="grid-cols-3"
                  options={[
                    { label: "아니요", value: "no" },
                    { label: "예", value: "yes" },
                    { label: "잘 모르겠어요", value: "unsure" },
                  ]}
                  value={registrationStatus}
                  onChange={handleRegistrationStatusChange}
                />
              </FormSection>
            )}

            {registrationStatus && (
              <FormSection label="건설업 구분">
                <ChoiceButtonGroup
                  columnsClassName="grid-cols-2"
                  options={[
                    { label: "종합건설업", value: "general" },
                    { label: "전문건설업", value: "specialty" },
                  ]}
                  value={constructionCategory}
                  onChange={handleConstructionCategoryChange}
                />
              </FormSection>
            )}

            {constructionCategory && (
              <FormSection
                label="진단 대상 업종"
                description="이번 기업진단과 관련된 건설업 등록업종을 선택해 주세요."
              >
                <Input
                  type="search"
                  value={businessSearchQuery}
                  onChange={(event) => setBusinessSearchQuery(event.target.value)}
                  placeholder="업종명을 입력해 빠르게 찾아보세요 (선택)"
                  className="py-6"
                />
                {filteredConstructionBusinesses.length > 0 ? (
                  <ChoiceButtonGroup
                    columnsClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                    options={filteredConstructionBusinesses}
                    value={registeredBusiness}
                    onChange={handleRegisteredBusinessChange}
                  />
                ) : (
                  <p className="rounded-lg bg-gray-50 px-4 py-5 text-center text-sm text-gray-500">
                    일치하는 등록업종이 없습니다. 검색어를 다시 확인해 주세요.
                  </p>
                )}
              </FormSection>
            )}

            {registrationStatus && registrationStatus !== "no" && registeredBusiness && currentBusinessStatus !== "startup" && (
              <FormSection label="진단 목적">
                <ChoiceButtonGroup
                  columnsClassName="grid-cols-1 sm:grid-cols-2 max-w-2xl"
                  options={[
                    { label: "건설업 등록(면허 취득)", value: "construction-registration" },
                    { label: "실태조사 대응", value: "survey-response" },
                  ]}
                  value={constructionPurpose}
                  onChange={handleConstructionPurposeChange}
                />

                <div ref={otherInfoSectionRef} className="space-y-2 pt-2 scroll-mt-6">
                  <Label htmlFor="other-purpose" className="text-sm font-medium text-gray-700">
                    그 외 진단 목적이 있다면 직접 입력해 주세요 (선택)
                  </Label>
                  <Textarea
                    id="other-purpose"
                    rows={3}
                    value={otherPurpose}
                    onChange={(event) => handleOtherPurposeChange(event.target.value)}
                    placeholder="예: 양수·양도 관련 진단, 합병 관련 진단, 행정기관 제출용 등"
                    className="min-h-20 resize-none"
                  />
                </div>

                {registrationStatus === "unsure" && constructionPurpose === "construction-registration" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-semibold">
                        등록 구분 <span className="text-sm font-normal text-gray-500">(선택)</span>
                      </Label>
                    </div>
                    <ChoiceButtonGroup
                      columnsClassName="grid-cols-2 max-w-xl"
                      options={[
                        { label: "신규 등록", value: "new-registration" },
                        { label: "업종 추가", value: "additional-business" },
                      ]}
                      value={constructionRegistrationType}
                      onChange={handleConstructionRegistrationTypeChange}
                    />
                  </div>
                )}
              </FormSection>
            )}

            {isConstructionSelectionComplete && (
              <div ref={financialSectionRef} className="space-y-8 scroll-mt-6">
                <AssetScaleField
                  id="constructionAsset"
                  value={licenseData.assetScale}
                  onChange={(value) => setLicenseData((data) => ({ ...data, assetScale: value }))}
                  guide={tabGuides[constructionProjectPurpose]}
                  hideTotalAssets={currentBusinessStatus === "startup"}
                  capitalId="constructionCapital"
                  capitalValue={licenseData.capitalScale}
                  capitalOnChange={(value) => setLicenseData((data) => ({ ...data, capitalScale: value }))}
                />
                {isFinancialInfoValid && <div ref={deadlineSectionRef} className="scroll-mt-6">
                  <DeadlineField
                    date={deadlineDate}
                    period={deadlinePeriod}
                    hour={deadlineHour}
                    minute={deadlineMinute}
                    onDateChange={setDeadlineDate}
                    onPeriodChange={setDeadlinePeriod}
                    onHourChange={setDeadlineHour}
                    onMinuteChange={setDeadlineMinute}
                  />
                </div>}
              </div>
            )}

          </div>
        )}

        {industry === "electrical" && (
          <div className="space-y-8">
            <SectionDivider title={diagnosisSectionTitles.electrical} />
            <FormSection label="진단 목적">
              {currentBusinessStatus === "startup" ? (
                <p className="text-sm text-blue-600">
                  창업 예정으로 선택하여 전기공사업 등록(면허 취득)으로 자동 적용되었습니다.
                </p>
              ) : (
                <ChoiceButtonGroup
                  columnsClassName="grid-cols-1 sm:grid-cols-4"
                  options={electricalDiagnosisPurposeOptions}
                  value={electricalDiagnosisPurpose}
                  onChange={handleElectricalDiagnosisPurposeChange}
                />
              )}

              <div ref={otherInfoSectionRef} className="space-y-2 pt-2 scroll-mt-6">
                <Label htmlFor="electrical-purpose-details" className="text-sm font-medium text-gray-700">
                  {currentBusinessStatus === "startup"
                    ? "추가로 전달할 내용이 있다면 입력해 주세요 (선택)"
                    : "그 외 목적이 있다면 직접 입력해 주세요 (선택)"}
                </Label>
                <Textarea
                  id="electrical-purpose-details"
                  rows={3}
                  value={electricalPurposeDetails}
                  onChange={(event) => handleElectricalPurposeDetailsChange(event.target.value)}
                  placeholder={currentBusinessStatus === "startup"
                    ? "예: 참고할 특이사항 등"
                    : "예: 법인합병, 분할, 변경 관련 진단, 행정기관 제출용 등"}
                  className="min-h-20 resize-none"
                />
              </div>
            </FormSection>
          </div>
        )}

        {nonConstructionFieldConfig[industry] &&
          (industry !== "national-heritage" || hasExistingBusiness !== null) &&
          !(industry === "forestry" && currentBusinessStatus === "individual") && (
          <div className="space-y-8">
            <SectionDivider title={nonConstructionFieldConfig[industry].title} />

            <FormSection label={nonConstructionFieldConfig[industry].registrationQuestion}>
              <ChoiceButtonGroup
                columnsClassName="grid-cols-1 sm:grid-cols-3"
                options={registrationStatusOptions}
                value={fieldRegistrationStatus}
                onChange={handleFieldRegistrationStatusChange}
              />
            </FormSection>

            {fieldRegistrationStatus && !["national-heritage", "pharmaceutical", "fire", "forestry"].includes(industry) && nonConstructionFieldConfig[industry].detailLabel && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {nonConstructionFieldConfig[industry].detailLabel}
                </Label>
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500">
                  기존 프로젝트에 정의된 목록이 없어 선택 구조만 준비했습니다.
                </div>
              </div>
            )}

            {industry === "forestry" && fieldRegistrationStatus && (
              <div className="space-y-8">
                <FormSection
                  label="산림사업 분야"
                  description="해당되는 분야를 모두 선택해 주세요. 복수 선택 가능합니다."
                >
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {forestryFieldOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant="outline"
                        className={`h-auto min-h-12 py-3 ${selectedForestryFields.includes(option.value) ? ACTIVE : INACTIVE_HOVER}`}
                        onClick={() => toggleForestryField(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </FormSection>

                <FormSection label="진단 목적">
                  {currentBusinessStatus === "startup" || fieldRegistrationStatus === "no" ? (
                    <p className="text-sm text-blue-600">
                      {currentBusinessStatus === "startup"
                        ? "창업 예정으로 선택하여 신규 등록으로 자동 적용되었습니다."
                        : "산림사업법인 미등록 상태이므로 신규 등록으로 자동 적용되었습니다."}
                    </p>
                  ) : (
                    <ChoiceButtonGroup
                      columnsClassName={`grid-cols-1 ${fieldRegistrationStatus === "yes" ? "sm:grid-cols-3" : "sm:grid-cols-4"}`}
                      options={fieldRegistrationStatus === "yes"
                        ? forestryDiagnosisPurposeOptions.filter((option) => option.value !== "new-registration")
                        : forestryDiagnosisPurposeOptions}
                      value={fieldPurpose}
                      onChange={handleFieldPurposeChange}
                    />
                  )}
                  <div className="space-y-2 pt-2">
                    <Label htmlFor="forestry-purpose-other" className="text-sm font-medium text-gray-700">
                      {currentBusinessStatus === "startup" || fieldRegistrationStatus === "no"
                        ? "추가로 의뢰할 내용이 있다면 입력해 주세요 (선택)"
                        : <>그 외 목적이 있다면 직접 입력해 주세요 <span className="font-normal text-gray-500">(선택)</span></>}
                    </Label>
                    <Textarea
                      id="forestry-purpose-other"
                      rows={3}
                      value={forestryPurposeOther}
                      onChange={(event) => setForestryPurposeOther(event.target.value)}
                      placeholder="예: 행정기관 제출용, 기타 등록 관련 진단"
                      className="min-h-20 resize-none"
                    />
                  </div>
                </FormSection>
              </div>
            )}

            {industry === "fire" && fieldRegistrationStatus && (
              <div className="space-y-8">
                <FormSection label="소방시설공사업 구분">
                  <ChoiceButtonGroup
                    columnsClassName="grid-cols-1 sm:grid-cols-2"
                    options={fireContractorTypes}
                    value={fireContractorType}
                    onChange={handleFireContractorTypeChange}
                  />
                </FormSection>

                {fireContractorType === "general" && (
                  <FormSection label="분야 구분 (복수 선택 가능)">
                    <div className="grid grid-cols-2 gap-3">
                      {fireFieldOptions.map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant="outline"
                          className={selectedFireFields.includes(option.value) ? ACTIVE : INACTIVE_HOVER}
                          onClick={() => toggleFireField(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </FormSection>
                )}

                {fireContractorType && (
                  <FormSection label="진단 목적">
                    <ChoiceButtonGroup
                      columnsClassName="grid-cols-1 sm:grid-cols-4"
                      options={fireDiagnosisPurposeOptions}
                      value={fieldPurpose}
                      onChange={handleFieldPurposeChange}
                    />
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="fire-purpose-other" className="text-sm font-medium text-gray-700">
                        그 외 목적이 있다면 직접 입력해 주세요 <span className="font-normal text-gray-500">(선택)</span>
                      </Label>
                      <Textarea
                        id="fire-purpose-other"
                        rows={3}
                        value={firePurposeOther}
                        onChange={(event) => setFirePurposeOther(event.target.value)}
                        placeholder="예: 행정기관 제출용, 법인 변경, 기타 등록 관련 진단 등"
                        className="min-h-20 resize-none"
                      />
                    </div>
                  </FormSection>
                )}
              </div>
            )}

            {industry === "pharmaceutical" && fieldRegistrationStatus && (
              <div className="space-y-8">
                <FormSection label="진단 대상 업종">
                  <ChoiceButtonGroup
                    columnsClassName="grid-cols-1 sm:grid-cols-3"
                    options={pharmaceuticalTargetBusinesses}
                    value={pharmaceuticalTargetBusiness}
                    onChange={handlePharmaceuticalTargetBusinessChange}
                  />
                </FormSection>

                {pharmaceuticalTargetBusiness && (
                  <FormSection label="진단 목적">
                    <ChoiceButtonGroup
                      columnsClassName="grid-cols-1 sm:grid-cols-3"
                      options={pharmaceuticalDiagnosisPurposes}
                      value={pharmaceuticalDiagnosisPurpose}
                      onChange={(value) => {
                        if (value !== pharmaceuticalDiagnosisPurpose) resetFinancialDetails();
                        setPharmaceuticalDiagnosisPurpose(value);
                      }}
                    />
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="pharmaceutical-purpose-other" className="text-sm font-medium text-gray-700">
                        그 외 목적이 있다면 직접 입력해 주세요 <span className="font-normal text-gray-500">(선택)</span>
                      </Label>
                      <Textarea
                        id="pharmaceutical-purpose-other"
                        rows={3}
                        value={pharmaceuticalPurposeOther}
                        onChange={(event) => setPharmaceuticalPurposeOther(event.target.value)}
                        placeholder="예: 합병 관련 진단, 행정기관 제출용, 등록기준 충족 여부 확인 등"
                        className="min-h-20 resize-none"
                      />
                    </div>
                  </FormSection>
                )}
              </div>
            )}

            {industry === "national-heritage" && fieldRegistrationStatus && (
              <FormSection label="국가유산수리업 구분">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {nationalHeritagePurposeOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant="outline"
                      className={`h-auto min-h-16 py-3 ${fieldPurpose === option.value ? ACTIVE : INACTIVE_HOVER}`}
                      onClick={() => handleNationalHeritageCategoryChange(option.value)}
                    >
                      <span className="leading-snug">{option.label}</span>
                    </Button>
                  ))}
                </div>
                {fieldPurpose === "general-national-heritage-repair" && (
                  <div className="space-y-3 pt-2">
                    <Label className="text-base font-semibold">
                      진단 대상 업종 <span className="text-red-500">*</span>
                    </Label>
                    <ChoiceButtonGroup
                      columnsClassName="grid-cols-1"
                      options={[generalNationalHeritageBusiness]}
                      value={nationalHeritageBusiness}
                      onChange={() => {}}
                    />
                  </div>
                )}
                {fieldPurpose === "specialty-national-heritage-repair" && (
                  <div className="space-y-3 pt-2">
                    <Label className="text-base font-semibold">
                      진단 대상 업종 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="search"
                      value={nationalHeritageBusinessSearch}
                      onChange={(event) => setNationalHeritageBusinessSearch(event.target.value)}
                      placeholder="업종명을 입력해 빠르게 찾아보세요 (선택)"
                      className="py-6"
                    />
                    {filteredNationalHeritageBusinesses.length > 0 ? (
                      <ChoiceButtonGroup
                        columnsClassName="grid-cols-2 md:grid-cols-3"
                        options={filteredNationalHeritageBusinesses}
                        value={nationalHeritageBusiness}
                        onChange={(value) => {
                          if (value !== nationalHeritageBusiness) resetFinancialDetails();
                          setNationalHeritageBusiness(value);
                        }}
                      />
                    ) : (
                      <p className="rounded-lg bg-gray-50 px-4 py-5 text-center text-sm text-gray-500">
                        일치하는 등록업종이 없습니다. 검색어를 다시 확인해 주세요.
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-2 pt-2">
                  <Label htmlFor="national-heritage-purpose-other" className="text-sm font-medium text-gray-700">
                    그 외 목적 <span className="font-normal text-gray-500">(선택)</span>
                  </Label>
                  <Textarea
                    id="national-heritage-purpose-other"
                    rows={3}
                    value={nationalHeritagePurposeOther}
                    onChange={(event) => setNationalHeritagePurposeOther(event.target.value)}
                    placeholder="예: 양수·양도 관련 진단, 합병 관련 진단, 행정기관 제출용 등"
                    className="min-h-20 resize-none"
                  />
                </div>
              </FormSection>
            )}

            {fieldRegistrationStatus === "yes" && !["national-heritage", "pharmaceutical", "fire", "forestry"].includes(industry) && (
              <FormSection label="의뢰 목적">
                <ChoiceButtonGroup
                  columnsClassName="grid-cols-2 md:grid-cols-4"
                  options={commonExistingRegistrationPurposes}
                  value={fieldPurpose}
                  onChange={handleFieldPurposeChange}
                />
              </FormSection>
            )}
          </div>
        )}

        {industry === "other" && (
          <div className="space-y-8">
            <SectionDivider title={diagnosisSectionTitles.other} />
            <div ref={otherInfoSectionRef} className="space-y-3 scroll-mt-6">
              <Label htmlFor="custom-industry-name" className="text-base font-semibold">
                진단이 필요한 업종을 직접 입력해 주세요. <span className="text-red-500">*</span>
              </Label>
              <Input
                id="custom-industry-name"
                value={customIndustryName}
                onChange={(event) => handleCustomIndustryNameChange(event.target.value)}
                className="py-6"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="custom-diagnosis-details" className="text-base font-semibold">
                의뢰 목적 또는 필요한 진단 내용을 입력해 주세요.
              </Label>
              <textarea
                id="custom-diagnosis-details"
                value={customDiagnosisDetails}
                onChange={(event) => handleCustomDiagnosisDetailsChange(event.target.value)}
                rows={4}
                className="flex w-full rounded-md border border-input bg-input-background px-3 py-3 text-base outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              />
            </div>
          </div>
        )}

          </>
        )}

        {industry !== "construction" && isSelectionComplete && (
          <div ref={financialSectionRef} className="space-y-8 scroll-mt-6">
            <AssetScaleField
              id={`${industry}Asset`}
              value={(activeFinancialData as any).assetScale}
              onChange={(value) => {
                if (commonProjectPurpose === "license") setLicenseData((data) => ({ ...data, assetScale: value }));
                else if (commonProjectPurpose === "periodic") setPeriodicData((data) => ({ ...data, assetScale: value }));
                else if (commonProjectPurpose === "survey") setSurveyData((data) => ({ ...data, assetScale: value }));
                else setOtherData((data) => ({ ...data, assetScale: value }));
              }}
              guide={tabGuides[commonProjectPurpose]}
              hideTotalAssets={currentBusinessStatus === "startup"}
              capitalId={`${industry}Capital`}
              capitalValue={(activeFinancialData as any).capitalScale}
              capitalOnChange={(value) => {
                if (commonProjectPurpose === "license") setLicenseData((data) => ({ ...data, capitalScale: value }));
                else if (commonProjectPurpose === "periodic") setPeriodicData((data) => ({ ...data, capitalScale: value }));
                else if (commonProjectPurpose === "survey") setSurveyData((data) => ({ ...data, capitalScale: value }));
                else setOtherData((data) => ({ ...data, capitalScale: value }));
              }}
            />
            {isFinancialInfoValid && <div ref={deadlineSectionRef} className="scroll-mt-6">
              <DeadlineField
                date={deadlineDate}
                period={deadlinePeriod}
                hour={deadlineHour}
                minute={deadlineMinute}
                onDateChange={setDeadlineDate}
                onPeriodChange={setDeadlinePeriod}
                onHourChange={setDeadlineHour}
                onMinuteChange={setDeadlineMinute}
              />
            </div>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            className="h-14 text-lg"
            onClick={purpose ? handleDetailPrevious : () => navigate("/client/company-info")}
          >
            이전
          </Button>
          <Button
            type="button"
            onClick={(event) => handleReview(event.currentTarget.form)}
            className="h-14 text-lg bg-[#34499C] hover:bg-[#2a3d84] disabled:bg-blue-200 disabled:text-white disabled:opacity-100"
          >
            입력 내용 확인
          </Button>
        </div>
          </>
        )}

        {showSubmitConfirmation && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            role="presentation"
            onMouseDown={(event) => {
              if (event.currentTarget === event.target && !isSubmitting) setShowSubmitConfirmation(false);
            }}
          >
            <div
              ref={confirmationRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="submit-confirmation-title"
              aria-describedby="submit-confirmation-description"
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
              <h2 id="submit-confirmation-title" className="text-xl font-bold text-gray-900">
                이 내용으로 의뢰를 등록할까요?
              </h2>
              <p id="submit-confirmation-description" className="mt-3 break-keep text-sm leading-6 text-gray-600">
                등록하면 전문가들이 의뢰 내용을 확인하고 진단수수료를 제안할 수 있습니다.
              </p>
              {selectedDeadline && (
                <div className="mt-5 rounded-lg bg-blue-50 px-4 py-3">
                  <p className="text-xs font-medium text-blue-700">희망 마감 미리보기 · 저장되지 않음</p>
                  <p className="mt-1 font-semibold text-blue-900">{formatDeadline(selectedDeadline)}</p>
                </div>
              )}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => setShowSubmitConfirmation(false)}
                  className="border-blue-600 bg-white text-blue-600 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 active:bg-blue-100"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus-visible:bg-blue-700 focus-visible:ring-blue-300"
                >
                  {isSubmitting ? "등록 중..." : "의뢰 등록하기"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
