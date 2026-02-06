"use server";

/**
 * Comment Server Actions
 * 
 * Server-side actions for comment management:
 * - Create comments
 * - Delete comments
 * - Get comments for a post
 */

import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { createCommentSchema } from "../lib/validations";
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

export type CommentWithAuthor = {
  id: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
};

// ==========================================
// CREATE COMMENT
// ==========================================

export async function createComment(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to comment",
      };
    }

    const rawData = {
      content: formData.get("content"),
      postId: formData.get("postId"),
    };

    const validatedData = createCommentSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { content, postId } = validatedData.data;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // Create comment and notification in transaction
    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          content,
          postId,
          authorId: session.user.id,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });

      // Create notification if commenting on someone else's post
      if (post.authorId !== session.user.id) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            senderId: session.user.id,
            receiverId: post.authorId,
            postId,
            commentId: newComment.id,
          },
        });
      }

      return newComment;
    });

    revalidatePath("/feed");
    revalidatePath(`/post/${postId}`);

    return {
      success: true,
      message: "Comment added!",
      data: comment,
    };
  } catch (error) {
    console.error("Create comment error:", error);
    return {
      success: false,
      message: "Failed to add comment. Please try again.",
    };
  }
}

// ==========================================
// DELETE COMMENT
// ==========================================

export async function deleteComment(commentId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to delete a comment",
      };
    }

    // Check if comment exists and belongs to user
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true },
    });

    if (!comment) {
      return {
        success: false,
        message: "Comment not found",
      };
    }

    if (comment.authorId !== session.user.id) {
      return {
        success: false,
        message: "You can only delete your own comments",
      };
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    revalidatePath("/feed");
    revalidatePath(`/post/${comment.postId}`);

    return {
      success: true,
      message: "Comment deleted!",
    };
  } catch (error) {
    console.error("Delete comment error:", error);
    return {
      success: false,
      message: "Failed to delete comment. Please try again.",
    };
  }
}

// ==========================================
// GET POST COMMENTS
// ==========================================

export async function getPostComments(
  postId: string,
  cursor?: string,
  limit: number = 10
): Promise<{ comments: CommentWithAuthor[]; nextCursor: string | null }> {
  const comments = await prisma.comment.findMany({
    where: { postId },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  let nextCursor: string | null = null;
  if (comments.length > limit) {
    const nextItem = comments.pop();
    nextCursor = nextItem!.id;
  }

  return {
    comments: comments as CommentWithAuthor[],
    nextCursor,
  };
}
