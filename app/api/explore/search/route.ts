import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  if (!query) return NextResponse.json({ posts: [], users: [] });

  const [posts, users] = await Promise.all([
    prisma.post.findMany({
      where: {
        content: { contains: query, mode: "insensitive" }
      },
      include: {
        author: true, // В схеме это author
        likes: true,  // Нужно для кнопок
        _count: { select: { likes: true, comments: true } }
      },
      take: 20,
    }),
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { username: { contains: query, mode: "insensitive" } }
        ]
      },
      select: { id: true, username: true, name: true, image: true },
      take: 5
    })
  ]);
  return NextResponse.json({ posts, users });
}