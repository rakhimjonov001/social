import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentId: z.string().optional().nullable(),
});

// 1. params теперь Promise
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "20");
    
    // 2. Ожидаем params
    const { id: postId } = await params;

    const session = await auth();

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { 
        postId,
        parentId: null // Only get top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true, 
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
                
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });

    const hasNextPage = comments.length > limit;
    const commentsToReturn = hasNextPage ? comments.slice(0, -1) : comments;
    const nextCursor = hasNextPage ? comments[comments.length - 1].id : null;

    return NextResponse.json({
      comments: commentsToReturn,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// 1. params теперь Promise и для POST
export async function POST(
  request: NextRequest,
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

    // 2. Ожидаем params
    const { id: postId } = await params;
    const body = await request.json();
    const { content, parentId } = createCommentSchema.parse(body);

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

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
        select: { id: true, postId: true },
      });

      if (!parentComment || parentComment.postId !== postId) {
        return NextResponse.json(
          { error: "Parent comment not found or doesn't belong to this post" },
          { status: 404 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.user.id,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            
          },
        },
      },
    });

    // Create notification if commenting on someone else's post
    if (post.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          senderId: session.user.id,
          receiverId: post.authorId,
          postId,
          commentId: comment.id,
        },
      });
    }

    return NextResponse.json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}