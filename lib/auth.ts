import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import type { DefaultSession } from "next-auth";

// Расширяем типы сессии
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  providers: [
    ...authConfig.providers,
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

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
    ...authConfig.callbacks,
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // Берем username прямо из объекта user, который вернула база или OAuth
        token.username = (user as any).username;
      }
      
      // Позволяет обновлять сессию на лету (например, после смены ника)
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },

  // ГЕНЕРАЦИЯ USERNAME ПРИ ВХОДЕ ЧЕРЕЗ GOOGLE/GITHUB
  events: {
    async createUser({ user }) {
      // Это сработает только один раз при регистрации через OAuth
      if (!user.username) {
        const baseName = user.email?.split("@")[0] || "user";
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const generatedUsername = `${baseName}_${randomSuffix}`;

        await prisma.user.update({
          where: { id: user.id },
          data: { username: generatedUsername },
        });
        
        // Обновляем объект пользователя, чтобы он попал в JWT
        user.username = generatedUsername;
      }
    },
  },
  
  debug: process.env.NODE_ENV === "development",
});