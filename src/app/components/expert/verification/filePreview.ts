export type VerificationPreviewKind = "image" | "pdf" | "file";

export interface VerificationFilePreview {
  file: File;
  fileName: string;
  previewKind: VerificationPreviewKind;
  previewUrl: string;
}

export function createFilePreview(file: File): VerificationFilePreview {
  const previewUrl = URL.createObjectURL(file);

  return {
    file,
    fileName: file.name,
    previewKind: getPreviewKind(file),
    previewUrl,
  };
}

export function revokeFilePreview(previewUrl: string) {
  if (previewUrl.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl);
  }
}

function getPreviewKind(file: File): VerificationPreviewKind {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return "pdf";
  }

  return "file";
}
