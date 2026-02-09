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
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const username = (auth?.user as any)?.username;
      
      // Логика: если ник содержит нижнее подчеркивание (наш временный формат), 
      // значит юзер еще не прошел онбординг
      const isTempUsername = username?.includes("_");

      const isOnFeed = nextUrl.pathname.startsWith("/feed");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");
      const isOnOnboarding = nextUrl.pathname.startsWith("/onboarding");

      // 1. Если не залогинен — пускаем только на Auth
      if (!isLoggedIn) {
        return isOnAuth || nextUrl.pathname === "/" ;
      }

      // 2. Если залогинен и ник временный — гоним на /onboarding
      if (isLoggedIn && isTempUsername && !isOnOnboarding) {
        return Response.redirect(new URL("/onboarding", nextUrl));
      }

      // 3. Если залогинен и ник уже нормальный — не пускаем на Onboarding и Auth
      if (isLoggedIn && !isTempUsername && (isOnAuth || isOnOnboarding)) {
        return Response.redirect(new URL("/feed", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;