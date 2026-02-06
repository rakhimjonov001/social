"use server";

/**
 * Authentication Server Actions
 * 
 * Server-side actions for user authentication:
 * - Register new users
 * - Login with credentials
 * - Logout
 */

import { signIn, signOut } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { registerSchema, loginSchema } from "../lib/validations";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// ==========================================
// TYPES
// ==========================================

export type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

// ==========================================
// REGISTER ACTION
// ==========================================

export async function register(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Parse and validate form data
    const rawData = {
      name: formData.get("name"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validatedData = registerSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { name, username, email, password } = validatedData.data;

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return {
        success: false,
        errors: { email: ["This email is already registered"] },
      };
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return {
        success: false,
        errors: { username: ["This username is already taken"] },
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account created successfully! Please sign in.",
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

// ==========================================
// LOGIN ACTION
// ==========================================

export async function login(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    // Parse and validate form data
    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatedData = loginSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { email, password } = validatedData.data;

    // Attempt to sign in
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      message: "Logged in successfully!",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            message: "Invalid email or password",
          };
        default:
          return {
            success: false,
            message: "An authentication error occurred",
          };
      }
    }
    
    console.error("Login error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

// ==========================================
// LOGOUT ACTION
// ==========================================

export async function logout(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

// ==========================================
// OAUTH SIGN IN ACTIONS
// ==========================================

export async function signInWithGitHub(): Promise<void> {
  await signIn("github", { redirectTo: "/feed" });
}

export async function signInWithGoogle(): Promise<void> {
  await signIn("google", { redirectTo: "/feed" });
}

// ==========================================
// REDIRECT AFTER AUTH
// ==========================================

export async function redirectToFeed(): Promise<never> {
  redirect("/feed");
}

export async function redirectToLogin(): Promise<never> {
  redirect("/auth/login");
}
