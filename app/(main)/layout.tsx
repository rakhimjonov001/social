/**
 * Main Layout
 * 
 * Layout for authenticated pages with navbar, sidebar, and mobile navigation
 * Redesigned with modern minimalistic style and design tokens
 */

import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/actions/users";
import { getUnreadNotificationCount } from "@/actions/notifications";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";


export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user?.id ? await getCurrentUser() : null;
  const notificationCount = session?.user?.id
    ? await getUnreadNotificationCount()
    : 0;

  const userForNav = user
    ? {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        role: user.role,
      }
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar
        user={userForNav}
        notificationCount={notificationCount}
      />

      {/* Main Content Area */}
      <div className="relative">
        <div className={`min-h-screen py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${session?.user ? 'lg:pr-80' : ''}`}>
          <div className="flex gap-8">
            {/* Main Content */}
            <main className="min-w-0 flex-1">
              {children}
            </main>

            {/* Desktop Sidebar */}
            {session?.user && (
              <Suspense fallback={<div className="w-80 hidden lg:block" />}>
                <Sidebar />
              </Suspense>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileNav
          user={userForNav}
          notificationCount={notificationCount}
        />

       
        
      </div>

      {/* Mobile Navigation Spacer */}
      {session?.user && (
        <div className="h-20 lg:hidden" />
      )}
    </div>
  );
}
