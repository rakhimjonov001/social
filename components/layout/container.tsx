/**
 * Container Components
 * * Responsive layout containers for different content types
 * Designed with modern minimalistic style and design tokens
 */

"use client"

import { forwardRef, type HTMLAttributes } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

// ИСПРАВЛЕНИЕ: Теперь мы явно расширяем HTMLAttributes, чтобы className и children были доступны.
// Omit здесь нужен только для того, чтобы типы motion не конфликтовали с обычным div.
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
  center?: boolean;
  animate?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    className, 
    maxWidth = "lg", 
    padding = true, 
    center = true, 
    animate = true,
    children, 
    ...props 
  }, ref) => {
    const maxWidths = {
      sm: "max-w-2xl",      // 672px
      md: "max-w-4xl",      // 896px  
      lg: "max-w-6xl",      // 1152px
      xl: "max-w-7xl",      // 1280px
      "2xl": "max-w-screen-2xl", // 1536px
      full: "max-w-full",
    };

    const containerClasses = cn(
      maxWidths[maxWidth],
      center && "mx-auto",
      padding && "px-4 sm:px-6 lg:px-8",
      className
    );

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={containerClasses}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          // Приводим пропсы к типу motion, чтобы избежать конфликтов TS
          {...(props as HTMLMotionProps<"div">)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

// Main Content Container - for primary content areas
export interface MainContainerProps extends ContainerProps {
  sidebar?: boolean;
}

export const MainContainer = forwardRef<HTMLDivElement, MainContainerProps>(
  ({ sidebar = false, className, ...props }, ref) => (
    <Container
      ref={ref}
      maxWidth="xl"
      className={cn(
        "min-h-screen py-6",
        sidebar ? "lg:pr-80" : "",
        className
      )}
      {...props}
    />
  )
);

MainContainer.displayName = "MainContainer";

// Feed Container - optimized for social media feeds
export const FeedContainer = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, ...props }, ref) => (
    <Container
      ref={ref}
      maxWidth="md"
      className={cn("space-y-6", className)}
      {...props}
    />
  )
);

FeedContainer.displayName = "FeedContainer";

// Grid Container - for responsive grid layouts
export interface GridContainerProps extends ContainerProps {
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export const GridContainer = forwardRef<HTMLDivElement, GridContainerProps>(
  ({ cols = 3, gap = "md", className, children, ...props }, ref) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    };

    const gaps = {
      sm: "gap-4",
      md: "gap-6",
      lg: "gap-8",
    };

    return (
      <Container
        ref={ref}
        className={cn(
          "grid",
          gridCols[cols as keyof typeof gridCols],
          gaps[gap as keyof typeof gaps],
          className
        )}
        {...props}
      >
        {children}
      </Container>
    );
  }
);

GridContainer.displayName = "GridContainer";

// Section Container - for page sections
export interface SectionProps extends ContainerProps {
  spacing?: "sm" | "md" | "lg" | "xl";
}

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ spacing = "lg", className, ...props }, ref) => {
    const spacings = {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
      xl: "py-24",
    };

    return (
      <Container
        ref={ref}
        className={cn(spacings[spacing as keyof typeof spacings], className)}
        {...props}
      />
    );
  }
);

Section.displayName = "Section";

// Flex Container - for flexible layouts
export interface FlexContainerProps extends ContainerProps {
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  gap?: "sm" | "md" | "lg";
}

export const FlexContainer = forwardRef<HTMLDivElement, FlexContainerProps>(
  ({ 
    direction = "row", 
    align = "start", 
    justify = "start", 
    wrap = false,
    gap = "md",
    className, 
    ...props 
  }, ref) => {
    const directions = {
      row: "flex-row",
      col: "flex-col",
    };

    const alignments = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };

    const justifications = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const gaps = {
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
    };

    return (
      <Container
        ref={ref}
        className={cn(
          "flex",
          directions[direction as keyof typeof directions],
          alignments[align as keyof typeof alignments],
          justifications[justify as keyof typeof justifications],
          wrap && "flex-wrap",
          gaps[gap as keyof typeof gaps],
          className
        )}
        {...props}
      />
    );
  }
);

FlexContainer.displayName = "FlexContainer";

export { Container };