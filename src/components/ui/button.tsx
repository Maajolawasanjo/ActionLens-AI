import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { forwardRef } from "react";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  // Base styles
  [
    "inline-flex items-center justify-center gap-2 font-semibold",
    "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
    "whitespace-nowrap shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-navy text-white shadow-sm",
          "hover:bg-navy-hover hover:shadow-md active:scale-[0.98]",
          "focus-visible:ring-steel",
        ],
        secondary: [
          "border border-border/50 bg-surface text-text-primary shadow-[0_1px_2px_rgba(0,0,0,0.02)]",
          "hover:bg-surface-hover hover:border-border active:scale-[0.98]",
          "focus-visible:ring-steel",
        ],
        ghost: [
          "text-text-secondary bg-transparent",
          "hover:bg-surface-hover hover:text-text-primary",
          "focus-visible:ring-steel",
        ],
        danger: [
          "bg-danger text-white shadow-sm",
          "hover:bg-red-700 active:scale-[0.98]",
          "focus-visible:ring-danger",
        ],
        outline: [
          "border border-navy text-navy bg-transparent",
          "hover:bg-navy hover:text-white active:scale-[0.98]",
          "focus-visible:ring-navy",
        ],
        steel: [
          "bg-steel text-white shadow-sm",
          "hover:bg-navy active:scale-[0.98]",
          "focus-visible:ring-steel",
        ],
        success: [
          "bg-success text-white shadow-sm",
          "hover:bg-success-dark active:scale-[0.98]",
          "focus-visible:ring-success",
        ],
        warning: [
          "bg-warning text-navy shadow-sm",
          "hover:bg-yellow-500 active:scale-[0.98]",
          "focus-visible:ring-warning",
        ],
      },
      size: {
        sm: "h-8 px-3 text-[13px] rounded-full",
        md: "h-10 px-4 text-[14px] rounded-full",
        lg: "h-12 px-6 text-[15px] rounded-full",
        xl: "h-14 px-8 text-base rounded-full",
        icon: "h-10 w-10 rounded-full text-sm",
        "icon-sm": "h-8 w-8 rounded-full text-xs",
        "icon-lg": "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          leftIcon && <span aria-hidden>{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span aria-hidden>{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
