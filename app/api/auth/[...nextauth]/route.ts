/**
 * NextAuth.js API Route Handler
 * 
 * Handles all authentication-related API requests:
 * - /api/auth/signin
 * - /api/auth/signout
 * - /api/auth/callback/:provider
 * - /api/auth/session
 * - /api/auth/csrf
 * - /api/auth/providers
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
