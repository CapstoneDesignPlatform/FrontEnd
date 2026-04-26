import type { FormEvent } from "react";
import type { EmblaViewportRefType } from "embla-carousel-react";
import { ChevronLeft, ChevronRight, FileText, Plus } from "lucide-react";

import type { ExpertVerificationStatus } from "../../../../types/expertVerification";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { BusinessLicenseCard } from "./BusinessLicenseCard";
import { CareerForm } from "./CareerForm";
import { CertificateCard } from "./CertificateCard";
import type {
  VerificationBusinessLicenseData,
  VerificationCareerData,
  VerificationCertificateData,
} from "./types";

interface ExpertVerificationFormCardProps {
  businessLicense: VerificationBusinessLicenseData;
  canSubmit: boolean;
  career: VerificationCareerData;
  certificates: VerificationCertificateData[];
  emblaRef: EmblaViewportRefType;
  isPending: boolean;
  isSubmitting: boolean;
  verificationStatus: ExpertVerificationStatus;
  onAddCertificate: () => void;
  onBusinessLicenseChange: (data: VerificationBusinessLicenseData) => void;
  onCareerChange: (data: VerificationCareerData) => void;
  onCertificateChange: (
    id: string,
    data: VerificationCertificateData,
  ) => void;
  onCertificateDelete: (id: string) => void;
  onSkip: () => void;
  onSubmit: (event: FormEvent) => void;
  scrollNext: () => void;
  scrollPrev: () => void;
}

export function ExpertVerificationFormCard({
  businessLicense,
  canSubmit,
  career,
  certificates,
  emblaRef,
  isPending,
  isSubmitting,
  verificationStatus,
  onAddCertificate,
  onBusinessLicenseChange,
  onCareerChange,
  onCertificateChange,
  onCertificateDelete,
  onSkip,
  onSubmit,
  scrollNext,
  scrollPrev,
}: ExpertVerificationFormCardProps) {
  return (
    <Card className="overflow-hidden border-black/10 shadow-sm">
      <CardContent className="p-0">
        <form onSubmit={onSubmit} className="space-y-8 p-6">
          <CertificateSection
            canSubmit={canSubmit}
            certificates={certificates}
            emblaRef={emblaRef}
            isPending={isPending || isSubmitting}
            onAddCertificate={onAddCertificate}
            onCertificateChange={onCertificateChange}
            onCertificateDelete={onCertificateDelete}
            scrollNext={scrollNext}
            scrollPrev={scrollPrev}
          />

          <BusinessLicenseSection
            businessLicense={businessLicense}
            isPending={isPending || isSubmitting}
            onBusinessLicenseChange={onBusinessLicenseChange}
          />

          <CareerSection
            career={career}
            isPending={isPending || isSubmitting}
            onCareerChange={onCareerChange}
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
  emblaRef: EmblaViewportRefType;
  isPending: boolean;
  onAddCertificate: () => void;
  onCertificateChange: (
    id: string,
    data: VerificationCertificateData,
  ) => void;
  onCertificateDelete: (id: string) => void;
  scrollNext: () => void;
  scrollPrev: () => void;
}

function CertificateSection({
  canSubmit,
  certificates,
  emblaRef,
  isPending,
  onAddCertificate,
  onCertificateChange,
  onCertificateDelete,
  scrollNext,
  scrollPrev,
}: CertificateSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[18px] font-medium text-foreground">
            인증 정보 입력
          </h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            대표 자격증은 첫 번째 카드 기준으로 인증 신청에 반영됩니다.
          </p>
        </div>

        {canSubmit ? (
          <Button
            type="button"
            onClick={onAddCertificate}
            className="gap-2 bg-teal-600 hover:bg-teal-700"
            disabled={isPending}
          >
            <Plus className="h-4 w-4" />
            자격증 추가
          </Button>
        ) : null}
      </div>

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <CertificateCarouselHeader
          certificateCount={certificates.length}
          scrollNext={scrollNext}
          scrollPrev={scrollPrev}
        />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {certificates.map((certificate, index) => (
              <div
                key={certificate.id}
                className="min-w-0 flex-[0_0_100%] lg:flex-[0_0_78%]"
              >
                <CertificateCard
                  certificate={certificate}
                  disabled={isPending}
                  isPrimary={index === 0}
                  onChange={(data) =>
                    onCertificateChange(certificate.id, data)
                  }
                  onDelete={
                    certificates.length > 1 && !isPending
                      ? () => onCertificateDelete(certificate.id)
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CertificateCarouselHeaderProps {
  certificateCount: number;
  scrollNext: () => void;
  scrollPrev: () => void;
}

function CertificateCarouselHeader({
  certificateCount,
  scrollNext,
  scrollPrev,
}: CertificateCarouselHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="space-y-1">
        <h3 className="text-[16px] font-medium text-foreground">
          자격증 정보
        </h3>
        <p className="text-[13px] text-muted-foreground">
          여러 자격증을 보유한 경우 슬라이드로 추가 등록할 수 있습니다.
        </p>
      </div>

      {certificateCount > 1 ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="이전 자격증 보기"
            className="rounded-full border border-black/10 p-2 text-muted-foreground transition-colors hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="다음 자격증 보기"
            className="rounded-full border border-black/10 p-2 text-muted-foreground transition-colors hover:bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
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

interface CareerSectionProps {
  career: VerificationCareerData;
  isPending: boolean;
  onCareerChange: (data: VerificationCareerData) => void;
}

function CareerSection({
  career,
  isPending,
  onCareerChange,
}: CareerSectionProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-[18px] font-medium text-foreground">경력 정보</h3>
      <div className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <CareerForm
          career={career}
          disabled={isPending}
          onChange={onCareerChange}
        />
      </div>
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
