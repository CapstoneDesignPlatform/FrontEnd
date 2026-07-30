import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import {
  getExpertVerificationStatus,
  submitExpertVerification,
} from "../../../../api/expertVerification";
import { ApiError } from "../../../../api/apiClient";
import { useAsyncAction } from "../../../hooks/useAsyncAction";
import { useAsyncData } from "../../../hooks/useAsyncData";
import type {
  ExpertVerificationStatus,
  ExpertVerificationStatusVM,
  VerificationBusinessLicenseVM,
  VerificationCertificateVM,
} from "../../../../types/expertVerification";
import type {
  VerificationBusinessLicenseData,
  VerificationCertificateData,
} from "./types";
import { useVerificationPreviewUrls } from "./useVerificationPreviewUrls";
import {
  buildSubmitVerificationPayload,
  validateExpertVerificationForm,
} from "./verificationSubmit";
import { CERTIFICATE_TYPE_OPTIONS } from "./verificationConstants";

interface UseExpertVerificationFormOptions {
  onSubmitted: () => void;
  statusOverride?: ExpertVerificationStatus;
}

function createLocalId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptyCertificate(): VerificationCertificateData {
  return {
    id: createLocalId(),
    type: "",
    number: "",
    issueDate: "",
    expiryDate: "",
    name: "",
    file: null,
    fileId: undefined,
    fileName: "",
    previewKind: null,
    previewUrl: "",
  };
}

function createCertificateFromVerification(
  certificate: VerificationCertificateVM,
): VerificationCertificateData {
  return {
    ...createEmptyCertificate(),
    type: certificate.licenseType,
    number: certificate.licenseNumber,
    issueDate: certificate.issueDate,
    expiryDate: certificate.expiryDate,
    name: certificate.holderName ?? "",
    fileId: certificate.fileId,
    fileName: certificate.fileName ?? "",
  };
}

function createPrimaryCertificateFromRequest(
  verificationRequest: ExpertVerificationStatusVM,
): VerificationCertificateData {
  const certificateType = CERTIFICATE_TYPE_OPTIONS.includes(
    verificationRequest.licenseType,
  )
    ? verificationRequest.licenseType
    : "";

  return {
    ...createEmptyCertificate(),
    type: certificateType,
    number: verificationRequest.licenseNumber,
    issueDate: verificationRequest.issueDate,
    expiryDate: verificationRequest.issueDate,
  };
}

function createEmptyBusinessLicense(): VerificationBusinessLicenseData {
  return {
    businessNumber: "",
    name: "",
    companyName: "",
    file: null,
    fileId: undefined,
    fileName: "",
    previewKind: null,
    previewUrl: "",
  };
}

function createBusinessLicenseFromVerification(
  businessLicense?: VerificationBusinessLicenseVM,
): VerificationBusinessLicenseData {
  if (!businessLicense) {
    return createEmptyBusinessLicense();
  }

  return {
    ...createEmptyBusinessLicense(),
    businessNumber: businessLicense.businessNumber ?? "",
    name: businessLicense.ownerName ?? "",
    companyName: businessLicense.companyName ?? "",
    fileId: businessLicense.fileId,
    fileName: businessLicense.fileName ?? "",
  };
}

function releaseCertificatePreviewUrls(
  certificates: VerificationCertificateData[],
  releasePreviewUrl: (previewUrl: string) => void,
) {
  certificates.forEach((certificate) => {
    releasePreviewUrl(certificate.previewUrl);
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getVerificationRequirementMessages(error: ApiError) {
  const payloadData = isRecord(error.payload) ? error.payload.data : undefined;
  const errors = isRecord(payloadData) && Array.isArray(payloadData.errors)
    ? payloadData.errors
    : [];

  return errors
    .map((item) =>
      isRecord(item) && typeof item.message === "string"
        ? item.message
        : undefined,
    )
    .filter((message): message is string => Boolean(message));
}

function getSubmitErrorMessage(error: Error) {
  if (error instanceof ApiError) {
    const requirementMessages = getVerificationRequirementMessages(error);

    if (requirementMessages.length > 0) {
      return requirementMessages.slice(0, 3).join("\n");
    }
  }

  return error.message || "전문가 인증 신청에 실패했습니다.";
}

export function useExpertVerificationForm({
  onSubmitted,
  statusOverride,
}: UseExpertVerificationFormOptions) {
  const { releasePreviewUrl, trackPreviewUrl } = useVerificationPreviewUrls();
  const [verificationStatus, setVerificationStatus] =
    useState<ExpertVerificationStatus>("NOT_APPLIED");
  const [certificates, setCertificates] = useState<VerificationCertificateData[]>(() => [
    createEmptyCertificate(),
  ]);
  const [businessLicense, setBusinessLicense] =
    useState<VerificationBusinessLicenseData>(createEmptyBusinessLicense);
  const [qualificationType, setQualificationType] = useState("");
  const loadVerificationRequest = useCallback(
    () => getExpertVerificationStatus(statusOverride),
    [statusOverride],
  );
  const { data: verificationRequest } = useAsyncData(loadVerificationRequest);
  const { isPending: isSubmitting, run: submitVerification } = useAsyncAction(
    submitExpertVerification,
    {
      onError: (error) => {
        toast.error(getSubmitErrorMessage(error));
      },
      onSuccess: () => {
        toast.success("전문가 인증 신청이 완료되었습니다!");
        onSubmitted();
      },
    },
  );

  const isApproved = verificationStatus === "APPROVED";
  const isPending = verificationStatus === "PENDING";
  const canSubmit =
    verificationStatus === "NOT_APPLIED" || verificationStatus === "REJECTED";

  const resetVerificationForm = useCallback(() => {
    setCertificates((current) => {
      releaseCertificatePreviewUrls(current, releasePreviewUrl);
      return [createEmptyCertificate()];
    });
    setBusinessLicense((current) => {
      releasePreviewUrl(current.previewUrl);
      return createEmptyBusinessLicense();
    });
    setQualificationType("");
  }, [releasePreviewUrl]);

  const applyVerificationRequest = useCallback(
    (request: ExpertVerificationStatusVM) => {
      setQualificationType(request.licenseType);
      setCertificates((current) => {
        releaseCertificatePreviewUrls(current, releasePreviewUrl);

        if (request.certificates?.length) {
          return request.certificates.map(createCertificateFromVerification);
        }

        return [createPrimaryCertificateFromRequest(request)];
      });
      setBusinessLicense((current) => {
        releasePreviewUrl(current.previewUrl);
        const nextBusinessLicense = createBusinessLicenseFromVerification(
          request.businessLicense,
        );
        return {
          ...nextBusinessLicense,
          companyName: nextBusinessLicense.companyName || request.companyName,
        };
      });
    },
    [releasePreviewUrl],
  );

  useEffect(() => {
    if (!verificationRequest) return;

    setVerificationStatus(verificationRequest.status);

    if (verificationRequest.status === "NOT_APPLIED") {
      resetVerificationForm();
      return;
    }

    applyVerificationRequest(verificationRequest);
  }, [applyVerificationRequest, resetVerificationForm, verificationRequest]);

  const handleAddCertificate = useCallback(() => {
    if (isPending) return;

    setCertificates((current) => [...current, createEmptyCertificate()]);
  }, [isPending]);

  const handleUpdateCertificate = useCallback(
    (id: string, data: VerificationCertificateData) => {
      const previous = certificates.find((certificate) => certificate.id === id);
      if (previous?.previewUrl && previous.previewUrl !== data.previewUrl) {
        releasePreviewUrl(previous.previewUrl);
      }
      trackPreviewUrl(data.previewUrl);

      setCertificates((current) =>
        current.map((certificate) => (certificate.id === id ? data : certificate)),
      );
    },
    [certificates, releasePreviewUrl, trackPreviewUrl],
  );

  const handleDeleteCertificate = useCallback(
    (id: string) => {
      if (certificates.length <= 1) return;

      const deleted = certificates.find((certificate) => certificate.id === id);
      if (deleted?.previewUrl) {
        releasePreviewUrl(deleted.previewUrl);
      }

      setCertificates((current) =>
        current.filter((certificate) => certificate.id !== id),
      );
    },
    [certificates, releasePreviewUrl],
  );

  const handleUpdateBusinessLicense = useCallback(
    (data: VerificationBusinessLicenseData) => {
      if (businessLicense.previewUrl && businessLicense.previewUrl !== data.previewUrl) {
        releasePreviewUrl(businessLicense.previewUrl);
      }
      trackPreviewUrl(data.previewUrl);

      setBusinessLicense(data);
    },
    [businessLicense.previewUrl, releasePreviewUrl, trackPreviewUrl],
  );

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      const formValues = {
        businessLicense,
        certificates,
        qualificationType,
      };
      const validationError = validateExpertVerificationForm(formValues);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      void submitVerification(buildSubmitVerificationPayload(formValues));
    },
    [businessLicense, certificates, qualificationType, submitVerification],
  );

  return {
    businessLicense,
    canSubmit,
    certificates,
    handleAddCertificate,
    handleDeleteCertificate,
    handleSubmit,
    handleUpdateBusinessLicense,
    handleUpdateCertificate,
    isApproved,
    isPending,
    isSubmitting,
    qualificationType,
    setQualificationType,
    verificationStatus,
  };
}
