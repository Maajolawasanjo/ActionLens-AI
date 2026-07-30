import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format currency */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format large numbers compactly */
export function formatCompact(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

/** Get user initials from name */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Truncate text */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

/** Format date */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/** Format date and time */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/** Time ago */
export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/** Get risk level color class */
export function getRiskColor(level: string): string {
  switch (level.toLowerCase()) {
    case "critical": return "text-danger bg-danger-light";
    case "high":     return "text-orange-700 bg-orange-50";
    case "moderate": return "text-warning-dark bg-warning-light";
    case "low":      return "text-success-dark bg-success-light";
    case "safe":     return "text-emerald-700 bg-emerald-50";
    default:         return "text-text-muted bg-surface-muted";
  }
}

/** Get risk dot color */
export function getRiskDotColor(level: string): string {
  switch (level.toLowerCase()) {
    case "critical": return "bg-danger";
    case "high":     return "bg-orange-500";
    case "moderate": return "bg-warning";
    case "low":      return "bg-success";
    case "safe":     return "bg-emerald-500";
    default:         return "bg-text-placeholder";
  }
}

/** Get priority color */
export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "critical": return "bg-danger text-white";
    case "high":     return "bg-orange-500 text-white";
    case "medium":   return "bg-warning text-navy";
    case "low":      return "bg-success-light text-success-dark";
    default:         return "bg-surface-muted text-text-muted";
  }
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Sleep utility */
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Check if string is valid URL */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
