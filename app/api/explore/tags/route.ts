import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      select: { content: true },
      take: 100,
      orderBy: { createdAt: 'desc' }
    });

    const tagMap: Record<string, number> = {};
    
    posts.forEach(post => {
      // Ищем все слова, начинающиеся с #
      const tags = post.content.match(/#[\wа-яА-Я]+/g);
      if (tags) {
        tags.forEach(tag => {
          const cleanTag = tag.toLowerCase().replace("#", "");
          tagMap[cleanTag] = (tagMap[cleanTag] || 0) + 1;
        });
      }
    });

    const tags = Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return NextResponse.json({ tags });
  } catch (error) {
    return NextResponse.json({ tags: [] });
  }
}