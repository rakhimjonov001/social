import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const posts = await prisma.post.findMany({
      where: {
        // Так как поля tags нет, категорию пока игнорируем 
        // или ищем по вхождению слова в контент
        ...(category && category !== "trending" 
          ? { content: { contains: category, mode: "insensitive" } } 
          : {})
      },
      include: {
        author: true, // ИСПРАВЛЕНО: было user
        _count: { select: { likes: true, comments: true } }
      },
      orderBy: category === "trending" 
        ? [{ likes: { _count: "desc" } }, { createdAt: "desc" }] 
        : { createdAt: "desc" },
      take: 20,
    });
    return NextResponse.json({ posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch popular" }, { status: 500 });
  }
}