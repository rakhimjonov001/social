import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Force Node.js runtime for Prisma and auth compatibility
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  // 1. Оборачиваем params в Promise (обязательно для Next.js 15)
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");

    // 2. Ждем разрешения промиса, чтобы получить username
    const { username } = await params;

    const session = await auth();

    // Find the user
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            // Никакого verified — как мы и договорились!
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: session?.user?.id
          ? {
              where: { userId: session.user.id },
              select: { id: true },
            }
          : false,
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });

    const hasNextPage = posts.length > limit;
    const postsToReturn = hasNextPage ? posts.slice(0, -1) : posts;
    const nextCursor = hasNextPage ? posts[posts.length - 1].id : null;

    const transformedPosts = postsToReturn.map(post => ({
      ...post,
      isLiked: Array.isArray(post.likes) ? post.likes.length > 0 : false,
      likes: undefined, 
    }));

    return NextResponse.json({
      posts: transformedPosts,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch user posts" },
      { status: 500 }
    );
  }
}