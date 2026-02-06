"use server";

/**
 * Post Server Actions
 * 
 * Server-side actions for post management:
 * - Create posts
 * - Delete posts
 * - Like/unlike posts
 * - Get feed posts
 */

import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";
import { createPostSchema } from "../lib/validations";
import { revalidatePath } from "next/cache";

// ==========================================
// TYPES
// ==========================================
// Внутри getUserPosts
export type ActionResult = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: unknown;
};

export type PostWithAuthor = {
  id: string;
  content: string;
  image: string | null;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLiked: boolean;
};

// ==========================================
// CREATE POST
// ==========================================

export async function createPost(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to create a post",
      };
    }

    const rawData = {
      content: formData.get("content"),
      image: formData.get("image") || null,
    };

    const validatedData = createPostSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const { content, image } = validatedData.data;

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: session.user.id,
      },
    });

    revalidatePath("/feed");
    revalidatePath(`/profile/${session.user.username}`);

    return {
      success: true,
      message: "Post created successfully!",
      data: post,
    };
  } catch (error) {
    console.error("Create post error:", error);
    return {
      success: false,
      message: "Failed to create post. Please try again.",
    };
  }
}

// ==========================================
// DELETE POST
// ==========================================

export async function deletePost(postId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to delete a post",
      };
    }

    // Check if post exists and belongs to user
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    if (post.authorId !== session.user.id) {
      return {
        success: false,
        message: "You can only delete your own posts",
      };
    }
    
    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/feed");
    revalidatePath(`/profile/${session.user.username}`);

    return {
      success: true,
      message: "Post deleted successfully!",
    };
  } catch (error) {
    console.error("Delete post error:", error);
    return {
      success: false,
      message: "Failed to delete post. Please try again.",
    };
  }
}

// ==========================================
// LIKE POST
// ==========================================

export async function likePost(postId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to like a post",
      };
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });
    
    if (existingLike) {
      return {
        success: false,
        message: "You have already liked this post",
      };
    }

    // Get post author for notification
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // Create like and notification in transaction
    await prisma.$transaction(async (tx) => {
      await tx.like.create({
        data: {
          userId: session.user.id,
          postId,
        },
      });

      // Create notification if liking someone else's post
      if (post.authorId !== session.user.id) {
        await tx.notification.create({
          data: {
            type: "LIKE",
            senderId: session.user.id,
            receiverId: post.authorId,
            postId,
          },
        });
      }
    });

    revalidatePath("/feed");

    return {
      success: true,
      message: "Post liked!",
    };
  } catch (error) {
    console.error("Like post error:", error);
    return {
      success: false,
      message: "Failed to like post. Please try again.",
    };
  }
}

// ==========================================
// UNLIKE POST
// ==========================================

export async function unlikePost(postId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to unlike a post",
      };
    }
    
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });

    revalidatePath("/feed");

    return {
      success: true,
      message: "Post unliked!",
    };
  } catch (error) {
    console.error("Unlike post error:", error);
    return {
      success: false,
      message: "Failed to unlike post. Please try again.",
    };
  }
}

// ==========================================
// TOGGLE LIKE
// ==========================================

export async function toggleLike(postId: string): Promise<ActionResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to like a post",
      };
    }
    
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    });
    
    if (existingLike) {
      return unlikePost(postId);
    } else {
      return likePost(postId);
    }
  } catch (error) {
    console.error("Toggle like error:", error);
    return {
      success: false,
      message: "Failed to toggle like. Please try again.",
    };
  }
}

// ==========================================
// GET FEED POSTS
// ==========================================

export async function getFeedPosts(
  cursor?: string,
  limit: number = 10
): Promise<{ posts: PostWithAuthor[]; nextCursor: string | null }> {
  const session = await auth();
  const userId = session?.user?.id;

  const posts = await prisma.post.findMany({
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
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: userId
        ? {
          where: { userId },
          select: { id: true },
        }
        : false,
    },
  });

  let nextCursor: string | null = null;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem!.id;
  }

  const postsWithLikeStatus = posts.map((post) => ({
    ...post,
    isLiked: userId ? post.likes && post.likes.length > 0 : false,
    likes: undefined, // Remove likes array from response
  }));

  return {
    posts: postsWithLikeStatus as PostWithAuthor[],
    nextCursor,
  };
}

// ==========================================
// GET FOLLOWING FEED
// ==========================================

export async function getFollowingFeed(
  cursor?: string,
  limit: number = 10
): Promise<{ posts: PostWithAuthor[]; nextCursor: string | null }> {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { posts: [], nextCursor: null };
  }

  const userId = session.user.id;

  // Get list of users the current user follows
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);
  
  // Include own posts in the feed
  followingIds.push(userId);
  
  const posts = await prisma.post.findMany({
    where: {
      authorId: { in: followingIds },
    },
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
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: {
        where: { userId },
        select: { id: true },
      },
    },
  });

  let nextCursor: string | null = null;
  if (posts.length > limit) {
    const nextItem = posts.pop();
    nextCursor = nextItem!.id;
  }
  
  const postsWithLikeStatus = posts.map((post) => ({
    ...post,
    isLiked: post.likes.length > 0,
    likes: undefined,
  }));
  
  return {
    posts: postsWithLikeStatus as PostWithAuthor[],
    nextCursor,
  };
}

// ==========================================
// GET USER POSTS
// ==========================================

export async function getUserPosts(
  username: string,
  cursor?: string,
  limit: number = 10
): Promise<{ posts: PostWithAuthor[]; nextCursor: string | null }> {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) {
    return { posts: [], nextCursor: null };
  }

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
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
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
      likes: currentUserId
        ? {
            where: { userId: currentUserId },
            select: { id: true },
          }
        : false,
      },
    });
    
    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem!.id;
    }
    
    const postsWithLikeStatus = posts.map((post) => ({
      ...post,
      isLiked: currentUserId ? post.likes && post.likes.length > 0 : false,
    likes: undefined,
  }));
  
  return {
    posts: postsWithLikeStatus as PostWithAuthor[],
    nextCursor,
  };
}

