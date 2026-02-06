/**
 * Textarea Component
 * 
 * A styled textarea component with support for labels, character count, and error messages
 * Redesigned with modern minimalistic style and design tokens
 */

"use client"

import { forwardRef, type TextareaHTMLAttributes, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
  variant?: "default" | "filled" | "underlined";
  resize?: "none" | "vertical" | "horizontal" | "both";
  animate?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    label, 
    error, 
    success,
    hint,
    maxLength,
    showCount = false,
    variant = "default",
    resize = "vertical",
    animate = true,
    id, 
    value,
    onChange,
    ...props 
  }, ref) => {
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    
    const textareaId = id || props.name;

    useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const baseStyles = cn(
      "flex w-full min-h-[100px] transition-all duration-300 ease-out",
      "text-sm text-foreground placeholder:text-muted",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "focus:outline-none",
      resize === "none" && "resize-none",
      resize === "vertical" && "resize-y",
      resize === "horizontal" && "resize-x",
      resize === "both" && "resize"
    );

    const variants = {
      default: cn(
        "px-3 py-2 rounded-lg border bg-surface",
        "border-border focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20",
        error && "border-error-500 focus:border-error-500 focus:ring-error-500/20",
        success && "border-success-500 focus:border-success-500 focus:ring-success-500/20"
      ),
      filled: cn(
        "px-3 py-2 rounded-lg border-0 bg-neutral-100 dark:bg-neutral-800",
        "focus:bg-surface focus:ring-2 focus:ring-primary-500/20",
        error && "bg-error-50 dark:bg-error-900/20 focus:ring-error-500/20",
        success && "bg-success-50 dark:bg-success-900/20 focus:ring-success-500/20"
      ),
      underlined: cn(
        "px-0 py-2 border-0 border-b-2 rounded-none bg-transparent",
        "border-border focus:border-primary-500",
        error && "border-error-500 focus:border-error-500",
        success && "border-success-500 focus:border-success-500"
      ),
    };

    const textareaContent = (
      <div className="relative w-full">
        {label && (
          <motion.label
            htmlFor={textareaId}
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
          <textarea
            id={textareaId}
            className={cn(
              baseStyles,
              variants[variant],
              className
            )}
            ref={ref}
            value={value}
            maxLength={maxLength}
            onChange={handleChange}
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
          
          {/* Status icon */}
          {(error || success) && (
            <div className="absolute top-3 right-3">
              {error && <AlertCircle className="h-4 w-4 text-error-500" />}
              {success && !error && <Check className="h-4 w-4 text-success-500" />}
            </div>
          )}
        </div>

        {/* Character count and messages */}
        {(showCount || error || success || hint) && (
          <motion.div
            initial={animate ? { opacity: 0, y: -5 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.2 }}
            className="mt-1.5 flex items-center justify-between"
          >
            <div className="flex-1">
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
            </div>
            
            {showCount && (
              <div className={cn(
                "text-xs text-muted ml-2",
                maxLength && charCount > maxLength * 0.9 && "text-warning-600",
                maxLength && charCount >= maxLength && "text-error-600"
              )}>
                {charCount}{maxLength && `/${maxLength}`}
              </div>
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
          {textareaContent}
        </motion.div>
      );
    }

    return <div className="w-full">{textareaContent}</div>;
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
