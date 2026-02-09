"use server";

import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// TYPES
// ==========================================

export type UserProfile = {
  id: string;
  name: string | null;
  username: string; 
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

export async function getUserProfile(username: string): Promise<UserProfile | null> {
  try {
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

    if (!user) return null;

    let isFollowing = false;
    if (currentUserId) {
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

    return {
      ...user,
      isFollowing,
      isOwnProfile: currentUserId === user.id,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

// ==========================================
// UPDATE USER PROFILE
// ==========================================

export async function updateUserProfile(data: {
  name?: string;
  bio?: string;
  image?: string;
  username?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data,
    });

    if (updatedUser.username) {
      revalidatePath(`/profile/${updatedUser.username}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false };
  }
}