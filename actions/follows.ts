"use server";

/**
 * Follow Server Actions
 * 
 * Server-side actions for follow management:
 * - Follow user
 * - Unfollow user
 * - Get followers/following lists
 */

import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// TYPES
// ==========================================

export type ActionResult = {
  success: boolean;
  message?: string;
  data?: unknown;
};

export type UserPreview = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  bio: string | null;
  isFollowing: boolean;
};

// ==========================================
// FOLLOW USER
// ==========================================

export async function followUser(userId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to follow users",
      };
    }

    if (session.user.id === userId) {
      return {
        success: false,
        message: "You cannot follow yourself",
      };
    }

    // Check if user exists
    const userToFollow = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });

    if (!userToFollow) {
      return {
        success: false,
        message: "User not found",
      };
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      return {
        success: false,
        message: "You are already following this user",
      };
    }

    // Create follow and notification in transaction
    await prisma.$transaction(async (tx) => {
      await tx.follow.create({
        data: {
          followerId: session.user.id,
          followingId: userId,
        },
      });

      // Create notification
      await tx.notification.create({
        data: {
          type: "FOLLOW",
          senderId: session.user.id,
          receiverId: userId,
        },
      });
    });

    revalidatePath(`/profile/${userToFollow.username}`);
    revalidatePath(`/profile/${session.user.username}`);

    return {
      success: true,
      message: "Successfully followed user!",
    };
  } catch (error) {
    console.error("Follow user error:", error);
    return {
      success: false,
      message: "Failed to follow user. Please try again.",
    };
  }
}

// ==========================================
// UNFOLLOW USER
// ==========================================

export async function unfollowUser(userId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to unfollow users",
      };
    }

    if (session.user.id === userId) {
      return {
        success: false,
        message: "You cannot unfollow yourself",
      };
    }

    // Get user for revalidation
    const userToUnfollow = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true },
    });

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    });

    if (userToUnfollow) {
      revalidatePath(`/profile/${userToUnfollow.username}`);
    }
    revalidatePath(`/profile/${session.user.username}`);

    return {
      success: true,
      message: "Successfully unfollowed user!",
    };
  } catch (error) {
    console.error("Unfollow user error:", error);
    return {
      success: false,
      message: "Failed to unfollow user. Please try again.",
    };
  }
}

// ==========================================
// TOGGLE FOLLOW
// ==========================================

export async function toggleFollow(userId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to follow users",
      };
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      return unfollowUser(userId);
    } else {
      return followUser(userId);
    }
  } catch (error) {
    console.error("Toggle follow error:", error);
    return {
      success: false,
      message: "Failed to toggle follow. Please try again.",
    };
  }
}

// ==========================================
// GET FOLLOWERS
// ==========================================

export async function getFollowers(
  username: string,
  cursor?: string,
  limit: number = 20
): Promise<{ users: UserPreview[]; nextCursor: string | null }> {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) {
    return { users: [], nextCursor: null };
  }

  const followers = await prisma.follow.findMany({
    where: { followingId: user.id },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
        },
      },
    },
  });

  let nextCursor: string | null = null;
  if (followers.length > limit) {
    const nextItem = followers.pop();
    nextCursor = nextItem!.id;
  }

  // Check if current user follows each follower
  let followingIds: string[] = [];
  if (currentUserId) {
    const following = await prisma.follow.findMany({
      where: {
        followerId: currentUserId,
        followingId: { in: followers.map((f) => f.follower.id) },
      },
      select: { followingId: true },
    });
    followingIds = following.map((f) => f.followingId);
  }

  const users = followers.map((f) => ({
    ...f.follower,
    isFollowing: followingIds.includes(f.follower.id),
  }));

  return {
    users,
    nextCursor,
  };
}

// ==========================================
// GET FOLLOWING
// ==========================================

export async function getFollowing(
  username: string,
  cursor?: string,
  limit: number = 20
): Promise<{ users: UserPreview[]; nextCursor: string | null }> {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) {
    return { users: [], nextCursor: null };
  }

  const following = await prisma.follow.findMany({
    where: { followerId: user.id },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          bio: true,
        },
      },
    },
  });

  let nextCursor: string | null = null;
  if (following.length > limit) {
    const nextItem = following.pop();
    nextCursor = nextItem!.id;
  }

  // Check if current user follows each user
  let followingIds: string[] = [];
  if (currentUserId) {
    const currentUserFollowing = await prisma.follow.findMany({
      where: {
        followerId: currentUserId,
        followingId: { in: following.map((f) => f.following.id) },
      },
      select: { followingId: true },
    });
    followingIds = currentUserFollowing.map((f) => f.followingId);
  }

  const users = following.map((f) => ({
    ...f.following,
    isFollowing: followingIds.includes(f.following.id),
  }));

  return {
    users,
    nextCursor,
  };
}

// ==========================================
// CHECK IF FOLLOWING
// ==========================================

export async function isFollowing(userId: string): Promise<boolean> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return false;
  }

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: userId,
      },
    },
  });

  return !!follow;
}
