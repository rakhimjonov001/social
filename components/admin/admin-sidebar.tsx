/**
 * Admin Sidebar Component
 * 
 * Navigation sidebar for admin panel
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageCircle,
  BarChart3,
  Settings,
  Shield,
  Flag
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside 
      className="w-64 border-r border-border bg-surface/50 p-6"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <nav className="space-y-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary-500 text-white shadow-md"
                    : "text-muted hover:bg-surface hover:text-foreground hover:shadow-sm"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </motion.aside>
  );
}