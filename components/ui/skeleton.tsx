/**
 * Skeleton Component
 * 
 * Loading skeleton component for better UX during data loading
 * Designed with modern minimalistic style and design tokens
 */

"use client"

import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  lines?: number;
  animate?: boolean;
}

export function Skeleton({ 
  className, 
  variant = "rectangular",
  width,
  height,
  lines = 1,
  animate = true
}: SkeletonProps) {
  const baseStyles = cn(
    "bg-neutral-200 dark:bg-neutral-800",
    animate && "animate-pulse"
  );

  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseStyles,
              variants.text,
              index === lines - 1 && "w-3/4" // Last line is shorter
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={{ width, height }}
    />
  );
}

// Predefined skeleton components for common use cases
export function PostSkeleton() {
  return (
    <div className="card-elevated p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="20%" />
        </div>
      </div>
      
      {/* Content */}
      <Skeleton variant="text" lines={3} />
      
      {/* Image placeholder */}
      <Skeleton variant="rectangular" height={200} />
      
      {/* Actions */}
      <div className="flex items-center space-x-4">
        <Skeleton variant="rectangular" width={60} height={32} />
        <Skeleton variant="rectangular" width={60} height={32} />
        <Skeleton variant="rectangular" width={60} height={32} />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="card-outlined p-6 space-y-6">
      {/* Profile header */}
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width={80} height={80} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
      
      {/* Stats */}
      <div className="flex space-x-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="text-center space-y-1">
            <Skeleton variant="text" width={40} />
            <Skeleton variant="text" width={60} />
          </div>
        ))}
      </div>
      
      {/* Bio */}
      <Skeleton variant="text" lines={2} />
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex space-x-3 p-3">
      <Skeleton variant="circular" width={32} height={32} />
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="text" width="15%" />
        </div>
        <Skeleton variant="text" lines={2} />
      </div>
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </div>
  );
}