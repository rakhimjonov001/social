import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // Переносим callback authorized сюда для Middleware
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnFeed = nextUrl.pathname.startsWith("/feed");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      if (isOnFeed && !isLoggedIn) return false;
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/feed", nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;