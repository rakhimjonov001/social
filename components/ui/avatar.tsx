/**
 * Avatar Component
 * 
 * A user avatar component with fallback to initials and status indicators
 * Redesigned with modern minimalistic style and design tokens
 */

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn, getInitials } from "@/lib/utils";
import { User } from "lucide-react";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "away" | "busy";
  showStatus?: boolean;
  className?: string;
  animate?: boolean;
  fallback?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-xl",
};

const imageSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

const statusSizes = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-4 w-4",
};

const statusColors = {
  online: "bg-success-500",
  offline: "bg-neutral-400",
  away: "bg-warning-500",
  busy: "bg-error-500",
};

const statusPositions = {
  xs: "bottom-0 right-0",
  sm: "bottom-0 right-0",
  md: "bottom-0 right-0",
  lg: "bottom-0.5 right-0.5",
  xl: "bottom-1 right-1",
};

export function Avatar({ 
  src, 
  alt, 
  name, 
  size = "md", 
  status,
  showStatus = false,
  className,
  animate = true,
  fallback
}: AvatarProps) {
  const initials = getInitials(name) || fallback || "?";

  const avatarContent = (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-gradient-to-br from-primary-500 to-primary-600",
        "font-medium text-white shadow-sm",
        "transition-all duration-300 ease-out",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Hide image on error to show fallback
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          {initials !== "?" ? (
            <span className="select-none">{initials}</span>
          ) : (
            <User className={cn(
              "text-white/80",
              size === "xs" && "h-3 w-3",
              size === "sm" && "h-4 w-4",
              size === "md" && "h-5 w-5",
              size === "lg" && "h-7 w-7",
              size === "xl" && "h-10 w-10"
            )} />
          )}
        </div>
      )}

      {/* Status Indicator */}
      {showStatus && status && (
        <div
          className={cn(
            "absolute rounded-full border-2 border-surface",
            statusSizes[size],
            statusColors[status],
            statusPositions[size]
          )}
        >
          {status === "busy" && (
            <div className="absolute inset-0.5 rounded-full bg-white" />
          )}
        </div>
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {avatarContent}
      </motion.div>
    );
  }

  return avatarContent;
}

// Avatar Group Component for displaying multiple avatars
export interface AvatarGroupProps {
  avatars: Array<{
    src?: string | null;
    name?: string | null;
    alt?: string;
  }>;
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
}

export function AvatarGroup({ 
  avatars, 
  max = 3, 
  size = "md", 
  className 
}: AvatarGroupProps) {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
          className="ring-2 ring-surface"
          animate={false}
        />
      ))}
      
      {remainingCount > 0 && (
        <div
          className={cn(
            "flex items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700",
            "ring-2 ring-surface text-xs font-medium text-neutral-600 dark:text-neutral-300",
            sizeClasses[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
