import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Force Node.js runtime for uploadthing compatibility
export const runtime = 'nodejs';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});