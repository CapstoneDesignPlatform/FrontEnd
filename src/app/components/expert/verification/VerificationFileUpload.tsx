import { useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, Upload } from "lucide-react";

import { cn } from "../../ui/utils";
import { createFilePreview } from "./filePreview";
import type {
  VerificationFilePreview,
  VerificationPreviewKind,
} from "./filePreview";

const ACCEPTED_VERIFICATION_FILE_TYPES =
  "application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png";
const ACCEPTED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
const ACCEPTED_FILE_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

interface VerificationFileUploadProps {
  disabled?: boolean;
  fileName: string;
  heightClassName?: string;
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
  heightClassName = "h-[220px]",
  inputId,
  previewAlt,
  previewKind,
  previewUrl,
  uploadLabel,
  onPreviewChange,
}: VerificationFileUploadProps) {
  const hasPreview = Boolean(previewKind);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleSelectedFile(file);
  };

  const handleSelectedFile = (file?: File) => {
    if (!file) return;

    if (!isAcceptedVerificationFile(file)) {
      setFileError("PDF, JPG, PNG 파일만 업로드할 수 있습니다.");
      return;
    }

    setFileError("");
    onPreviewChange(createFilePreview(file));
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    handleSelectedFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-gray-50 transition-shadow",
        dragActive ? "ring-2 ring-blue-500 ring-offset-2" : "",
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragActive ? (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-blue-50/90 text-[14px] font-medium text-blue-700">
          파일을 놓아 업로드
        </div>
      ) : null}

      {previewKind === "image" ? (
        <div className={`${heightClassName} border border-black/5 bg-gray-100`}>
          <img
            src={previewUrl}
            alt={previewAlt}
            className="h-full w-full object-contain"
          />
        </div>
      ) : null}

      {previewKind === "pdf" ? (
        <div
          className={`${heightClassName} overflow-hidden border border-black/5 bg-gray-100`}
        >
          <iframe
            src={previewUrl}
            title={`${fileName} 미리보기`}
            className="h-full w-full"
          />
        </div>
      ) : null}

      {previewKind === "file" ? (
        <div
          className={`flex ${heightClassName} flex-col items-center justify-center gap-3 border border-black/5 bg-gray-100 px-6 text-center`}
        >
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
          className={`flex ${heightClassName} flex-col items-center justify-center border-2 border-dashed border-black/15 bg-white text-center transition-all hover:border-blue-600 hover:bg-blue-50 ${
            disabled ? "pointer-events-none opacity-50" : "cursor-pointer"
          }`}
        >
          <Upload className="mb-4 h-8 w-8 text-gray-400" />
          <p className="text-[14px] text-gray-600">{uploadLabel}</p>
          <p className="mt-1 text-[12px] text-gray-400">
            또는 파일을 이 영역으로 드래그
          </p>
          <p className="mt-1 text-[12px] text-gray-400">(PDF, JPG, PNG)</p>
        </label>
      )}

      {fileError ? (
        <p className="mt-2 text-[12px] font-medium text-red-600">
          {fileError}
        </p>
      ) : null}

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

function isAcceptedVerificationFile(file: File) {
  const fileName = file.name.toLowerCase();

  return (
    ACCEPTED_MIME_TYPES.has(file.type) ||
    ACCEPTED_FILE_EXTENSIONS.some((extension) => fileName.endsWith(extension))
  );
}
