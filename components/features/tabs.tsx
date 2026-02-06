/**
 * Tabs Component
 * 
 * A simple tabs component for switching between content
 */

"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Context for tabs state
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

// Tabs Root
interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tabs List
interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        "mb-4 flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
}

// Tab Trigger
interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white"
          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white",
        className
      )}
    >
      {children}
    </button>
  );
}

// Tab Content
interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) {
    return null;
  }

  return <div className={className}>{children}</div>;
}
