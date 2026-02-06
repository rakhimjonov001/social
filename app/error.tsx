"use client";

/**
 * Error Page
 *
 * Global error boundary for the application
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold">Something went wrong!</h1>
        <p className="mt-2 text-gray-500">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          {/* ✅ Replaced <Link><Button></Button></Link> with router.push().
              Nesting <Link> around <Button> creates nested interactive
              elements (<a> inside <button>) which breaks serialisation. */}
          <Button variant="outline" onClick={() => router.push("/")}>
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}