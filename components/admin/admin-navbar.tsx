"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, LogOut, Home, User as UserIcon, Settings as SettingsIcon } from "lucide-react";
import { 
  Avatar, 
  Button, 
  ThemeToggle, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownItem, 
  DropdownLabel, 
  DropdownSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui";
// Импортируем функцию логаута из твоего файла с экшенами
import { logout } from "@/actions/auth";

interface AdminNavbarProps {
  user: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
    role: string;
  };
}

export function AdminNavbar({ user }: AdminNavbarProps) {
  // Функция для обработки выхода
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
    >
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg transition-transform group-hover:scale-105">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-foreground">Admin Panel</span>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Social Management</div>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/feed">
            <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-accent">
              <Home className="mr-2 h-4 w-4" />
              Site
            </Button>
          </Link>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild> 
              <button className="outline-none flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-foreground leading-none">{user.name}</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-tighter">Admin</p>
                </div>
                <Avatar src={user.image} name={user.name || ""} className="border-2 border-primary/20" />
              </button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 bg-card border-border backdrop-blur-xl">
              <DropdownLabel className="text-muted-foreground font-normal">Account</DropdownLabel>
              <DropdownItem asChild>
                <Link href={`/profile/${user.username}`} className="flex items-center gap-2 cursor-pointer w-full">
                  <UserIcon className="w-4 h-4" /> Profile
                </Link>
              </DropdownItem>
              <DropdownItem asChild>
                <Link href="/admin/settings" className="flex items-center gap-2 cursor-pointer w-full">
                  <SettingsIcon className="w-4 h-4" /> Settings
                </Link>
              </DropdownItem>
              <DropdownSeparator />
              
              {/* Логика выхода заменена на onClick с вызовом функции logout */}
              <DropdownItem 
                onClick={handleLogout}
                className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2 w-full font-medium"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </DropdownItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}