"use server";

/**
 * User Server Actions
 * * Server-side actions for user management:
 * - Get user profile
 * - Update profile
 * - Search users
 */

import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { updateProfileSchema } from "../lib/validations";
import { revalidatePath } from "next/cache";

// ==========================================
// TYPES
// ==========================================

export type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: unknown;
};

export type UserProfile = {
  id: string;
  name: string | null;
  username: string; // Строго строка
  email: string;
  image: string | null;
  bio: string | null;
  createdAt: Date;
  _count: {
    posts: number;
    followers: number;
    following: number;
  };
  isFollowing: boolean;
  isOwnProfile: boolean;
};

// ==========================================
// GET USER PROFILE
// ==========================================

export async function getUserProfile(
  username: string
): Promise<UserProfile | null> {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  // Если юзера нет или у него нет ника (защита от null)
  if (!user || user.username === null) {
    return null;
  }

  // Проверяем подписку
  let isFollowing = false;
  if (currentUserId && currentUserId !== user.id) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!follow;
  }

  // Явно формируем объект, чтобы TS не ругался на string | null
  return {
    id: user.id,
    name: user.name,
    username: user.username, // Теперь TS понимает, что это string из-за проверки выше
    email: user.email,
    image: user.image,
    bio: user.bio,
    createdAt: user.createdAt,
    _count: user._count,
    isFollowing,
    isOwnProfile: currentUserId === user.id,
  };
}

// ==========================================
// GET CURRENT USER
// ==========================================

export async function getCurrentUser() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      image: true,
      bio: true,
      role: true,
    },
  });

  return user;
}

// ==========================================
// UPDATE PROFILE
// ==========================================

export async function updateProfile(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to update your profile",
      };
    }

    const rawData = {
      name: formData.get("name") || undefined,
      username: formData.get("username") || undefined,
      bio: formData.get("bio") || null,
      image: formData.get("image") || null,
    };

    const validatedData = updateProfileSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { name, username, bio, image } = validatedData.data;

    // Проверка уникальности
    if (username && username !== (session.user as any).username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return {
          success: false,
          errors: { username: ["This username is already taken"] },
        };
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(image !== undefined && { image }),
      },
    });

    // Безопасная ревалидация
    const oldUsername = (session.user as any).username;
    if (oldUsername) revalidatePath(`/profile/${oldUsername}`);
    if (updatedUser.username) revalidatePath(`/profile/${updatedUser.username}`);
    
    revalidatePath("/settings");

    return {
      success: true,
      message: "Profile updated successfully!",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      message: "Failed to update profile. Please try again.",
    };
  }
}

// ==========================================
// SEARCH USERS
// ==========================================

export async function searchUsers(
  query: string,
  limit: number = 10
) {
  if (!query || query.length < 2) {
    return [];
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
    },
    take: limit,
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  });

  // Используем маппинг для гарантии, что username не null для TS
  return users.map(u => ({
    ...u,
    username: u.username as string
  }));
}

// ==========================================
// GET SUGGESTED USERS
// ==========================================

export async function getSuggestedUsers(
  limit: number = 5
) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  let excludeIds: string[] = [];
  
  if (currentUserId) {
    const following = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });
    excludeIds = following.map((f) => f.followingId);
    excludeIds.push(currentUserId); 
  }

  const users = await prisma.user.findMany({
    where: {
      id: { notIn: excludeIds },
    },
    take: limit,
    orderBy: {
      followers: { _count: "desc" },
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
    },
  });

  return users.map((user) => ({
    ...user,
    username: user.username as string, 
    isFollowing: false,
  }));
}