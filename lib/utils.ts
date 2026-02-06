import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get initials from a name
 * @param name - Full name string
 * @returns Initials (first letters of first and last name)
 */
export function getInitials(name?: string | null): string {
  if (!name) return "";
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  // Get first letter of first name and first letter of last name
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Format a date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === "string" ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

/**
 * Format a number with K, M, B suffixes (compact format)
 * Examples: 999 → "999", 1000 → "1K", 1500 → "1.5K", 1000000 → "1M"
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) {
    const formatted = (num / 1000).toFixed(1);
    return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'K' : formatted + 'K';
  }
  if (num < 1000000000) {
    const formatted = (num / 1000000).toFixed(1);
    return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'M' : formatted + 'M';
  }
  const formatted = (num / 1000000000).toFixed(1);
  return formatted.endsWith('.0') ? formatted.slice(0, -2) + 'B' : formatted + 'B';
}

/**
 * Format a number with K, M, B suffixes (always shows decimal)
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
  return `${(num / 1000000000).toFixed(1)}B`;
}

/**
 * Truncate text to a specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: any): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}