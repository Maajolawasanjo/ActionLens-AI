import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/cn";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  role?: string;
}

const sizeMap = {
  xs: { container: "h-6 w-6",  text: "text-[10px]" },
  sm: { container: "h-8 w-8",  text: "text-xs" },
  md: { container: "h-10 w-10", text: "text-sm" },
  lg: { container: "h-12 w-12", text: "text-base" },
  xl: { container: "h-16 w-16", text: "text-xl" },
};

const roleBgMap: Record<string, string> = {
  government:   "bg-navy text-white",
  ngo:          "bg-steel text-white",
  responder:    "bg-danger text-white",
  farmer:       "bg-success text-white",
  health_worker: "bg-info text-white",
  citizen:      "bg-surface-alt text-navy",
};

function Avatar({ src, name, size = "md", className, role }: AvatarProps) {
  const { container, text } = sizeMap[size];
  const bgColor = role ? (roleBgMap[role] ?? "bg-navy text-white") : "bg-navy text-white";

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center overflow-hidden shrink-0 font-semibold",
        container,
        !src && bgColor,
        className
      )}
      aria-label={name}
    >
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" sizes="64px" />
      ) : (
        <span className={cn(text, "select-none")} aria-hidden>
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}

// ── AvatarGroup ───────────────────────────────────────────────────────────────

interface AvatarGroupProps {
  users: Array<{ name: string; src?: string; role?: string }>;
  max?: number;
  size?: AvatarProps["size"];
}

function AvatarGroup({ users, max = 4, size = "sm" }: AvatarGroupProps) {
  const shown = users.slice(0, max);
  const remaining = users.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {shown.map((user, i) => (
        <div key={i} className="ring-2 ring-surface rounded-full">
          <Avatar {...user} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "ring-2 ring-surface rounded-full flex items-center justify-center",
            "bg-surface-hover text-text-muted text-xs font-semibold",
            sizeMap[size].container
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup };
export type { AvatarProps };
