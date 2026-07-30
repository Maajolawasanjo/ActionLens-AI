import { cn } from "@/utils/cn";
import { forwardRef } from "react";

// ── Card ──────────────────────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  bordered?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, bordered = true, padding = "lg", children, ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "p-4 sm:p-6",
      md: "p-6 sm:p-8",
      lg: "p-8 sm:p-10",
      xl: "p-10 sm:p-12",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface rounded-2xl sm:rounded-3xl",
          "shadow-[0_4px_24px_rgba(0,0,0,0.03),0_1px_2px_rgba(0,0,0,0.02)]",
          bordered && "border border-border/60",
          paddingClasses[padding],
          hover && "hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(0,0,0,0.06),0_4px_8px_rgba(0,0,0,0.03)] transition-all duration-300 ease-out cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

// ── CardHeader ────────────────────────────────────────────────────────────────

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2 mb-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// ── CardTitle ─────────────────────────────────────────────────────────────────

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold text-text-primary leading-tight tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

// ── CardDescription ───────────────────────────────────────────────────────────

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-[15px] text-text-muted leading-relaxed", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

// ── CardContent ───────────────────────────────────────────────────────────────

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

// ── CardFooter ────────────────────────────────────────────────────────────────

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 mt-6 pt-6 border-t border-border/50", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// ── CardSection ───────────────────────────────────────────────────────────────

const CardSection = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("-mx-8 sm:-mx-10 px-8 sm:px-10 py-6 border-t border-border/50 first:-mt-0 last:mb-0", className)}
      {...props}
    />
  )
);
CardSection.displayName = "CardSection";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardSection };
