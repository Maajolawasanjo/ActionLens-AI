import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-medium rounded-full whitespace-nowrap shrink-0",
  {
    variants: {
      variant: {
        default:  "bg-surface-muted text-text-secondary border border-border",
        success:  "bg-success-light text-success-dark",
        warning:  "bg-warning-light text-yellow-800",
        danger:   "bg-danger-light text-danger",
        info:     "bg-info-light text-steel",
        navy:     "bg-steel-light text-steel",
        outline:  "border border-border text-text-secondary bg-transparent",
        critical: "bg-danger text-white",
        high:     "bg-orange-100 text-orange-800",
        moderate: "bg-warning-light text-yellow-800",
        low:      "bg-success-light text-success-dark",
        safe:     "bg-emerald-50 text-emerald-700",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-xs",
        lg: "px-3.5 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  dotColor?: string;
  icon?: React.ReactNode;
}

function Badge({
  className,
  variant,
  size,
  dot = false,
  dotColor,
  icon,
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {dot && (
        <span
          className={cn(
            "status-dot",
            dotColor ?? getDotColorForVariant(variant ?? "default")
          )}
          aria-hidden
        />
      )}
      {icon && <span className="shrink-0" aria-hidden>{icon}</span>}
      {children}
    </span>
  );
}

function getDotColorForVariant(variant: string): string {
  switch (variant) {
    case "success": case "low": case "safe": return "status-dot-success";
    case "warning": case "moderate":         return "status-dot-warning";
    case "danger": case "critical":          return "status-dot-danger";
    case "info": case "navy":                return "status-dot-info";
    default:                                  return "status-dot-muted";
  }
}

// Risk Level Badge (convenience component)
function RiskBadge({ level }: { level: string }) {
  const variants: Record<string, VariantProps<typeof badgeVariants>["variant"]> = {
    critical: "critical",
    high: "high",
    moderate: "moderate",
    low: "low",
    safe: "safe",
  };
  return (
    <Badge variant={variants[level.toLowerCase()] ?? "default"} dot size="md">
      {level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()}
    </Badge>
  );
}

// Priority Badge
function PriorityBadge({ priority }: { priority: string }) {
  const variants: Record<string, VariantProps<typeof badgeVariants>["variant"]> = {
    critical: "critical",
    high:     "high",
    medium:   "warning",
    low:      "success",
  };
  return (
    <Badge variant={variants[priority.toLowerCase()] ?? "default"} size="md">
      {priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()}
    </Badge>
  );
}

export { Badge, badgeVariants, RiskBadge, PriorityBadge };
export type { BadgeProps };
