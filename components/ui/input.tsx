/**
 * Input Component
 * 
 * A styled input component with support for labels, icons, and error messages
 * Redesigned with modern minimalistic style and design tokens
 */

"use client"

import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled" | "underlined";
  animate?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    success,
    hint,
    leftIcon,
    rightIcon,
    variant = "default",
    animate = true,
    id, 
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    
    const inputId = id || props.name;
    const isPassword = type === "password";
    const actualType = isPassword && showPassword ? "text" : type;

    const baseStyles = cn(
      "flex w-full transition-all duration-300 ease-out",
      "text-sm text-foreground placeholder:text-muted",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "focus:outline-none"
    );

    const variants = {
      default: cn(
        "h-10 px-3 py-2 rounded-lg border bg-surface",
        "border-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
        error && "border-error-500 focus:border-error-500 focus:ring-error-500/20",
        success && "border-success-500 focus:border-success-500 focus:ring-success-500/20"
      ),
      filled: cn(
        "h-10 px-3 py-2 rounded-lg border-0 bg-neutral-100 dark:bg-neutral-800",
        "focus:bg-surface focus:ring-2 focus:ring-primary-500/20",
        error && "bg-error-50 dark:bg-error-900/20 focus:ring-error-500/20",
        success && "bg-success-50 dark:bg-success-900/20 focus:ring-success-500/20"
      ),
      underlined: cn(
        "h-10 px-0 py-2 border-0 border-b-2 rounded-none bg-transparent",
        "border-border focus:border-primary-500",
        error && "border-error-500 focus:border-error-500",
        success && "border-success-500 focus:border-success-500"
      ),
    };

    const inputContent = (
      <div className="relative w-full">
        {label && (
          <motion.label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium mb-2 transition-colors duration-200",
              "text-foreground",
              error && "text-error-600",
              success && "text-success-600"
            )}
            initial={animate ? { opacity: 0, y: -10 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {leftIcon}
            </div>
          )}
          
          <input
            type={actualType}
            id={inputId}
            className={cn(
              baseStyles,
              variants[variant],
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {success && !error && (
              <Check className="h-4 w-4 text-success-500" />
            )}
            {error && (
              <AlertCircle className="h-4 w-4 text-error-500" />
            )}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
            {rightIcon && !isPassword && !error && !success && (
              <div className="text-muted">{rightIcon}</div>
            )}
          </div>
        </div>

        {/* Messages */}
        {(error || success || hint) && (
          <motion.div
            initial={animate ? { opacity: 0, y: -5 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.2 }}
            className="mt-1.5"
          >
            {error && (
              <p className="text-sm text-error-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            {success && !error && (
              <p className="text-sm text-success-600 flex items-center gap-1">
                <Check className="h-3 w-3" />
                {success}
              </p>
            )}
            {hint && !error && !success && (
              <p className="text-sm text-muted">{hint}</p>
            )}
          </motion.div>
        )}
      </div>
    );

    if (animate) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          {inputContent}
        </motion.div>
      );
    }

    return <div className="w-full">{inputContent}</div>;
  }
);

Input.displayName = "Input";

export { Input };
