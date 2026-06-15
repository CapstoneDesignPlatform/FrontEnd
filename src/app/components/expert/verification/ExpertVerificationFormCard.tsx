import type { FormEvent } from "react";
import { FileText, Plus } from "lucide-react";

import type { ExpertVerificationStatus } from "../../../../types/expertVerification";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { cn } from "../../ui/utils";
import { BusinessLicenseCard } from "./BusinessLicenseCard";
import { CertificateCard } from "./CertificateCard";
import type {
  VerificationBusinessLicenseData,
  VerificationCertificateData,
} from "./types";
import {
  MANAGEMENT_CONSULTANT_CERTIFICATE_TYPE,
  MULTIPLE_CERTIFICATE_REQUIRED_TYPE,
  QUALIFICATION_CERTIFICATE_REQUIREMENTS,
  QUALIFICATION_TYPE_OPTIONS,
} from "./verificationConstants";

interface ExpertVerificationFormCardProps {
  businessLicense: VerificationBusinessLicenseData;
  canSubmit: boolean;
  certificates: VerificationCertificateData[];
  isPending: boolean;
  isSubmitting: boolean;
  qualificationType: string;
  verificationStatus: ExpertVerificationStatus;
  onAddCertificate: () => void;
  onBusinessLicenseChange: (data: VerificationBusinessLicenseData) => void;
  onCertificateChange: (
    id: string,
    data: VerificationCertificateData,
  ) => void;
  onCertificateDelete: (id: string) => void;
  onQualificationTypeChange: (value: string) => void;
  onSkip: () => void;
  onSubmit: (event: FormEvent) => void;
}

export function ExpertVerificationFormCard({
  businessLicense,
  canSubmit,
  certificates,
  isPending,
  isSubmitting,
  qualificationType,
  verificationStatus,
  onAddCertificate,
  onBusinessLicenseChange,
  onCertificateChange,
  onCertificateDelete,
  onQualificationTypeChange,
  onSkip,
  onSubmit,
}: ExpertVerificationFormCardProps) {
  return (
    <Card className="overflow-hidden border-black/10 shadow-sm">
      <CardContent className="p-0">
        <form onSubmit={onSubmit} className="space-y-8 p-6">
          <CertificateSection
            canSubmit={canSubmit}
            certificates={certificates}
            isPending={isPending || isSubmitting}
            qualificationType={qualificationType}
            onAddCertificate={onAddCertificate}
            onCertificateChange={onCertificateChange}
            onCertificateDelete={onCertificateDelete}
            onQualificationTypeChange={onQualificationTypeChange}
          />

          <BusinessLicenseSection
            businessLicense={businessLicense}
            isPending={isPending || isSubmitting}
            onBusinessLicenseChange={onBusinessLicenseChange}
          />

          {verificationStatus === "REJECTED" ? <RejectedNotice /> : null}
          {isPending ? <PendingNotice /> : null}

          {canSubmit ? (
            <FormActions isSubmitting={isSubmitting} onSkip={onSkip} />
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}

interface CertificateSectionProps {
  canSubmit: boolean;
  certificates: VerificationCertificateData[];
  isPending: boolean;
  qualificationType: string;
  onAddCertificate: () => void;
  onCertificateChange: (
    id: string,
    data: VerificationCertificateData,
  ) => void;
  onCertificateDelete: (id: string) => void;
  onQualificationTypeChange: (value: string) => void;
}

function CertificateSection({
  canSubmit,
  certificates,
  isPending,
  qualificationType,
  onAddCertificate,
  onCertificateChange,
  onCertificateDelete,
  onQualificationTypeChange,
}: CertificateSectionProps) {
  const certificateTypeOptions =
    qualificationType === MULTIPLE_CERTIFICATE_REQUIRED_TYPE
      ? [MANAGEMENT_CONSULTANT_CERTIFICATE_TYPE]
      : undefined;
  const qualificationRequirement =
    QUALIFICATION_CERTIFICATE_REQUIREMENTS[qualificationType];

  return (
    <section className="space-y-4">
      <div>
        <div>
          <h2 className="text-[18px] font-medium text-foreground">
            인증 정보 입력
          </h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            등록증은 첫 번째 카드 기준으로 인증 신청에 반영됩니다.
          </p>
        </div>
      </div>

      <div
        className={cn(
          "rounded-lg border p-4 shadow-sm transition-colors",
          qualificationType
            ? "border-black/10 bg-white"
            : "border-red-200 bg-red-50/40",
        )}
      >
        <QualificationTypeToggle
          value={qualificationType}
          onChange={onQualificationTypeChange}
          disabled={isPending}
        />
        {qualificationRequirement ? (
          <p className="mt-2 text-[12px] text-blue-700">
            {qualificationRequirement.helperText}
          </p>
        ) : null}
        {!qualificationType ? (
          <p className="mt-2 text-[12px] font-medium text-red-600">
            인증 신청을 위해 자격 종류를 반드시 선택해주세요.
          </p>
        ) : null}
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <CertificateListHeader certificateCount={certificates.length} />

        <div className="space-y-4">
          {certificates.map((certificate, index) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              certificateTypeOptions={certificateTypeOptions}
              disabled={isPending}
              isPrimary={index === 0}
              onChange={(data) => onCertificateChange(certificate.id, data)}
              onDelete={
                certificates.length > 1 && !isPending
                  ? () => onCertificateDelete(certificate.id)
                  : undefined
              }
            />
          ))}

          {canSubmit ? (
            <Button
              type="button"
              variant="outline"
              onClick={onAddCertificate}
              className="h-14 w-full gap-2 border-dashed border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:text-blue-800"
              disabled={isPending}
            >
              <Plus className="h-4 w-4" />
              등록증 추가
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

interface QualificationTypeToggleProps {
  disabled: boolean;
  onChange: (value: string) => void;
  value: string;
}

function QualificationTypeToggle({
  disabled,
  onChange,
  value,
}: QualificationTypeToggleProps) {
  const isRequiredMissing = !value;

  return (
    <fieldset className="space-y-2">
      <legend className="flex items-center gap-2 text-[13px] font-medium text-foreground">
        <span>
          자격 종류 <span className="text-red-500">*</span>
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
            isRequiredMissing
              ? "bg-red-100 text-red-700"
              : "bg-blue-50 text-blue-700",
          )}
        >
          필수 선택
        </span>
      </legend>

      <div
        className={cn(
          "grid grid-cols-3 gap-1 rounded-md p-1 transition-colors",
          isRequiredMissing
            ? "bg-red-100 ring-1 ring-red-200"
            : "bg-gray-100",
        )}
        role="group"
        aria-label="자격 종류"
      >
        {QUALIFICATION_TYPE_OPTIONS.map((option) => {
          const isSelected = value === option;

          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              onClick={() => onChange(option)}
              className={cn(
                "flex min-h-11 items-center justify-center rounded-md px-2 py-2 text-center text-[12px] leading-snug transition-colors disabled:cursor-not-allowed disabled:opacity-60 sm:text-[14px]",
                isSelected
                  ? "bg-white font-medium text-blue-700 shadow-sm ring-1 ring-blue-600"
                  : "text-gray-600 hover:bg-white/70 hover:text-foreground",
                isRequiredMissing && !isSelected
                  ? "bg-white/50 text-red-700"
                  : "",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

interface CertificateListHeaderProps {
  certificateCount: number;
}

function CertificateListHeader({
  certificateCount,
}: CertificateListHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="space-y-1">
        <h3 className="text-[16px] font-medium text-foreground">
          등록증 정보
        </h3>
        <p className="text-[13px] text-muted-foreground">
          여러 등록증을 보유한 경우 아래로 이어서 추가 등록할 수 있습니다.
        </p>
      </div>

      <span className="rounded-full bg-white px-3 py-1 text-[12px] font-medium text-muted-foreground">
        {certificateCount}개
      </span>
    </div>
  );
}

interface BusinessLicenseSectionProps {
  businessLicense: VerificationBusinessLicenseData;
  isPending: boolean;
  onBusinessLicenseChange: (data: VerificationBusinessLicenseData) => void;
}

function BusinessLicenseSection({
  businessLicense,
  isPending,
  onBusinessLicenseChange,
}: BusinessLicenseSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-[18px] font-medium text-foreground">
        사업자 등록 정보
      </h3>
      <BusinessLicenseCard
        license={businessLicense}
        disabled={isPending}
        onChange={onBusinessLicenseChange}
      />
    </section>
  );
}

function RejectedNotice() {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
      제출 내역에 보완이 필요합니다. 수정 후 다시 인증 신청해주세요.
    </div>
  );
}

function PendingNotice() {
  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <FileText className="h-6 w-6 flex-shrink-0 text-yellow-600" />
          <div>
            <h4 className="mb-1 font-medium text-yellow-900">
              검토 중입니다
            </h4>
            <p className="text-sm text-yellow-800">
              제출하신 인증 정보를 검토 중입니다. 1-2일 내에 결과를
              알려드리겠습니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FormActionsProps {
  isSubmitting: boolean;
  onSkip: () => void;
}

function FormActions({ isSubmitting, onSkip }: FormActionsProps) {
  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row">
      <Button type="submit" className="flex-1" disabled={isSubmitting}>
        {isSubmitting ? "인증 신청 중..." : "인증 신청하기"}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex-1"
        disabled={isSubmitting}
        onClick={onSkip}
      >
        나중에 하기
      </Button>
    </div>
  );
}
