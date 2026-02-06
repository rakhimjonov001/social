/**
 * Badge Component
 * * Small status and label component for displaying metadata
 * Designed with modern minimalistic style and design tokens
 */

"use client"

import { forwardRef, type HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Добавили "destructive" в список допустимых вариантов
export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "outline" | "destructive";
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  dot?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "md", animate = true, dot = false, children, ...props }, ref) => {
    const baseStyles = cn(
      "inline-flex items-center gap-1 font-medium transition-all duration-200",
      "rounded-full border"
    );

    const variants = {
      default: "bg-primary-500 text-white border-primary-500",
      secondary: "bg-surface text-foreground border-border",
      success: "bg-success-500 text-white border-success-500",
      warning: "bg-warning-500 text-white border-warning-500",
      error: "bg-error-500 text-white border-error-500",
      outline: "bg-transparent text-foreground border-border",
      // Добавили реализацию стиля для destructive
      destructive: "bg-destructive text-destructive-foreground border-destructive/20 hover:bg-destructive/90",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[10px]",
      md: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm",
    };

    const dotSizes = {
      sm: "h-1 w-1",
      md: "h-1.5 w-1.5",
      lg: "h-2 w-2",
    };

    const badgeContent = (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {dot && (
          <div
            className={cn(
              "rounded-full bg-current opacity-75",
              dotSizes[size]
            )}
          />
        )}
        {children}
      </div>
    );

    if (animate) {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="inline-block" // Чтобы motion не ломал строчный поток
        >
          {badgeContent}
        </motion.div>
      );
    }

    return badgeContent;
  }
);

Badge.displayName = "Badge";

// --- Вспомогательные компоненты ---

export interface NotificationBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function NotificationBadge({ 
  count, 
  max = 99, 
  showZero = false, 
  className,
  size = "sm"
}: NotificationBadgeProps) {
  if (count === 0 && !showZero) return null;
  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant="error"
      size={size}
      className={cn(
        "absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center p-0 text-[10px]",
        size === "sm" && "min-w-[1rem] h-4 text-[9px]",
        className
      )}
    >
      {displayCount}
    </Badge>
  );
}

export interface StatusBadgeProps {
  status: "online" | "offline" | "away" | "busy";
  showText?: boolean;
  className?: string;
}

export function StatusBadge({ status, showText = false, className }: StatusBadgeProps) {
  const statusConfig = {
    online: { color: "success", text: "Online", dot: true },
    offline: { color: "secondary", text: "Offline", dot: true },
    away: { color: "warning", text: "Away", dot: true },
    busy: { color: "error", text: "Busy", dot: true },
  } as const;

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.color}
      size="sm"
      dot={config.dot}
      className={className}
    >
      {showText && config.text}
    </Badge>
  );
}

export { Badge };