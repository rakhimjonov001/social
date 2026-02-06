"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Check } from "lucide-react"
import { useThemeIntegration } from "@/hooks/use-theme-integration"
import GlassSurface from "@/components/GlassSurface"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, mounted } = useThemeIntegration()

  if (!mounted) return <div className="h-10 w-10" />

  const themes = [
    { id: "light", label: "Светлая", icon: Sun, color: "text-orange-400" },
    { id: "dark", label: "Темная", icon: Moon, color: "text-indigo-400" },
    { id: "system", label: "Системная", icon: Monitor, color: "text-emerald-400" },
  ]

  const CurrentIcon = themes.find((t) => t.id === theme)?.icon || Monitor

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("outline-none focus:ring-0 active:scale-90 transition-transform", className)}>
          <GlassSurface
            width={42}
            height={42}
            borderRadius={12}
            blur={10}
            backgroundOpacity={0.2}
            className="border border-white/10 hover:border-primary/40 transition-colors cursor-pointer"
          >
            <div className="w-full h-full flex items-center justify-center">
              <CurrentIcon className="h-5 w-5 transition-all duration-300" />
            </div>
          </GlassSurface>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        sideOffset={8}
        className="p-0 border-none bg-transparent shadow-none z-[60]"
      >
        <GlassSurface
          width={160}
          height="auto"
          borderRadius={16}
          blur={20}
          backgroundOpacity={0.3}
          className="border border-white/10 p-1.5 shadow-2xl"
        >
          <div className="flex flex-col gap-1">
            {themes.map((t) => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all focus:bg-white/10 focus:text-accent-foreground",
                  theme === t.id ? "bg-white/10" : "bg-transparent opacity-80"
                )}
              >
                <div className="flex items-center gap-3">
                  <t.icon className={cn("h-4 w-4", t.color)} />
                  <span className="text-xs font-bold tracking-wide uppercase">{t.label}</span>
                </div>
                {theme === t.id && <Check className="h-3 w-3 text-primary" />}
              </DropdownMenuItem>
            ))}
          </div>
        </GlassSurface>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}