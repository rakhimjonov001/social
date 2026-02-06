import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Force Node.js runtime for Prisma and auth compatibility
export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> } // ← Добавь Promise
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { username } = await params; // ← Добавь await
    const followerId = session.user.id;

    // Find the user to follow
    const userToFollow = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!userToFollow) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (userToFollow.id === followerId) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: userToFollow.id,
        },
      },
    });

    let isFollowing: boolean;

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      isFollowing = false;
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId,
          followingId: userToFollow.id,
        },
      });
      isFollowing = true;

      // Create notification
      await prisma.notification.create({
        data: {
          type: "FOLLOW",
          senderId: followerId,
          receiverId: userToFollow.id,
        },
      });
    }

    // Get updated follower count
    const followerCount = await prisma.follow.count({
      where: { followingId: userToFollow.id },
    });

    return NextResponse.json({
      success: true,
      isFollowing,
      followerCount,
    });
  } catch (error) {
    console.error("Error toggling follow:", error);
    return NextResponse.json(
      { error: "Failed to toggle follow" },
      { status: 500 }
    );
  }
}