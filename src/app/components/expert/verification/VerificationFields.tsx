import type { ChangeEvent, HTMLInputTypeAttribute, ReactNode } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

const labelClassName =
  "flex items-center gap-1 text-[13px] font-medium text-foreground";
const inputClassName =
  "w-full rounded-md bg-input-background px-3 py-2 text-[14px] text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60";
const textareaClassName = `${inputClassName} resize-none`;

interface BaseVerificationFieldProps {
  disabled?: boolean;
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value: string;
}

interface VerificationTextFieldProps extends BaseVerificationFieldProps {
  type?: HTMLInputTypeAttribute;
  onChange: (value: string) => void;
}

interface VerificationTextareaFieldProps extends BaseVerificationFieldProps {
  rows?: number;
  onChange: (value: string) => void;
}

interface VerificationSelectFieldProps extends BaseVerificationFieldProps {
  options: string[];
  onChange: (value: string) => void;
}

export function VerificationTextField({
  disabled = false,
  id,
  label,
  onChange,
  placeholder,
  required = false,
  type = "text",
  value,
}: VerificationTextFieldProps) {
  return (
    <VerificationFieldShell id={id} label={label} required={required}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        disabled={disabled}
        className={inputClassName}
      />
    </VerificationFieldShell>
  );
}

export function VerificationSelectField({
  disabled = false,
  id,
  label,
  onChange,
  options,
  placeholder,
  required = false,
  value,
}: VerificationSelectFieldProps) {
  return (
    <VerificationFieldShell id={id} label={label} required={required}>
      <Select
        disabled={disabled}
        value={value || undefined}
        onValueChange={onChange}
      >
        <SelectTrigger id={id} className="bg-input-background">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </VerificationFieldShell>
  );
}

export function VerificationTextareaField({
  disabled = false,
  id,
  label,
  onChange,
  placeholder,
  required = false,
  rows = 4,
  value,
}: VerificationTextareaFieldProps) {
  return (
    <VerificationFieldShell id={id} label={label} required={required}>
      <textarea
        id={id}
        value={value}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={textareaClassName}
      />
    </VerificationFieldShell>
  );
}

interface VerificationFieldShellProps {
  children: ReactNode;
  id: string;
  label: string;
  required: boolean;
}

function VerificationFieldShell({
  children,
  id,
  label,
  required,
}: VerificationFieldShellProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClassName}>
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
    </div>
  );
}
