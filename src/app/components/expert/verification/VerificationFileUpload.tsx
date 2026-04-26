import type { ChangeEvent } from "react";
import { FileText, Upload } from "lucide-react";

import { createFilePreview } from "./filePreview";
import type {
  VerificationFilePreview,
  VerificationPreviewKind,
} from "./filePreview";

const ACCEPTED_VERIFICATION_FILE_TYPES =
  "application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png";

interface VerificationFileUploadProps {
  disabled?: boolean;
  fileName: string;
  inputId: string;
  previewAlt: string;
  previewKind: VerificationPreviewKind | null;
  previewUrl: string;
  uploadLabel: string;
  onPreviewChange: (preview: VerificationFilePreview) => void;
}

export function VerificationFileUpload({
  disabled = false,
  fileName,
  inputId,
  previewAlt,
  previewKind,
  previewUrl,
  uploadLabel,
  onPreviewChange,
}: VerificationFileUploadProps) {
  const hasPreview = Boolean(previewKind);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onPreviewChange(createFilePreview(file));
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-50">
      {previewKind === "image" ? (
        <div className="h-[220px] border border-black/5 bg-gray-100">
          <img
            src={previewUrl}
            alt={previewAlt}
            className="h-full w-full object-contain"
          />
        </div>
      ) : null}

      {previewKind === "pdf" ? (
        <div className="h-[220px] overflow-hidden border border-black/5 bg-gray-100">
          <iframe
            src={previewUrl}
            title={`${fileName} 미리보기`}
            className="h-full w-full"
          />
        </div>
      ) : null}

      {previewKind === "file" ? (
        <div className="flex h-[220px] flex-col items-center justify-center gap-3 border border-black/5 bg-gray-100 px-6 text-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
          <p className="break-all text-[14px] text-gray-600">{fileName}</p>
        </div>
      ) : null}

      {hasPreview ? (
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="truncate text-[12px] text-muted-foreground">
            {fileName}
          </p>
          <label
            htmlFor={inputId}
            className={`shrink-0 rounded-md border border-black/10 px-2 py-1 text-[12px] text-gray-600 transition-colors hover:bg-gray-50 ${
              disabled ? "pointer-events-none opacity-50" : "cursor-pointer"
            }`}
          >
            파일 변경
          </label>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`flex h-[220px] flex-col items-center justify-center border-2 border-dashed border-black/15 bg-white text-center transition-all hover:border-teal-600 hover:bg-teal-50 ${
            disabled ? "pointer-events-none opacity-50" : "cursor-pointer"
          }`}
        >
          <Upload className="mb-4 h-8 w-8 text-gray-400" />
          <p className="text-[14px] text-gray-600">{uploadLabel}</p>
          <p className="mt-1 text-[12px] text-gray-400">(PDF, JPG, PNG)</p>
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept={ACCEPTED_VERIFICATION_FILE_TYPES}
        onChange={handleFileUpload}
        disabled={disabled}
        className="sr-only"
      />
    </div>
  );
}
