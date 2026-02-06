/**
 * Card Component System
 * 
 * A flexible container component system for grouping related content
 * Redesigned with modern minimalistic style and design tokens
 */

"use client"

import { type HTMLAttributes, forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
  variant?: "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  animate?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "elevated", padding = "md", hover = false, animate = true, children, ...props }, ref) => {
    const baseStyles = cn(
      "rounded-xl overflow-hidden transition-all duration-300 ease-out",
      "bg-surface"
    );

    const variants = {
      elevated: "shadow-md hover:shadow-lg",
      outlined: "border border-border shadow-sm",
      filled: "bg-neutral-100 dark:bg-neutral-800",
    };

    const paddings = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    };

    const hoverStyles = hover ? "hover:scale-[1.02] hover:shadow-lg cursor-pointer" : "";

    const cardClasses = cn(
      baseStyles,
      variants[variant],
      paddings[padding],
      hoverStyles,
      className
    );

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={cardClasses}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          whileHover={hover ? { scale: 1.02 } : undefined}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...(props as any)}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 p-0 pb-4", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-tight tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted leading-relaxed", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-0", className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-0 pt-4", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Specialized card variants for common use cases
const PostCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="elevated"
      padding="lg"
      hover={true}
      className={cn("max-w-2xl", className)}
      {...props}
    />
  )
);
PostCard.displayName = "PostCard";

const ProfileCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="outlined"
      padding="lg"
      className={cn("w-full", className)}
      {...props}
    />
  )
);
ProfileCard.displayName = "ProfileCard";

const StatsCard = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="filled"
      padding="md"
      hover={true}
      className={cn("text-center", className)}
      {...props}
    />
  )
);
StatsCard.displayName = "StatsCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  PostCard,
  ProfileCard,
  StatsCard
};
