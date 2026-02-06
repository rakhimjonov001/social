/**
 * Post Detail Page
 *
 * Single post view with comments
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PostCard } from "@/components/features/post-card";
import { CommentSection } from "@/components/features/comment-section";

interface PostPageProps {
  params: Promise<{ id: string }>;
}

async function getPost(id: string, currentUserId?: string) {
  const post = await prisma.post.findUnique({
    where: { id },
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

  if (!post) return null;

  return {
    ...post,
    isLiked: currentUserId
      ? post.likes && post.likes.length > 0
      : false,
  };
}

async function getPostComments(postId: string) {
  const comments = await prisma.comment.findMany({
    where: { postId },
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
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return comments;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { id } = await params;

  const post = await getPost(id);

  if (!post) {
    return { title: "Post Not Found | Social" };
  }

  return {
    title: `${post.author.name || post.author.username} on Social: "${post.content.slice(
      0,
      50
    )}..."`,
    description: post.content.slice(0, 160),
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  const session = await auth();
  const user = session?.user?.id
    ? await getCurrentUser()
    : null;

  const post = await getPost(id, session?.user?.id);

  if (!post) {
    notFound();
  }

  const comments = await getPostComments(id);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/feed">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Button>
        </Link>
      </div>

      {/* Post */}
      <PostCard
        post={{
          id: post.id,
          content: post.content,
          image: post.image,
          createdAt: post.createdAt,
          author: post.author,
          _count: post._count,
          isLiked: post.isLiked,
        }}
        currentUserId={session?.user?.id}
      />

      {/* Comments Section */}
      <Card className="p-4">
        <h2 className="mb-4 text-lg font-semibold">
          Comments ({post._count.comments})
        </h2>
        <CommentSection
          postId={post.id}
          initialComments={comments}
          currentUserId={session?.user?.id}
          currentUser={
            user
              ? {
                  name: user.name,
                  username: user.username,
                  image: user.image,
                }
              : undefined
          }
        />
      </Card>
    </div>
  );
}
