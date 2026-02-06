"use client";

/**
 * Theme Integration Hook
 *
 * Custom hook for managing theme state and design token integration
 */

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";
import { designTokens } from "@/lib/design-tokens";

export interface ThemeIntegration {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  systemTheme: string | undefined;
  tokens: typeof designTokens;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  mounted: boolean;
}

export function useThemeIntegration(): ThemeIntegration {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const isLight = resolvedTheme === "light";
  const isSystem = theme === "system";

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    tokens: designTokens,
    isDark,
    isLight,
    isSystem,
    mounted,
  };
}

/**
 * Hook to get current theme colors
 */
export function useThemeColors() {
  const { isDark, mounted } = useThemeIntegration();

  // ✅ Light theme defaults while not mounted (server + first client render).
  // Prevents mismatch between server HTML and client hydration.
  if (!mounted) {
    return {
      background: "#ffffff",
      foreground: "#171717",
      surface: "#f5f5f5",
      border: "#e5e5e5",
      muted: "#a3a3a3",
      accent: "#3b82f6",
    };
  }

  return {
    background: isDark
      ? designTokens.colors.neutral[950]
      : designTokens.colors.neutral[50],
    foreground: isDark
      ? designTokens.colors.neutral[50]
      : designTokens.colors.neutral[900],
    surface: isDark
      ? designTokens.colors.neutral[900]
      : designTokens.colors.neutral[100],
    border: isDark
      ? designTokens.colors.neutral[800]
      : designTokens.colors.neutral[200],
    muted: isDark
      ? designTokens.colors.neutral[500]
      : designTokens.colors.neutral[400],
    accent: isDark
      ? designTokens.colors.primary[400]
      : designTokens.colors.primary[500],
  };
}

/**
 * Hook to check if animations should be reduced
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for responsive breakpoints
 *
 * ✅ FIX: defaults to `null` on the server so that the first client render
 * matches the server HTML exactly. The real breakpoint is set only inside
 * useEffect (after hydration), which prevents the mismatch that was causing
 * Next.js to fall back to server-side serialisation and trigger the
 * "Event handlers cannot be passed" error.
 */
export function useBreakpoint() {
  // null = "not yet measured" (server + first client paint)
  const [breakpoint, setBreakpoint] = useState<
    keyof typeof designTokens.breakpoints | "xs" | null
  >(null);

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;

      if (width >= parseInt(designTokens.breakpoints["2xl"])) {
        setBreakpoint("2xl");
      } else if (width >= parseInt(designTokens.breakpoints.xl)) {
        setBreakpoint("xl");
      } else if (width >= parseInt(designTokens.breakpoints.lg)) {
        setBreakpoint("lg");
      } else if (width >= parseInt(designTokens.breakpoints.md)) {
        setBreakpoint("md");
      } else if (width >= parseInt(designTokens.breakpoints.sm)) {
        setBreakpoint("sm");
      } else {
        setBreakpoint("xs");
      }
    };

    // Run immediately on mount so the first useEffect tick sets the value
    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return {
    breakpoint,
    // While breakpoint is null (server / first paint), treat as desktop.
    // This matches Next.js SSR output so hydration stays consistent.
    isMobile: breakpoint === "xs" || breakpoint === "sm",
    isTablet: breakpoint === "md",
    isDesktop:
      breakpoint === null ||
      breakpoint === "lg" ||
      breakpoint === "xl" ||
      breakpoint === "2xl",
    isLarge: breakpoint === "xl" || breakpoint === "2xl",
  };
}