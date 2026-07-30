"use client";

import { cn } from "@/utils/cn";
import { forwardRef, useState, useId } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      hint,
      error,
      success,
      leftIcon,
      rightIcon,
      isLoading,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const hasError = !!error;
    const hasSuccess = !!success && !hasError;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {/* Left icon */}
          {leftIcon && (
            <span
              className="absolute left-3.5 text-text-muted pointer-events-none"
              aria-hidden
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled || isLoading}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              // Base
              "w-full h-12 rounded-xl bg-surface border text-text-primary",
              "text-[15px] font-normal placeholder:text-text-placeholder",
              "transition-all duration-150 outline-none",
              // Padding
              leftIcon ? "pl-10" : "pl-4",
              (rightIcon || isPassword || hasError || hasSuccess) ? "pr-10" : "pr-4",
              // States
              !hasError && !hasSuccess && [
                "border-border",
                "hover:border-steel/50",
                "focus:border-steel focus:ring-2 focus:ring-steel/20",
              ],
              hasError && "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20",
              hasSuccess && "border-success focus:border-success focus:ring-2 focus:ring-success/20",
              disabled && "opacity-50 cursor-not-allowed bg-surface-muted",
              className
            )}
            {...props}
          />

          {/* Right icon / password toggle / status icon */}
          <span className="absolute right-3.5 flex items-center gap-1 text-text-muted">
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-0.5 hover:text-text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            {hasError && !isPassword && (
              <AlertCircle className="h-4 w-4 text-danger" aria-hidden />
            )}
            {hasSuccess && !isPassword && (
              <CheckCircle2 className="h-4 w-4 text-success" aria-hidden />
            )}
            {!isPassword && !hasError && !hasSuccess && rightIcon && (
              <span aria-hidden>{rightIcon}</span>
            )}
          </span>
        </div>

        {/* Hint / Error / Success */}
        {hint && !hasError && !hasSuccess && (
          <p id={`${inputId}-hint`} className="text-xs text-text-muted">
            {hint}
          </p>
        )}
        {hasError && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-danger flex items-center gap-1">
            <AlertCircle className="h-3 w-3 shrink-0" aria-hidden />
            {error}
          </p>
        )}
        {hasSuccess && (
          <p className="text-xs text-success flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden />
            {success}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

// ── Textarea ──────────────────────────────────────────────────────────────────

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-text-primary select-none">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          className={cn(
            "w-full min-h-[120px] px-4 py-3 rounded-xl bg-surface border text-text-primary",
            "text-[15px] placeholder:text-text-placeholder resize-y",
            "transition-all duration-150 outline-none",
            error
              ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
              : "border-border hover:border-steel/50 focus:border-steel focus:ring-2 focus:ring-steel/20",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
        {error && (
          <p role="alert" className="text-xs text-danger flex items-center gap-1">
            <AlertCircle className="h-3 w-3" aria-hidden />
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Input, Textarea };
export type { InputProps, TextareaProps };
