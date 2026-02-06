import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { NextAuthConfig, DefaultSession } from "next-auth";

// Расширяем типы для TS
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"]
  }
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt", // Оставляем JWT, это правильно для Middleware
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // Если юзер зашел через OAuth, у него может не быть пароля
        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    // ВАЖНО: Проверка авторизации для Middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnFeed = nextUrl.pathname.startsWith("/feed");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      if (isOnFeed && !isLoggedIn) return false; // Редирект на логин
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/feed", nextUrl));
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
      }
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  // Отключаем debug в продакшене, чтобы не спамить в консоль
  debug: process.env.NODE_ENV === "development",
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);