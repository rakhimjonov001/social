"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "dark",
  setTheme: (theme: string) => {},
  mounted: false,
});

export const useThemeIntegration = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      mounted,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};