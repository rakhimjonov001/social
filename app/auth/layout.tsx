/**
 * Auth Layout
 * 
 * Layout for authentication pages (login, register)
 */

import { Suspense } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}
