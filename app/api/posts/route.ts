import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1).max(2000),
  image: z.string().url().optional().or(z.literal("")),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "all";
    const targetUserId = searchParams.get("userId");

    const session = await auth();
    // Типизируем объект фильтрации
    let whereClause: any = {};

    if (targetUserId) {
      whereClause.authorId = targetUserId;
    } else if (type === "following" && session?.user?.id) {
      const following = await prisma.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true },
      });
      const followingIds = following.map(f => f.followingId);
      // Добавляем свои посты в ленту подписок
      followingIds.push(session.user.id);
      whereClause.authorId = { in: followingIds };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: { id: true, username: true, name: true, image: true },
        },
        _count: { select: { likes: true, comments: true } },
        likes: session?.user?.id
          ? { where: { userId: session.user.id }, select: { id: true } }
          : false,
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && { cursor: { id: cursor }, skip: 1 }),
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
    console.error("GET posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
      const session = await auth();
      if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const body = await request.json();
      
      // Валидация данных
      const result = createPostSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json({ error: "Invalid input", details: result.error.issues }, { status: 400 });
      }
      
      const { content, image } = result.data;
  
      const post = await prisma.post.create({
        // Если image — пустая строка, лучше записать null для чистоты БД
        data: { 
          content, 
          image: image || null, 
          authorId: session.user.id 
        },
        include: {
          author: { select: { id: true, username: true, name: true, image: true } },
          _count: { select: { likes: true, comments: true } },
        },
      });
  
      return NextResponse.json({ ...post, isLiked: false });
    } catch (error) {
      console.error("POST post error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}