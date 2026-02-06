/**
 * Global Loading Component
 * 
 * Displayed while pages are loading
 */

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
