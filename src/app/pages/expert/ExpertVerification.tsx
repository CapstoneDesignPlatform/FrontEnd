import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

import { getExpertVerificationStatus, submitExpertVerification } from "../../../api/expert";
import type { ExpertVerificationStatus } from "../../../types/expert";
import { BusinessLicenseCard } from "../../components/expert/verification/BusinessLicenseCard";
import { CareerForm } from "../../components/expert/verification/CareerForm";
import { CertificateCard } from "../../components/expert/verification/CertificateCard";
import type {
  VerificationBusinessLicenseData,
  VerificationCareerData,
  VerificationCertificateData,
} from "../../components/expert/verification/types";

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyCertificate(): VerificationCertificateData {
  return {
    id: createLocalId(),
    type: "",
    number: "",
    issueDate: "",
    name: "",
    file: null,
    previewUrl: "",
  };
}

function createEmptyBusinessLicense(): VerificationBusinessLicenseData {
  return {
    businessNumber: "",
    name: "",
    companyName: "",
    file: null,
    previewUrl: "",
  };
}

function createEmptyCareer(): VerificationCareerData {
  return {
    companyName: "",
    portfolio: "",
  };
}

type OutletContext = {
  user: unknown;
  setUser: (user: { type: "expert"; name: string }) => void;
};

export function ExpertVerification() {
  const navigate = useNavigate();
  const { setUser } = useOutletContext<OutletContext>();
  const [verificationStatus, setVerificationStatus] = useState<ExpertVerificationStatus>("NOT_APPLIED");
  const [certificates, setCertificates] = useState<VerificationCertificateData[]>(() => [
    createEmptyCertificate(),
  ]);
  const [businessLicense, setBusinessLicense] = useState<VerificationBusinessLicenseData>(
    createEmptyBusinessLicense,
  );
  const [career, setCareer] = useState<VerificationCareerData>(createEmptyCareer);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const isApproved = verificationStatus === "APPROVED";
  const isPending = verificationStatus === "PENDING";
  const canSubmit = verificationStatus === "NOT_APPLIED" || verificationStatus === "REJECTED";
  const primaryCertificate = certificates[0];

  useEffect(() => {
    setUser({ type: "expert", name: "전문가" });
  }, [setUser]);

  useEffect(() => {
    void getExpertVerificationStatus().then((request) => {
      setVerificationStatus(request.status);

      if (request.status !== "NOT_APPLIED") {
        setCertificates((current) => {
          const [primary, ...rest] = current;
          return [
            {
              ...primary,
              type: request.licenseType,
              number: request.licenseNumber,
              issueDate: request.issueDate,
            },
            ...rest,
          ];
        });
        setCareer({
          companyName: request.companyName,
          portfolio: request.portfolio ?? "",
        });
      }
    });
  }, []);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const handleAddCertificate = () => {
    if (isPending) return;

    const nextIndex = certificates.length;
    setCertificates((current) => [...current, createEmptyCertificate()]);
    window.setTimeout(() => emblaApi?.scrollTo(nextIndex), 120);
  };

  const handleUpdateCertificate = (
    id: string,
    data: VerificationCertificateData,
  ) => {
    setCertificates((current) =>
      current.map((certificate) => (certificate.id === id ? data : certificate)),
    );
  };

  const handleDeleteCertificate = (id: string) => {
    setCertificates((current) => {
      if (current.length <= 1) return current;
      return current.filter((certificate) => certificate.id !== id);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!primaryCertificate?.file) {
      toast.error("대표 자격증 사본을 업로드해주세요.");
      return;
    }

    if (!businessLicense.file) {
      toast.error("사업자 등록증을 업로드해주세요.");
      return;
    }

    if (!primaryCertificate.type.trim()) {
      toast.error("대표 자격증 종류를 입력해주세요.");
      return;
    }

    if (!primaryCertificate.number.trim()) {
      toast.error("대표 자격증 번호를 입력해주세요.");
      return;
    }

    if (!primaryCertificate.issueDate) {
      toast.error("대표 자격증 발급일을 입력해주세요.");
      return;
    }

    if (!career.companyName.trim()) {
      toast.error("업체명을 입력해주세요.");
      return;
    }

    void submitExpertVerification({
      licenseType: primaryCertificate.type,
      licenseNumber: primaryCertificate.number,
      issueDate: primaryCertificate.issueDate,
      companyName: career.companyName,
      portfolio: career.portfolio,
    }).then(() => {
      toast.success("전문가 인증 신청이 완료되었습니다!");
      navigate("/expert/verification/status?status=PENDING");
    });
  };

  return (
    <div className="mx-auto max-w-[1071px] space-y-6">
      <Card className="overflow-hidden border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <CardHeader className="gap-4 bg-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl">전문가 인증</CardTitle>
            <CardDescription className="mt-2 text-base">
              전문가 인증을 완료해야 입찰과 프로젝트 수주 기능을 이용하실 수
              있습니다.
            </CardDescription>
          </div>

          {verificationStatus === "APPROVED" ? (
            <Badge className="bg-green-100 px-4 py-2 text-base text-green-700">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              인증 완료
            </Badge>
          ) : null}

          {verificationStatus === "PENDING" ? (
            <Badge className="bg-yellow-100 px-4 py-2 text-base text-yellow-700">
              검토 중
            </Badge>
          ) : null}

          {verificationStatus === "REJECTED" ? (
            <Badge className="bg-red-100 px-4 py-2 text-base text-red-700">
              보완 필요
            </Badge>
          ) : null}
        </CardHeader>
      </Card>

      {!isApproved ? (
        <Card className="overflow-hidden border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-8 p-6">
              <section className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-[18px] font-medium tracking-[-0.4395px] text-[#0a0a0a]">
                      인증 정보 입력
                    </h2>
                    <p className="mt-1 text-[14px] tracking-[-0.1504px] text-[#717182]">
                      대표 자격증은 첫 번째 카드 기준으로 인증 신청에 반영됩니다.
                    </p>
                  </div>

                  {canSubmit ? (
                    <Button
                      type="button"
                      onClick={handleAddCertificate}
                      className="gap-2 bg-[#009689] hover:bg-[#008178]"
                    >
                      <Plus className="h-4 w-4" />
                      자격증 추가
                    </Button>
                  ) : null}
                </div>

                <div className="rounded-[14px] border border-[#dfe7ea] bg-[#f9fafb] p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-[16px] font-medium tracking-[-0.3125px] text-[#0a0a0a]">
                        자격증 정보
                      </h3>
                      <p className="text-[13px] tracking-[-0.12px] text-[#717182]">
                        여러 자격증을 보유한 경우 슬라이드로 추가 등록할 수 있습니다.
                      </p>
                    </div>

                    {certificates.length > 1 ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={scrollPrev}
                          className="rounded-full border border-black/10 p-2 text-[#717182] transition-colors hover:bg-white"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={scrollNext}
                          className="rounded-full border border-black/10 p-2 text-[#717182] transition-colors hover:bg-white"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null}
                  </div>

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
                              handleUpdateCertificate(certificate.id, data)
                            }
                            onDelete={
                              certificates.length > 1 && !isPending
                                ? () => handleDeleteCertificate(certificate.id)
                                : undefined
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-[18px] font-medium tracking-[-0.4395px] text-[#0a0a0a]">
                  사업자 등록 정보
                </h3>
                <BusinessLicenseCard
                  license={businessLicense}
                  disabled={isPending}
                  onChange={setBusinessLicense}
                />
              </section>

              <section className="space-y-4">
                <h3 className="text-[18px] font-medium tracking-[-0.4395px] text-[#0a0a0a]">
                  경력 정보
                </h3>
                <div className="rounded-[14px] border border-black/10 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                  <CareerForm
                    career={career}
                    disabled={isPending}
                    onChange={setCareer}
                  />
                </div>
              </section>

              {verificationStatus === "REJECTED" ? (
                <div className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  제출 내역에 보완이 필요합니다. 수정 후 다시 인증 신청해주세요.
                </div>
              ) : null}

              {isPending ? (
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
              ) : null}

              {canSubmit ? (
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#030213] text-white hover:bg-[#1a1a2e]"
                  >
                    인증 신청하기
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/expert/dashboard")}
                  >
                    나중에 하기
                  </Button>
                </div>
              ) : null}
            </form>
          </CardContent>
        </Card>
      ) : null}

      {isApproved ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-green-900 mb-1">
                  인증이 완료되었습니다!
                </h4>
                <p className="text-sm text-green-800 mb-4">
                  이제 인증 전문가로서 더 많은 기회를 얻을 수 있습니다.
                </p>
                <Button asChild>
                  <Link to="/expert/jobs">공고 찾아보기</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
