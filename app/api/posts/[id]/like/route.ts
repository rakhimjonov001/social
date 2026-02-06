import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Force Node.js runtime for Prisma and auth compatibility
export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  // 1. Изменяем тип на Promise
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Ждем получения postId
    const { id: postId } = await params; 
    const userId = session.user.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Check if user already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    let isLiked: boolean;

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      isLiked = false;
    } else {
      // Like the post
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      isLiked = true;

      // Create notification if liking someone else's post
      if (post.authorId !== userId) {
        await prisma.notification.create({
          data: {
            type: "LIKE",
            senderId: userId,
            receiverId: post.authorId,
            postId,
          },
        });
      }
    }

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json({
      success: true,
      isLiked,
      likeCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}