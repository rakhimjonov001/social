"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, Bell, User, PlusSquare } from "lucide-react";
import { Avatar, NotificationBadge } from "@/components/ui";
import { useBreakpoint } from "@/hooks/use-theme-integration";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  user: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  } | null;
  notificationCount?: number;
}

export function MobileNav({ user, notificationCount = 0 }: MobileNavProps) {
  const pathname = usePathname();
  const { isMobile } = useBreakpoint();

  if (!user || !isMobile) return null;

  const navItems = [
    { href: "/feed", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/create", icon: PlusSquare, label: "Create", isSpecial: true },
    { 
      href: "/notifications", 
      icon: Bell, 
      label: "Activity", 
      badge: notificationCount 
    },
    { 
      href: `/profile/${user.username}`, 
      icon: User, 
      label: "Profile",
      avatar: true
    },
  ];

  return (
    <motion.nav 
      // Исправлено: Адаптивный фон и граница
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg pb-safe"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          return (
            <motion.div
              key={item.href}
              className="relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-all duration-200",
                  // Кнопка "Create" всегда яркая
                  item.isSpecial
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  {item.avatar ? (
                    <div className={cn(
                      "rounded-full p-0.5 transition-all",
                      isActive ? "ring-2 ring-primary" : "ring-0"
                    )}>
                      <Avatar
                        src={user.image}
                        name={user.name || user.username}
                        size="xs"
                      />
                    </div>
                  ) : (
                    <item.icon 
                      className={cn(
                        "h-6 w-6",
                        item.isSpecial && "h-7 w-7"
                      )} 
                      // Заливка иконки при активности (для Lucide)
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  )}
                  
                  {item.badge && item.badge > 0 && (
                    <NotificationBadge 
                      count={item.badge} 
                      className="absolute -right-2 -top-1 ring-2 ring-background"
                      size="sm"
                    />
                  )}
                </div>

                <span 
                  className={cn(
                    "text-[10px] font-medium leading-none",
                    item.isSpecial ? "text-primary-foreground" : isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>

                {/* Индикатор активной вкладки (точка или линия) */}
                {isActive && !item.isSpecial && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary"
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
}