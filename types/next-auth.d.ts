/**
 * NextAuth.js Type Declarations
 * 
 * Extends the default NextAuth types to include custom user properties
 */

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extended Session interface
   */
  interface Session {
    user: {
      id: string;
      username: string;
    } & DefaultSession["user"];
  }

  /**
   * Extended User interface
   */
  interface User extends DefaultUser {
    username?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extended JWT interface
   */
  interface JWT extends DefaultJWT {
    id?: string;
    username?: string;
  }
}
