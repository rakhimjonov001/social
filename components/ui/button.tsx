/**
 * Button Component
 * 
 * A versatile button component with multiple variants and sizes
 * Redesigned with modern minimalistic style and design tokens
 */

"use client"

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  icon?: React.ReactNode;
  animate?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = "primary",
    size = "md",
    isLoading,
    children,
    disabled,
    icon,
    animate = true,
    ...props
  }, ref) => {

    const baseStyles = cn(
      // Base styles
      "inline-flex items-center justify-center gap-2",
      "font-medium transition-all duration-300 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "relative overflow-hidden"
    );

    const variants = {
      primary: cn(
        "bg-primary-500 text-white shadow-sm",
        "hover:bg-primary-600 hover:shadow-md",
        "active:bg-primary-700 active:scale-95",
        "focus-visible:ring-primary-500"
      ),
      secondary: cn(
        "bg-surface text-foreground border border-border shadow-sm",
        "hover:bg-neutral-100 hover:shadow-md dark:hover:bg-neutral-800",
        "active:scale-95",
        "focus-visible:ring-primary-500"
      ),
      outline: cn(
        "border border-border bg-transparent text-foreground",
        "hover:bg-surface hover:shadow-sm",
        "active:scale-95",
        "focus-visible:ring-primary-500"
      ),
      ghost: cn(
        "text-foreground bg-transparent",
        "hover:bg-surface hover:shadow-sm",
        "active:scale-95",
        "focus-visible:ring-primary-500"
      ),
      destructive: cn(
        "bg-error-500 text-white shadow-sm",
        "hover:bg-error-600 hover:shadow-md",
        "active:bg-error-700 active:scale-95",
        "focus-visible:ring-error-500"
      ),
      link: cn(
        "text-primary-500 underline-offset-4",
        "hover:underline hover:text-primary-600",
        "active:text-primary-700",
        "focus-visible:ring-primary-500"
      ),
    };

    const sizes = {
      sm: "h-8 px-3 text-sm rounded-lg",
      md: "h-10 px-4 py-2 rounded-lg",
      lg: "h-12 px-6 text-lg rounded-xl",
      icon: "h-10 w-10 rounded-lg",
    };

    const buttonContent = (
      <>
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {!isLoading && icon && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children && (
          <span className={cn(
            "flex-1",
            size === "icon" && "sr-only"
          )}>
            {children}
          </span>
        )}
      </>
    );

    const buttonClasses = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    if (animate) {
      return (
        <motion.button
          ref={ref}
          className={buttonClasses}
          disabled={disabled || isLoading}
          whileHover={{ scale: variant !== "link" ? 1.02 : 1 }}
          whileTap={{ scale: variant !== "link" ? 0.98 : 1 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          {...props}
        >
          {buttonContent}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
