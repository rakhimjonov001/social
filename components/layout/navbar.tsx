"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Bell,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  PlusSquare,
  Compass,
  Shield,
  Plus,
} from "lucide-react";
import { Avatar, Button, ThemeToggle, NotificationBadge } from "@/components/ui";
import { useBreakpoint } from "@/hooks/use-theme-integration";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth";

interface NavbarProps {
  user: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    role?: string;
  } | null;
  notificationCount?: number;
}

export function Navbar({ user, notificationCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const { isMobile } = useBreakpoint();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Убрали Create отсюда, чтобы оставить только одну кнопку справа
  const navItems = [
    { href: "/feed", icon: Home, label: "Home" },
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/create", icon: PlusSquare, label: "Create Post" },
    { href: "/notifications", icon: Bell, label: "Notifications", badge: notificationCount },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href={user ? "/feed" : "/"} className="flex items-center gap-3 shrink-0">
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg font-bold text-primary-foreground">S</span>
          </motion.div>
          <span className="hidden text-xl font-bold text-foreground sm:block">Social</span>
        </Link>

        {/* Desktop Navigation */}
        {user && !isMobile && (
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <motion.div key={item.href} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <NotificationBadge
                        count={item.badge}
                        className="absolute -right-1 -top-1"
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <>
             
              
              {/* User Menu Dropdown */}
              <div className="relative ml-1">
                <motion.button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full p-0.5 ring-offset-background transition-all hover:ring-2 hover:ring-primary/20"
                >
                  <Avatar
                    src={user.image}
                    name={user.name || user.username}
                    size="sm"
                  />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover py-1 shadow-lg shadow-black/5"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      >
                        <div className="px-4 py-3 bg-muted/30">
                          <p className="text-sm font-semibold text-foreground truncate">{user.name || user.username}</p>
                          <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                        </div>
                        <div className="p-1">
                          <MenuLink href={`/profile/${user.username}`} icon={User} label="Profile" onClick={() => setUserMenuOpen(false)} />
                          <MenuLink href="/settings" icon={Settings} label="Settings" onClick={() => setUserMenuOpen(false)} />
                          <div className="my-1 border-t border-border" />
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Nav Sidebar */}
      <AnimatePresence>
        {user && mobileMenuOpen && isMobile && (
          <motion.nav
            className="border-t border-border bg-background px-4 py-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="grid grid-cols-1 gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-muted-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              {/* Доп. ссылка в мобильном меню, если нужно */}
              <Link
                href="/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-primary"
              >
                <PlusSquare className="h-5 w-5" />
                <span>Создать пост</span>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function MenuLink({ href, icon: Icon, label, onClick }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent"
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}