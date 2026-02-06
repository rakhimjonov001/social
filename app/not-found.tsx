"use client";

/**
 * 404 Not Found Page
 */

import Link from "next/link";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
        <p className="mt-2 text-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          {/* ✅ Link wraps Button (not the other way around) */}
          <Link href="/">
            <Button>
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>

          {/* ✅ onClick now works — "use client" is at the top */}
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}